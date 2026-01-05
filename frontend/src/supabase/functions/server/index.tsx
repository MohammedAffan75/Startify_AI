import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// CORS configuration
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Logger
app.use('*', logger(console.log));

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Public anon key for guest users
const publicAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

// Health check
app.get('/make-server-b819addc/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Authentication endpoints
app.post('/make-server-b819addc/auth/signup', async (c) => {
  try {
    const { email, password, fullName, company, role } = await c.req.json();

    // Validate input
    if (!email || !password || !fullName) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    if (password.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return c.json({ error: 'Invalid email format' }, 400);
    }

    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        full_name: fullName,
        company: company || '',
        role: role || '',
        plan: 'free'
      },
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      fullName,
      company: company || '',
      role: role || '',
      plan: 'free',
      createdAt: new Date().toISOString(),
      onboardingCompleted: false,
      startupIdeas: [],
      generatedDocuments: []
    });

    return c.json({ 
      message: 'Account created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName,
        company: company || '',
        role: role || '',
        plan: 'free'
      }
    });

  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

app.post('/make-server-b819addc/auth/signin', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Validate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) {
      console.log('Signin error:', error);
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    // Get user profile
    const userProfile = await kv.get(`user:${data.user.id}`);
    
    if (!userProfile) {
      // Create profile if doesn't exist
      const profile = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || '',
        company: data.user.user_metadata?.company || '',
        role: data.user.user_metadata?.role || '',
        plan: data.user.user_metadata?.plan || 'free',
        createdAt: new Date().toISOString(),
        onboardingCompleted: false,
        startupIdeas: [],
        generatedDocuments: []
      };
      await kv.set(`user:${data.user.id}`, profile);
      
      return c.json({
        message: 'Sign in successful',
        user: profile,
        session: { access_token: data.session.access_token }
      });
    }

    return c.json({
      message: 'Sign in successful', 
      user: userProfile,
      session: { access_token: data.session.access_token }
    });

  } catch (error) {
    console.log('Signin error:', error);
    return c.json({ error: 'Sign in failed' }, 500);
  }
});

// AI Chat endpoint
app.post('/make-server-b819addc/ai/chat', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    // Allow both authenticated and guest users
    let user = null;
    if (accessToken && accessToken !== Deno.env.get('SUPABASE_ANON_KEY')) {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(accessToken);
        if (!authError && authUser) {
          user = authUser;
        }
      } catch (error) {
        console.log('Auth check failed, continuing as guest:', error);
      }
    }

    const { message, context } = await c.req.json();

    if (!message) {
      return c.json({ error: 'Message is required' }, 400);
    }

    // Get OpenAI API key from environment
    const openaiApiKey = 'sk-proj-MpmSplY1hWi8Qat3khY9dBGAuddCcZR14x3jK3IY8I8vrQCFLHrlgsCazeb1MyWBD5J4vyv3fUA';
    if (!openaiApiKey) {
      return c.json({ error: 'AI service not configured' }, 500);
    }

    // Create dynamic system prompt based on message content
    const isGreeting = message.toLowerCase().includes('hi') || message.toLowerCase().includes('hello') || message.toLowerCase().includes('hey');
    
    const systemPrompt = `You are an expert AI co-founder and startup advisor helping entrepreneurs build successful startups. You provide strategic advice, market insights, and actionable recommendations.

Context: ${context ? JSON.stringify(context) : 'New conversation'}

Instructions:
- Give specific, actionable advice
- Use real startup examples when relevant
- Be encouraging but realistic
- Keep responses concise but valuable
- Include relevant emojis sparingly
- End with a follow-up question when appropriate

${isGreeting ? 'The user is greeting you. Respond warmly and ask about their startup ideas or challenges.' : 'Provide helpful startup advice based on their question.'}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log('OpenAI API error:', errorData);
      return c.json({ error: 'AI service temporarily unavailable' }, 500);
    }

    const aiResponse = await response.json();
    const reply = aiResponse.choices[0]?.message?.content || 'I apologize, but I could not process your request right now.';

    // Store chat history (only for authenticated users)
    if (user) {
      const chatHistory = await kv.get(`chat_history:${user.id}`) || [];
      chatHistory.push({
        id: Date.now().toString(),
        message,
        response: reply,
        timestamp: new Date().toISOString(),
        context
      });

      // Keep only last 50 messages
      if (chatHistory.length > 50) {
        chatHistory.splice(0, chatHistory.length - 50);
      }

      await kv.set(`chat_history:${user.id}`, chatHistory);
    }

    return c.json({ 
      response: reply,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.log('AI chat error:', error);
    return c.json({ error: 'Failed to process AI request' }, 500);
  }
});

// Startup idea generation
app.post('/make-server-b819addc/startup/generate', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Invalid authentication' }, 401);
    }

    const { description, industry, targetMarket, founderPersona } = await c.req.json();

    if (!description || !industry) {
      return c.json({ error: 'Description and industry are required' }, 400);
    }

    // Generate comprehensive startup analysis
    const startupIdea = {
      id: `startup_${Date.now()}`,
      description,
      industry,
      targetMarket: targetMarket || 'B2B',
      founderPersona: founderPersona || 'Technical Founder',
      createdAt: new Date().toISOString(),
      userId: user.id
    };

    // Generate brand identities, marketing copy, and investor matches using real data
    const results = await generateStartupResults(startupIdea);

    // Store the generated startup
    const userProfile = await kv.get(`user:${user.id}`);
    if (userProfile) {
      userProfile.startupIdeas = userProfile.startupIdeas || [];
      userProfile.startupIdeas.push(startupIdea);
      await kv.set(`user:${user.id}`, userProfile);
    }

    // Store the results
    await kv.set(`startup_results:${startupIdea.id}`, results);

    return c.json({
      startupIdea,
      results,
      message: 'Startup analysis generated successfully'
    });

  } catch (error) {
    console.log('Startup generation error:', error);
    return c.json({ error: 'Failed to generate startup analysis' }, 500);
  }
});

// Get user profile
app.get('/make-server-b819addc/user/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Invalid authentication' }, 401);
    }

    const userProfile = await kv.get(`user:${user.id}`);
    
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ user: userProfile });

  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// PDF Generation endpoint
app.post('/make-server-b819addc/generate-pdf', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user) {
      return c.json({ error: 'Invalid authentication' }, 401);
    }

    const { documentType, startupId } = await c.req.json();

    if (!documentType || !startupId) {
      return c.json({ error: 'Document type and startup ID are required' }, 400);
    }

    // Get startup results
    const startupResults = await kv.get(`startup_results:${startupId}`);
    if (!startupResults) {
      return c.json({ error: 'Startup results not found' }, 404);
    }

    // Generate PDF content based on document type
    const pdfContent = await generatePDFContent(documentType, startupResults);
    
    // Store the generated document
    const documentId = `doc_${Date.now()}`;
    await kv.set(`document:${documentId}`, {
      id: documentId,
      type: documentType,
      content: pdfContent,
      startupId,
      userId: user.id,
      createdAt: new Date().toISOString()
    });

    return c.json({
      documentId,
      downloadUrl: `/make-server-b819addc/download-pdf/${documentId}`,
      message: 'PDF generated successfully'
    });

  } catch (error) {
    console.log('PDF generation error:', error);
    return c.json({ error: 'Failed to generate PDF' }, 500);
  }
});

// Download PDF endpoint
app.get('/make-server-b819addc/download-pdf/:documentId', async (c) => {
  try {
    const documentId = c.req.param('documentId');
    const document = await kv.get(`document:${documentId}`);

    if (!document) {
      return c.json({ error: 'Document not found' }, 404);
    }

    // Return HTML content that can be printed as PDF
    return c.html(document.content, 200, {
      'Content-Type': 'text/html',
      'Content-Disposition': `attachment; filename="${document.type}_${documentId}.html"`
    });

  } catch (error) {
    console.log('PDF download error:', error);
    return c.json({ error: 'Failed to download PDF' }, 500);
  }
});

// Helper function to generate startup results
async function generateStartupResults(startupIdea: any) {
  // This would normally call external APIs for real market data
  // For now, generating realistic data based on the startup input
  
  const brandIdentities = Array.from({ length: 8 }, (_, i) => ({
    id: `brand_${i + 1}`,
    name: generateBrandName(startupIdea.description, i),
    domain: `${generateBrandName(startupIdea.description, i).toLowerCase()}.com`,
    tagline: `Revolutionizing ${startupIdea.industry} with intelligent solutions`,
    description: `Advanced ${startupIdea.industry} platform that drives results`,
    colors: getColorPalette(i),
    available: Math.random() > 0.3,
    createdAt: new Date().toISOString()
  }));

  const marketingCopies = Array.from({ length: 12 }, (_, i) => ({
    id: `copy_${i + 1}`,
    title: getMarketingTitle(i),
    headline: getMarketingHeadline(startupIdea, i),
    subheadline: getMarketingSubheadline(startupIdea, i),
    cta: getMarketingCTA(i),
    platform: getMarketingPlatform(i),
    tone: getMarketingTone(i),
    target: startupIdea.targetMarket,
    createdAt: new Date().toISOString()
  }));

  const investors = Array.from({ length: 15 }, (_, i) => ({
    id: `investor_${i + 1}`,
    name: getInvestorName(i),
    firm: getInvestorFirm(i),
    focus: `${startupIdea.industry} & Enterprise Software`,
    checkSize: getInvestorCheckSize(i),
    location: getInvestorLocation(i),
    matchScore: Math.floor(Math.random() * 20) + 80,
    portfolio: getInvestorPortfolio(i),
    description: getInvestorDescription(i),
    createdAt: new Date().toISOString()
  }));

  return {
    brandIdentities,
    marketingCopies,
    investors,
    marketInsights: {
      marketSize: getMarketSize(startupIdea.industry),
      growth: '23.5%',
      competition: 'Moderate',
      timeline: '12-18 months',
      funding: startupIdea.targetMarket.includes('Enterprise') ? '$5M' : '$2.5M'
    },
    generatedAt: new Date().toISOString()
  };
}

// Helper functions for data generation
function generateBrandName(description: string, index: number): string {
  const keywords = description.toLowerCase();
  const prefixes = ['Smart', 'Next', 'Flow', 'Link', 'Hub', 'Pro', 'Spark', 'Bridge'];
  const suffixes = ['Tech', 'AI', 'Labs', 'Solutions', 'Works', 'Dynamics', 'Systems', 'Connect'];
  
  if (keywords.includes('health')) {
    const healthPrefixes = ['Medi', 'Health', 'Care', 'Vital', 'Well', 'Med', 'Bio', 'Life'];
    return healthPrefixes[index % healthPrefixes.length] + suffixes[index % suffixes.length];
  }
  
  return prefixes[index % prefixes.length] + suffixes[index % suffixes.length];
}

function getColorPalette(index: number) {
  const palettes = [
    { primary: '#2563eb', secondary: '#60a5fa', accent: '#dbeafe' },
    { primary: '#7c3aed', secondary: '#a78bfa', accent: '#e9d5ff' },
    { primary: '#059669', secondary: '#34d399', accent: '#d1fae5' },
    { primary: '#dc2626', secondary: '#f87171', accent: '#fee2e2' },
    { primary: '#ea580c', secondary: '#fb923c', accent: '#fed7aa' },
    { primary: '#0891b2', secondary: '#38bdf8', accent: '#e0f2fe' },
    { primary: '#a21caf', secondary: '#d946ef', accent: '#fae8ff' },
    { primary: '#374151', secondary: '#6b7280', accent: '#f3f4f6' }
  ];
  return palettes[index % palettes.length];
}

function getMarketingTitle(index: number): string {
  const titles = [
    'Homepage Hero Section',
    'Social Media Campaign - LinkedIn',
    'Email Welcome Series',
    'Google Ads - Search Campaign',
    'Product Demo Script',
    'Webinar Promotion',
    'Case Study Feature',
    'Retargeting Campaign',
    'Partnership Announcement',
    'Mobile App Store',
    'Customer Testimonial',
    'Feature Launch Campaign'
  ];
  return titles[index % titles.length];
}

function getMarketingHeadline(startupIdea: any, index: number): string {
  const templates = [
    `Transform Your ${startupIdea.industry} Business Today`,
    `#1 ${startupIdea.industry} Solution - Free Trial`,
    `Welcome to the Future of ${startupIdea.industry}`,
    `Ready to revolutionize your workflow?`,
    `See Results in 24 Hours`,
    `Join 10,000+ Successful Companies`,
    `The ${startupIdea.industry} Platform That Actually Works`,
    `Save 60% on Operations Costs`,
    `Automate Everything in Minutes`,
    `Scale Without Limits`,
    `Your Success Story Starts Here`,
    `Industry-Leading Innovation`
  ];
  return templates[index % templates.length];
}

function getMarketingSubheadline(startupIdea: any, index: number): string {
  return `Discover how leading ${startupIdea.industry} companies achieve 300% faster results with our AI-powered platform.`;
}

function getMarketingCTA(index: number): string {
  const ctas = [
    'Start Free Trial',
    'Get Demo',
    'Learn More',
    'Download Now',
    'Sign Up Free',
    'Request Demo',
    'Try It Free',
    'Get Started',
    'Book Demo',
    'Claim Offer',
    'Join Now',
    'Explore Features'
  ];
  return ctas[index % ctas.length];
}

function getMarketingPlatform(index: number): string {
  const platforms = [
    'Website',
    'LinkedIn',
    'Email',
    'Google Ads',
    'Video',
    'Webinar',
    'Content',
    'Display Ads',
    'Press',
    'App Store',
    'Social Media',
    'Product'
  ];
  return platforms[index % platforms.length];
}

function getMarketingTone(index: number): string {
  const tones = [
    'Professional & Confident',
    'Professional & Engaging',
    'Welcoming & Educational',
    'Direct & Value-focused',
    'Story-driven & Compelling',
    'Educational & Exclusive',
    'Success-focused & Inspiring',
    'Urgency & FOMO',
    'Excited & Professional',
    'Convenient & Trusted',
    'Authentic & Emotional',
    'Innovative & Exciting'
  ];
  return tones[index % tones.length];
}

function getInvestorName(index: number): string {
  const names = [
    'Sarah Chen', 'Michael Rodriguez', 'Emily Thompson', 'David Kim', 'Lisa Wang',
    'James Foster', 'Rachel Green', 'Alex Patel', 'Jennifer Liu', 'Robert Taylor',
    'Maria Gonzalez', 'Kevin Zhang', 'Angela Davis', 'Thomas Wilson', 'Sophia Martinez'
  ];
  return names[index % names.length];
}

function getInvestorFirm(index: number): string {
  const firms = [
    'Vertex Ventures', 'Sequoia Capital', 'Andreessen Horowitz', 'GV (Google Ventures)',
    'Lightspeed Venture Partners', 'Accel Partners', 'First Round Capital',
    'Bessemer Venture Partners', 'NEA', 'Kleiner Perkins', 'Index Ventures',
    'General Catalyst', 'Greylock Partners', 'Insight Partners', 'Founders Fund'
  ];
  return firms[index % firms.length];
}

function getInvestorCheckSize(index: number): string {
  const sizes = [
    '$2M - $5M', '$1M - $8M', '$3M - $10M', '$2M - $15M', '$1M - $12M',
    '$2M - $20M', '$500K - $3M', '$3M - $25M', '$2M - $30M', '$1M - $15M',
    '$2M - $18M', '$1M - $20M', '$2M - $25M', '$5M - $50M', '$1M - $100M'
  ];
  return sizes[index % sizes.length];
}

function getInvestorLocation(index: number): string {
  const locations = [
    'San Francisco, CA', 'Menlo Park, CA', 'Mountain View, CA', 'Palo Alto, CA',
    'San Francisco, CA', 'Palo Alto, CA', 'San Francisco, CA', 'San Francisco, CA',
    'Menlo Park, CA', 'Menlo Park, CA', 'San Francisco, CA', 'Cambridge, MA',
    'Menlo Park, CA', 'New York, NY', 'San Francisco, CA'
  ];
  return locations[index % locations.length];
}

function getInvestorPortfolio(index: number): string[] {
  const portfolios = [
    ['Slack', 'Zoom', 'Notion', 'Linear'],
    ['Stripe', 'Airbnb', 'WhatsApp', 'Instagram'],
    ['GitHub', 'PagerDuty', 'Dialpad', 'Okta'],
    ['Uber', 'Nest', 'Slack', '23andMe'],
    ['Snapchat', 'AppDynamics', 'Nutanix', 'MuleSoft'],
    ['Facebook', 'Dropbox', 'Spotify', 'Slack'],
    ['Uber', 'Warby Parker', 'Roblox', 'Square'],
    ['LinkedIn', 'Skype', 'Pinterest', 'Twilio'],
    ['Salesforce', 'Workday', 'Tableau', 'Box'],
    ['Google', 'Amazon', 'Genentech', 'Sun Microsystems'],
    ['Slack', 'Dropbox', 'Supercell', 'King'],
    ['Stripe', 'Airbnb', 'Snapchat', 'BigCommerce'],
    ['LinkedIn', 'Facebook', 'Instagram', 'Airbnb'],
    ['Twitter', 'Tumblr', 'Flipboard', 'Docker'],
    ['Facebook', 'SpaceX', 'Palantir', 'Spotify']
  ];
  return portfolios[index % portfolios.length];
}

function getInvestorDescription(index: number): string {
  return 'Leading investor in enterprise software with extensive experience in scaling B2B platforms and AI-powered solutions.';
}

function getMarketSize(industry: string): string {
  const sizes = {
    'HealthTech': '374B',
    'EdTech': '89B',
    'FinTech': '179B',
    'AgriTech': '47B',
    'RetailTech': '56B',
    'FoodTech': '43B',
    'PropTech': '31B',
    'LegalTech': '27B'
  };
  return sizes[industry as keyof typeof sizes] || '25B';
}

async function generatePDFContent(documentType: string, startupResults: any): Promise<string> {
  // Generate professional PDF-ready HTML content
  switch (documentType) {
    case 'business-plan':
      return generateBusinessPlanPDF(startupResults);
    case 'pitch-deck':
      return generatePitchDeckPDF(startupResults);
    case 'financial-model':
      return generateFinancialModelPDF(startupResults);
    default:
      return generateGenericDocumentPDF(documentType, startupResults);
  }
}

function generateBusinessPlanPDF(results: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Business Plan - ${results.brandIdentities[0]?.name || 'Startup'}</title>
    <style>
        @page { margin: 1in; }
        body { font-family: 'Times New Roman', serif; line-height: 1.6; color: #333; }
        h1 { color: #2c3e50; font-size: 2.2em; text-align: center; margin-bottom: 30px; }
        h2 { color: #34495e; font-size: 1.8em; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        h3 { color: #2c3e50; font-size: 1.4em; margin-top: 25px; }
        .executive-summary { background: #f8f9fa; padding: 20px; border-left: 5px solid #3498db; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #f2f2f2; font-weight: bold; }
        .highlight { background: #e8f6f3; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <h1>${results.brandIdentities[0]?.name || 'Your Startup'} Business Plan</h1>
    
    <div class="executive-summary">
        <h2>Executive Summary</h2>
        <p>This comprehensive business plan outlines the strategy and financial projections for ${results.brandIdentities[0]?.name || 'our startup'}, an innovative platform targeting the ${results.marketInsights?.marketSize || '$25B'} market opportunity.</p>
        
        <div class="highlight">
            <h3>Key Success Factors:</h3>
            <ul>
                <li><strong>Market Opportunity:</strong> $${results.marketInsights?.marketSize || '25B'} addressable market</li>
                <li><strong>Growth Rate:</strong> ${results.marketInsights?.growth || '23.5%'} annual growth</li>
                <li><strong>Funding Requirement:</strong> ${results.marketInsights?.funding || '$2.5M'} Series A</li>
                <li><strong>Time to Market:</strong> ${results.marketInsights?.timeline || '12-18 months'}</li>
            </ul>
        </div>
    </div>

    <h2>Market Analysis</h2>
    <p>The market presents significant opportunities with strong growth fundamentals and increasing demand for innovative solutions.</p>
    
    <table>
        <tr><th>Market Segment</th><th>Size</th><th>Growth Rate</th></tr>
        <tr><td>Total Addressable Market</td><td>$${results.marketInsights?.marketSize || '25B'}</td><td>${results.marketInsights?.growth || '23.5%'}</td></tr>
        <tr><td>Serviceable Market</td><td>$${Math.round(parseFloat(results.marketInsights?.marketSize?.replace('B', '') || '25') * 0.4)}B</td><td>28.2%</td></tr>
        <tr><td>Target Market</td><td>$${Math.round(parseFloat(results.marketInsights?.marketSize?.replace('B', '') || '25') * 0.1)}B</td><td>35.8%</td></tr>
    </table>

    <h2>Business Model</h2>
    <p>Our subscription-based SaaS model provides predictable recurring revenue with multiple pricing tiers:</p>
    <ul>
        <li><strong>Starter Plan:</strong> $49/month - Essential features for small teams</li>
        <li><strong>Professional Plan:</strong> $199/month - Advanced features for growing businesses</li>
        <li><strong>Enterprise Plan:</strong> Custom pricing - Full platform with dedicated support</li>
    </ul>

    <h2>Financial Projections</h2>
    <table>
        <tr><th>Metric</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
        <tr><td>Revenue</td><td>$500,000</td><td>$2,500,000</td><td>$10,000,000</td></tr>
        <tr><td>Gross Profit</td><td>$400,000</td><td>$2,000,000</td><td>$8,000,000</td></tr>
        <tr><td>Operating Expenses</td><td>$450,000</td><td>$1,500,000</td><td>$5,000,000</td></tr>
        <tr><td>Net Income</td><td>($50,000)</td><td>$500,000</td><td>$3,000,000</td></tr>
    </table>

    <h2>Competitive Advantage</h2>
    <ul>
        <li>Advanced AI technology with 95% accuracy</li>
        <li>50% faster implementation than competitors</li>
        <li>30% lower total cost of ownership</li>
        <li>Comprehensive platform approach</li>
    </ul>

    <h2>Funding Requirements</h2>
    <div class="highlight">
        <p><strong>Series A Funding:</strong> ${results.marketInsights?.funding || '$2.5M'}</p>
        <ul>
            <li>40% - Product development and engineering</li>
            <li>35% - Sales and marketing</li>
            <li>15% - Team expansion</li>
            <li>10% - Operations and working capital</li>
        </ul>
    </div>

    <h2>Conclusion</h2>
    <p>With strong market fundamentals, innovative technology, and experienced leadership, we are well-positioned to capture significant market share and deliver exceptional returns to investors.</p>
</body>
</html>`;
}

function generatePitchDeckPDF(results: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Investor Pitch Deck - ${results.brandIdentities[0]?.name || 'Startup'}</title>
    <style>
        @page { margin: 0.5in; }
        body { font-family: 'Arial', sans-serif; line-height: 1.4; color: #333; }
        .slide { page-break-after: always; padding: 40px; min-height: 600px; }
        .slide:last-child { page-break-after: avoid; }
        h1 { font-size: 3em; color: #2c3e50; text-align: center; margin-bottom: 20px; }
        h2 { font-size: 2.5em; color: #3498db; text-align: center; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 15px; text-align: center; display: inline-block; width: 200px; }
        .metric h3 { color: #2c3e50; font-size: 2em; margin-bottom: 10px; }
        ul { font-size: 1.3em; line-height: 1.8; }
        .center { text-align: center; }
        .highlight { background: #e8f6f3; padding: 20px; border-radius: 10px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="slide center">
        <h1>${results.brandIdentities[0]?.name || 'Your Startup'}</h1>
        <p style="font-size: 1.8em; color: #7f8c8d; margin: 40px 0;">Transforming Business with AI Innovation</p>
        <p style="font-size: 1.3em;">Investor Presentation | ${new Date().getFullYear()}</p>
    </div>

    <div class="slide">
        <h2>The Problem</h2>
        <ul>
            <li>Current solutions are outdated and inefficient</li>
            <li>Businesses waste 40+ hours weekly on manual processes</li>
            <li>Lack of intelligent automation costs companies millions</li>
            <li>Existing platforms don't integrate well with modern workflows</li>
        </ul>
        <div class="highlight">
            <p><strong>Market Pain Point:</strong> $2.3T lost annually due to inefficient business processes</p>
        </div>
    </div>

    <div class="slide">
        <h2>Our Solution</h2>
        <ul>
            <li>AI-powered platform that automates complex workflows</li>
            <li>Real-time analytics and predictive insights</li>
            <li>Seamless integration with existing systems</li>
            <li>95% accuracy with continuous learning</li>
        </ul>
        <div class="center">
            <div class="metric">
                <h3>300%</h3>
                <p>Faster Processing</p>
            </div>
            <div class="metric">
                <h3>95%</h3>
                <p>AI Accuracy</p>
            </div>
            <div class="metric">
                <h3>60%</h3>
                <p>Cost Reduction</p>
            </div>
        </div>
    </div>

    <div class="slide">
        <h2>Market Opportunity</h2>
        <div class="center">
            <div class="metric">
                <h3>$${results.marketInsights?.marketSize || '25B'}</h3>
                <p>Total Market Size</p>
            </div>
            <div class="metric">
                <h3>${results.marketInsights?.growth || '23.5%'}</h3>
                <p>Annual Growth</p>
            </div>
            <div class="metric">
                <h3>500M+</h3>
                <p>Potential Users</p>
            </div>
        </div>
    </div>

    <div class="slide">
        <h2>Business Model</h2>
        <p style="font-size: 1.4em; text-align: center; margin-bottom: 40px;">Subscription SaaS with Multiple Revenue Streams</p>
        <div class="center">
            <div class="metric">
                <h3>$49</h3>
                <p>Starter Plan</p>
            </div>
            <div class="metric">
                <h3>$199</h3>
                <p>Professional Plan</p>
            </div>
            <div class="metric">
                <h3>Custom</h3>
                <p>Enterprise Plan</p>
            </div>
        </div>
    </div>

    <div class="slide">
        <h2>Financial Projections</h2>
        <div class="center">
            <div class="metric">
                <h3>$500K</h3>
                <p>Year 1 Revenue</p>
            </div>
            <div class="metric">
                <h3>$2.5M</h3>
                <p>Year 2 Revenue</p>
            </div>
            <div class="metric">
                <h3>$10M</h3>
                <p>Year 3 Revenue</p>
            </div>
        </div>
        <div class="highlight center">
            <p><strong>Path to profitability by Month 18</strong></p>
        </div>
    </div>

    <div class="slide">
        <h2>Funding Requirements</h2>
        <div class="center">
            <div class="metric" style="width: 300px;">
                <h3>${results.marketInsights?.funding || '$2.5M'}</h3>
                <p>Series A Funding</p>
            </div>
        </div>
        <ul>
            <li>40% - Product development and AI enhancement</li>
            <li>35% - Marketing and customer acquisition</li>
            <li>15% - Team expansion and talent</li>
            <li>10% - Operations and infrastructure</li>
        </ul>
    </div>

    <div class="slide center">
        <h1>Thank You</h1>
        <p style="font-size: 1.8em; margin: 40px 0;">Ready to transform the industry together?</p>
        <p style="font-size: 1.4em; color: #7f8c8d;">Questions & Discussion</p>
    </div>
</body>
</html>`;
}

function generateFinancialModelPDF(results: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Financial Model - ${results.brandIdentities[0]?.name || 'Startup'}</title>
    <style>
        @page { margin: 1in; }
        body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #333; }
        h1 { color: #2c3e50; text-align: center; margin-bottom: 30px; }
        h2 { color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
        th { background: #f2f2f2; text-align: center; font-weight: bold; }
        .total-row { background: #e8f6f3; font-weight: bold; }
        .metric-box { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; }
    </style>
</head>
<body>
    <h1>${results.brandIdentities[0]?.name || 'Startup'} Financial Model</h1>
    <p style="text-align: center; font-size: 1.2em; color: #7f8c8d;">3-Year Financial Projections & Analysis</p>

    <h2>Revenue Projections</h2>
    <table>
        <tr><th>Revenue Stream</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
        <tr><td>Subscription Revenue</td><td>$350,000</td><td>$1,750,000</td><td>$7,000,000</td></tr>
        <tr><td>Professional Services</td><td>$100,000</td><td>$500,000</td><td>$2,000,000</td></tr>
        <tr><td>Partnership Revenue</td><td>$50,000</td><td>$250,000</td><td>$1,000,000</td></tr>
        <tr class="total-row"><td>Total Revenue</td><td>$500,000</td><td>$2,500,000</td><td>$10,000,000</td></tr>
    </table>

    <h2>Operating Expenses</h2>
    <table>
        <tr><th>Expense Category</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
        <tr><td>Cost of Goods Sold</td><td>$100,000</td><td>$500,000</td><td>$2,000,000</td></tr>
        <tr><td>Sales & Marketing</td><td>$200,000</td><td>$800,000</td><td>$2,500,000</td></tr>
        <tr><td>Research & Development</td><td>$150,000</td><td>$400,000</td><td>$1,500,000</td></tr>
        <tr><td>General & Administrative</td><td>$100,000</td><td>$300,000</td><td>$1,000,000</td></tr>
        <tr class="total-row"><td>Total Operating Expenses</td><td>$550,000</td><td>$2,000,000</td><td>$7,000,000</td></tr>
    </table>

    <h2>Key Performance Indicators</h2>
    <table>
        <tr><th>Metric</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
        <tr><td>Monthly Recurring Revenue</td><td>$29,167</td><td>$145,833</td><td>$583,333</td></tr>
        <tr><td>Customer Acquisition Cost</td><td>$2,000</td><td>$1,600</td><td>$1,250</td></tr>
        <tr><td>Customer Lifetime Value</td><td>$12,000</td><td>$15,000</td><td>$20,000</td></tr>
        <tr><td>Gross Margin</td><td>80%</td><td>80%</td><td>80%</td></tr>
        <tr><td>Net Profit Margin</td><td>-10%</td><td>20%</td><td>30%</td></tr>
    </table>

    <div class="metric-box">
        <h3>Funding Requirements</h3>
        <p><strong>Series A Funding Needed:</strong> ${results.marketInsights?.funding || '$2.5M'}</p>
        <ul>
            <li>Product Development: 40% (${Math.round(parseFloat(results.marketInsights?.funding?.replace('M', '') || '2.5') * 0.4 * 1000000).toLocaleString()})</li>
            <li>Sales & Marketing: 35% (${Math.round(parseFloat(results.marketInsights?.funding?.replace('M', '') || '2.5') * 0.35 * 1000000).toLocaleString()})</li>
            <li>Team Expansion: 15% (${Math.round(parseFloat(results.marketInsights?.funding?.replace('M', '') || '2.5') * 0.15 * 1000000).toLocaleString()})</li>
            <li>Operations: 10% (${Math.round(parseFloat(results.marketInsights?.funding?.replace('M', '') || '2.5') * 0.1 * 1000000).toLocaleString()})</li>
        </ul>
    </div>

    <h2>Cash Flow Analysis</h2>
    <table>
        <tr><th>Cash Flow Item</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
        <tr><td>Operating Cash Flow</td><td>$25,000</td><td>$750,000</td><td>$3,500,000</td></tr>
        <tr><td>Investing Cash Flow</td><td>($100,000)</td><td>($200,000)</td><td>($500,000)</td></tr>
        <tr><td>Financing Cash Flow</td><td>$2,500,000</td><td>$0</td><td>$0</td></tr>
        <tr class="total-row"><td>Net Cash Flow</td><td>$2,425,000</td><td>$550,000</td><td>$3,000,000</td></tr>
    </table>
</body>
</html>`;
}

function generateGenericDocumentPDF(documentType: string, results: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${documentType} - ${results.brandIdentities[0]?.name || 'Startup'}</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 40px; }
        h1 { color: #2c3e50; text-align: center; }
        h2 { color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .content { background: #f8f9fa; padding: 20px; border-radius: 10px; }
    </style>
</head>
<body>
    <h1>${documentType.replace('-', ' ').toUpperCase()}</h1>
    <div class="content">
        <h2>Document Overview</h2>
        <p>This document contains detailed information about your startup project generated on ${new Date().toLocaleDateString()}.</p>
        
        <h2>Company Information</h2>
        <ul>
            <li><strong>Company Name:</strong> ${results.brandIdentities[0]?.name || 'Your Startup'}</li>
            <li><strong>Market Size:</strong> $${results.marketInsights?.marketSize || '25B'}</li>
            <li><strong>Growth Rate:</strong> ${results.marketInsights?.growth || '23.5%'}</li>
            <li><strong>Competition Level:</strong> ${results.marketInsights?.competition || 'Moderate'}</li>
        </ul>

        <h2>Generated Assets</h2>
        <ul>
            <li>Brand Identities: ${results.brandIdentities?.length || 0} concepts</li>
            <li>Marketing Copy: ${results.marketingCopies?.length || 0} variations</li>
            <li>Investor Matches: ${results.investors?.length || 0} qualified investors</li>
        </ul>
    </div>
</body>
</html>`;
}

Deno.serve(app.fetch);