import { toast } from "sonner@2.0.3";

interface StartupIdea {
  description: string;
  industry: string;
  targetMarket: string;
  founderPersona: string;
}

export async function generateAndDownloadPDF(documentType: string, startupIdea: StartupIdea) {
  try {
    const authToken = localStorage.getItem('auth_token');
    const projectId = 'qtasahyujisrwvwepprd';
    
    if (!authToken) {
      // Generate PDF locally if not authenticated
      generateLocalPDF(documentType, startupIdea);
      return;
    }

    // Try backend first, fallback to local if it fails
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-b819addc/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          documentType,
          startupId: `startup_${Date.now()}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        const downloadUrl = `https://${projectId}.supabase.co/functions/v1${data.downloadUrl}`;
        window.open(downloadUrl, '_blank');
        toast.success(`${documentType.replace('-', ' ')} downloaded successfully!`);
        return;
      }
    } catch (error) {
      console.log('Backend PDF generation failed, using local fallback');
    }
    
    // Fallback to local generation
    generateLocalPDF(documentType, startupIdea);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    generateLocalPDF(documentType, startupIdea);
  }
}

function generateLocalPDF(documentType: string, startupIdea: StartupIdea) {
  const content = generatePDFContent(documentType, startupIdea);
  
  // Create a blob and download
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${documentType}_${startupIdea.industry || 'startup'}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  toast.success(`${documentType.replace('-', ' ')} downloaded successfully!`);
}

function generatePDFContent(documentType: string, startupIdea: StartupIdea): string {
  const brandName = generateBrandName(startupIdea.description);
  
  switch (documentType) {
    case 'business-plan':
      return generateBusinessPlanHTML(brandName, startupIdea);
    case 'pitch-deck':
      return generatePitchDeckHTML(brandName, startupIdea);
    case 'financial-model':
      return generateFinancialModelHTML(brandName, startupIdea);
    case 'brand-package':
      return generateBrandPackageHTML(brandName, startupIdea);
    case 'marketing-kit':
      return generateMarketingKitHTML(brandName, startupIdea);
    default:
      return generateGenericHTML(documentType, brandName, startupIdea);
  }
}

function generateBrandName(description: string): string {
  const keywords = description.toLowerCase();
  if (keywords.includes('health') || keywords.includes('medical')) return "MediFlow";
  if (keywords.includes('education') || keywords.includes('learning')) return "EduSpark";
  if (keywords.includes('finance') || keywords.includes('payment')) return "FinTech";
  if (keywords.includes('food') || keywords.includes('restaurant')) return "FoodFlow";
  if (keywords.includes('rural') || keywords.includes('farm')) return "AgriTech";
  return "InnovateTech";
}

function generateBusinessPlanHTML(brandName: string, startupIdea: StartupIdea): string {
  const marketSize = getMarketSize(startupIdea.industry);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName} - Business Plan</title>
    <style>
        @page { margin: 1in; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0;
        }
        h1 { 
            color: #2c3e50; 
            font-size: 3rem; 
            margin-bottom: 30px; 
            text-align: center;
        }
        h2 { 
            color: #34495e; 
            font-size: 1.8rem; 
            border-bottom: 2px solid #3498db; 
            padding-bottom: 10px; 
            margin-top: 40px;
        }
        h3 { 
            color: #2c3e50; 
            font-size: 1.4rem; 
            margin-top: 25px; 
        }
        .executive-summary { 
            background: #f8f9fa; 
            padding: 30px; 
            border-left: 5px solid #3498db; 
            margin: 20px 0;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
        }
        th { 
            background: #f2f2f2; 
            font-weight: bold; 
        }
        .highlight { 
            background: #e8f6f3; 
            padding: 20px; 
            border-radius: 5px; 
            margin: 20px 0; 
        }
        ul { padding-left: 25px; }
        li { margin-bottom: 8px; }
    </style>
</head>
<body>
    <h1>${brandName} Business Plan</h1>
    <p style="text-align: center; font-size: 1.2rem; color: #7f8c8d; margin-bottom: 40px;">
        ${startupIdea.industry} Business Strategy & Analysis
    </p>
    
    <div class="executive-summary">
        <h2>Executive Summary</h2>
        <p><strong>${brandName}</strong> is an innovative ${startupIdea.industry} company targeting the ${startupIdea.targetMarket} market.</p>
        
        <h3>Business Concept</h3>
        <p>${startupIdea.description}</p>
        
        <div class="highlight">
            <h3>Key Success Factors</h3>
            <ul>
                <li><strong>Market Opportunity:</strong> $${marketSize} addressable market with 23.5% annual growth</li>
                <li><strong>Innovative Technology:</strong> Advanced AI algorithms with 95% accuracy rate</li>
                <li><strong>Experienced Leadership:</strong> Proven track record in ${startupIdea.industry}</li>
                <li><strong>Scalable Business Model:</strong> SaaS platform with recurring revenue streams</li>
            </ul>
        </div>
    </div>

    <h2>Market Analysis</h2>
    <p>The ${startupIdea.industry} industry presents significant opportunities with strong growth fundamentals.</p>
    
    <table>
        <tr><th>Market Segment</th><th>Size</th><th>Growth Rate</th></tr>
        <tr><td>Total Addressable Market</td><td>$${marketSize}</td><td>23.5%</td></tr>
        <tr><td>Serviceable Market</td><td>$${Math.round(parseFloat(marketSize.replace('B', '')) * 0.4)}B</td><td>28.2%</td></tr>
        <tr><td>Target Market</td><td>$${Math.round(parseFloat(marketSize.replace('B', '')) * 0.1)}B</td><td>35.8%</td></tr>
    </table>

    <h2>Business Model</h2>
    <p>Our subscription-based SaaS model provides predictable recurring revenue:</p>
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
        <tr><td>Net Income</td><td>($50,000)</td><td>$500,000</td><td>$3,000,000</td></tr>
    </table>

    <h2>Funding Requirements</h2>
    <div class="highlight">
        <p><strong>Series A Funding:</strong> ${getFundingAmount(startupIdea.targetMarket)}</p>
        <ul>
            <li>40% - Product development and engineering</li>
            <li>35% - Sales and marketing</li>
            <li>15% - Team expansion</li>
            <li>10% - Operations and working capital</li>
        </ul>
    </div>

    <h2>Implementation Timeline</h2>
    <ul>
        <li><strong>Q1:</strong> Complete funding, team expansion, product enhancement</li>
        <li><strong>Q2:</strong> Market expansion, partnership development</li>
        <li><strong>Q3:</strong> International expansion, enterprise sales focus</li>
        <li><strong>Q4:</strong> Series B preparation, advanced features</li>
    </ul>

    <div style="margin-top: 50px; text-align: center; color: #7f8c8d;">
        <p>© ${new Date().getFullYear()} ${brandName}. All rights reserved.</p>
    </div>
</body>
</html>`;
}

function generatePitchDeckHTML(brandName: string, startupIdea: StartupIdea): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName} - Investor Pitch Deck</title>
    <style>
        @page { margin: 0.5in; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.4; 
            color: #333; 
            margin: 0;
        }
        .slide { 
            page-break-after: always; 
            padding: 40px; 
            min-height: 600px; 
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .slide:last-child { page-break-after: avoid; }
        h1 { 
            font-size: 3.5rem; 
            color: #2c3e50; 
            text-align: center; 
            margin-bottom: 30px; 
        }
        h2 { 
            font-size: 2.8rem; 
            color: #3498db; 
            text-align: center; 
            margin-bottom: 40px; 
        }
        .subtitle {
            font-size: 1.8rem;
            color: #7f8c8d;
            text-align: center;
            margin: 20px 0;
        }
        .metric { 
            background: #f8f9fa; 
            padding: 25px; 
            border-radius: 15px; 
            margin: 20px; 
            text-align: center; 
            display: inline-block; 
            width: 220px; 
        }
        .metric h3 { 
            color: #2c3e50; 
            font-size: 2.5rem; 
            margin-bottom: 15px; 
        }
        ul { 
            font-size: 1.4rem; 
            line-height: 2; 
        }
        .center { text-align: center; }
        .highlight { 
            background: #e8f6f3; 
            padding: 25px; 
            border-radius: 15px; 
            margin: 30px 0; 
        }
    </style>
</head>
<body>
    <div class="slide center">
        <h1>${brandName}</h1>
        <p class="subtitle">Transforming ${startupIdea.industry} with AI Innovation</p>
        <p style="font-size: 1.4rem; margin-top: 60px;">Investor Presentation</p>
        <p style="font-size: 1.2rem; color: #95a5a6;">${new Date().toLocaleDateString()}</p>
    </div>

    <div class="slide">
        <h2>The Problem</h2>
        <ul>
            <li>Current solutions are outdated and inefficient</li>
            <li>Businesses waste 40+ hours weekly on manual processes</li>
            <li>Lack of intelligent automation costs companies millions</li>
            <li>Existing platforms don't integrate well with modern workflows</li>
        </ul>
        <div class="highlight center">
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
                <h3>$${getMarketSize(startupIdea.industry)}</h3>
                <p>Total Market Size</p>
            </div>
            <div class="metric">
                <h3>23.5%</h3>
                <p>Annual Growth Rate</p>
            </div>
            <div class="metric">
                <h3>500M+</h3>
                <p>Potential Users</p>
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
            <p><strong>Path to Profitability:</strong> Break-even by Month 18</p>
        </div>
    </div>

    <div class="slide">
        <h2>Funding Requirements</h2>
        <div class="center">
            <div class="metric" style="width: 300px;">
                <h3>${getFundingAmount(startupIdea.targetMarket)}</h3>
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
        <p class="subtitle">Ready to transform ${startupIdea.industry} together?</p>
        <p style="font-size: 1.4rem; color: #7f8c8d; margin-top: 80px;">Questions & Discussion</p>
    </div>
</body>
</html>`;
}

function generateFinancialModelHTML(brandName: string, startupIdea: StartupIdea): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName} - Financial Model</title>
    <style>
        @page { margin: 1in; }
        body { 
            font-family: 'Arial', sans-serif; 
            line-height: 1.5; 
            color: #333; 
            margin: 0;
        }
        h1 { 
            color: #2c3e50; 
            text-align: center; 
            margin-bottom: 30px; 
        }
        h2 { 
            color: #34495e; 
            border-bottom: 2px solid #3498db; 
            padding-bottom: 10px; 
            margin-top: 40px;
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0; 
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: right; 
        }
        th { 
            background: #f2f2f2; 
            text-align: center; 
            font-weight: bold; 
        }
        .label-col { text-align: left !important; }
        .total-row { 
            background: #e8f6f3; 
            font-weight: bold; 
        }
        .metric-box { 
            background: #f8f9fa; 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0; 
        }
    </style>
</head>
<body>
    <h1>${brandName} Financial Model</h1>
    <p style="text-align: center; font-size: 1.2rem; color: #7f8c8d;">3-Year Financial Projections</p>

    <h2>Revenue Projections</h2>
    <table>
        <tr><th class="label-col">Revenue Stream</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
        <tr><td class="label-col">Subscription Revenue</td><td>$350,000</td><td>$1,750,000</td><td>$7,000,000</td></tr>
        <tr><td class="label-col">Professional Services</td><td>$100,000</td><td>$500,000</td><td>$2,000,000</td></tr>
        <tr><td class="label-col">Partnership Revenue</td><td>$50,000</td><td>$250,000</td><td>$1,000,000</td></tr>
        <tr class="total-row"><td class="label-col">Total Revenue</td><td>$500,000</td><td>$2,500,000</td><td>$10,000,000</td></tr>
    </table>

    <h2>Operating Expenses</h2>
    <table>
        <tr><th class="label-col">Expense Category</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
        <tr><td class="label-col">Cost of Goods Sold</td><td>$100,000</td><td>$500,000</td><td>$2,000,000</td></tr>
        <tr><td class="label-col">Sales & Marketing</td><td>$200,000</td><td>$800,000</td><td>$2,500,000</td></tr>
        <tr><td class="label-col">Research & Development</td><td>$150,000</td><td>$400,000</td><td>$1,500,000</td></tr>
        <tr><td class="label-col">General & Administrative</td><td>$100,000</td><td>$300,000</td><td>$1,000,000</td></tr>
        <tr class="total-row"><td class="label-col">Total Operating Expenses</td><td>$550,000</td><td>$2,000,000</td><td>$7,000,000</td></tr>
    </table>

    <h2>Key Performance Indicators</h2>
    <table>
        <tr><th class="label-col">Metric</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
        <tr><td class="label-col">Monthly Recurring Revenue</td><td>$29,167</td><td>$145,833</td><td>$583,333</td></tr>
        <tr><td class="label-col">Customer Acquisition Cost</td><td>$2,000</td><td>$1,600</td><td>$1,250</td></tr>
        <tr><td class="label-col">Customer Lifetime Value</td><td>$12,000</td><td>$15,000</td><td>$20,000</td></tr>
        <tr><td class="label-col">Gross Margin</td><td>80%</td><td>80%</td><td>80%</td></tr>
        <tr><td class="label-col">Net Profit Margin</td><td>-10%</td><td>20%</td><td>30%</td></tr>
    </table>

    <div class="metric-box">
        <h3>Funding Requirements</h3>
        <p><strong>Series A Funding Needed:</strong> ${getFundingAmount(startupIdea.targetMarket)}</p>
        <ul>
            <li>Product Development: 40%</li>
            <li>Sales & Marketing: 35%</li>
            <li>Team Expansion: 15%</li>
            <li>Operations: 10%</li>
        </ul>
    </div>
</body>
</html>`;
}

function generateBrandPackageHTML(brandName: string, startupIdea: StartupIdea): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName} - Brand Package</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 40px; color: #333; }
        h1 { color: #2c3e50; text-align: center; font-size: 2.5rem; }
        h2 { color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .brand-section { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .color-palette { display: flex; gap: 20px; margin: 20px 0; }
        .color-swatch { width: 100px; height: 100px; border-radius: 10px; display: flex; align-items: end; padding: 10px; color: white; }
    </style>
</head>
<body>
    <h1>${brandName} Brand Package</h1>
    <p style="text-align: center; font-size: 1.2rem; color: #7f8c8d;">Complete Brand Identity & Guidelines</p>
    
    <div class="brand-section">
        <h2>Brand Overview</h2>
        <p><strong>Mission:</strong> To revolutionize ${startupIdea.industry} through innovative AI-powered solutions.</p>
        <p><strong>Vision:</strong> To become the leading platform transforming how businesses operate in the ${startupIdea.industry} space.</p>
        <p><strong>Values:</strong> Innovation, Excellence, Customer Success, Integrity</p>
    </div>

    <div class="brand-section">
        <h2>Color Palette</h2>
        <div class="color-palette">
            <div class="color-swatch" style="background: linear-gradient(135deg, #2563eb, #1d4ed8);">
                <span>Primary Blue<br>#2563eb</span>
            </div>
            <div class="color-swatch" style="background: linear-gradient(135deg, #7c3aed, #6d28d9);">
                <span>Secondary Purple<br>#7c3aed</span>
            </div>
            <div class="color-swatch" style="background: linear-gradient(135deg, #059669, #047857);">
                <span>Accent Green<br>#059669</span>
            </div>
        </div>
    </div>

    <div class="brand-section">
        <h2>Typography</h2>
        <h1 style="font-family: Arial;">Primary Heading - Arial Bold</h1>
        <h2 style="font-family: Arial;">Secondary Heading - Arial Semibold</h2>
        <p style="font-family: Arial;">Body text uses Arial Regular for optimal readability across all platforms.</p>
    </div>

    <div class="brand-section">
        <h2>Logo Guidelines</h2>
        <p><strong>Logo Usage:</strong> Maintain clear space equal to logo height. Use approved color combinations only.</p>
        <p><strong>Do Not:</strong> Distort, rotate, or modify the logo. Avoid low-contrast backgrounds.</p>
    </div>

    <div class="brand-section">
        <h2>Brand Voice</h2>
        <ul>
            <li><strong>Professional:</strong> Expert and credible in all communications</li>
            <li><strong>Innovative:</strong> Forward-thinking and cutting-edge</li>
            <li><strong>Approachable:</strong> Friendly and accessible</li>
            <li><strong>Confident:</strong> Assured in our capabilities</li>
        </ul>
    </div>

    <div style="margin-top: 50px; text-align: center; color: #7f8c8d;">
        <p>© ${new Date().getFullYear()} ${brandName}. Brand guidelines document.</p>
    </div>
</body>
</html>`;
}

function generateMarketingKitHTML(brandName: string, startupIdea: StartupIdea): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName} - Marketing Kit</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 40px; color: #333; }
        h1 { color: #2c3e50; text-align: center; font-size: 2.5rem; }
        h2 { color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
        .campaign { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .metric { background: #e8f6f3; padding: 15px; border-radius: 8px; margin: 10px 0; text-align: center; }
        .cta-button { background: #2563eb; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; }
    </style>
</head>
<body>
    <h1>${brandName} Marketing Campaign Kit</h1>
    <p style="text-align: center; font-size: 1.2rem; color: #7f8c8d;">Complete Marketing Arsenal for ${startupIdea.industry} Success</p>
    
    <div class="metric">
        <h3>Campaign Performance Overview</h3>
        <p><strong>12 Multi-platform Campaigns</strong> | <strong>3.2% Conversion Rate</strong> | <strong>450% ROI Projection</strong></p>
    </div>

    <div class="campaign">
        <h2>Website Landing Page</h2>
        <h3>Transform Your ${startupIdea.industry} Business Today</h3>
        <p><strong>Headline:</strong> "The AI Platform That's Revolutionizing ${startupIdea.industry}"</p>
        <p><strong>Subheadline:</strong> Join 10,000+ companies using ${brandName} to increase efficiency by 300%, reduce costs by 60%, and accelerate growth like never before.</p>
        <div style="background: #dbeafe; padding: 15px; border-radius: 5px; margin: 15px 0;">
            ✨ 95% customer satisfaction • 🚀 300% faster results • 💰 60% cost reduction
        </div>
        <a href="#" class="cta-button">Start Free Trial Today</a>
    </div>

    <div class="campaign">
        <h2>LinkedIn Campaign</h2>
        <h3>Industry Innovation Post</h3>
        <p>🚀 The future of ${startupIdea.industry} is here, and it's powered by AI.</p>
        <p>We just helped another Fortune 500 company achieve:</p>
        <ul>
            <li>📈 300% faster processing</li>
            <li>💰 60% cost reduction</li>
            <li>⚡ 95% automation accuracy</li>
        </ul>
        <p><strong>Hashtags:</strong> #${startupIdea.industry} #AI #BusinessAutomation #Innovation</p>
    </div>

    <div class="campaign">
        <h2>Email Welcome Series</h2>
        <h3>Welcome to the Future of ${startupIdea.industry}! 🎉</h3>
        <p>Welcome to ${brandName}! You've just joined 10,000+ companies transforming their operations.</p>
        <p><strong>What happens next:</strong></p>
        <ul>
            <li>✅ Complete your 5-minute setup</li>
            <li>🚀 Take our interactive product tour</li>
            <li>💬 Schedule a free consultation</li>
        </ul>
        <a href="#" class="cta-button">Complete Setup Now</a>
    </div>

    <div class="campaign">
        <h2>Google Ads Campaign</h2>
        <h3>${startupIdea.industry} Automation Software</h3>
        <p><strong>Headline 1:</strong> #1 ${startupIdea.industry} AI Platform</p>
        <p><strong>Headline 2:</strong> 30-Day Free Trial + Setup</p>
        <p><strong>Description:</strong> Transform ${startupIdea.industry} operations with AI. Trusted by Fortune 500. 95% customer satisfaction.</p>
    </div>

    <div class="campaign">
        <h2>Content Marketing</h2>
        <h3>"The Future of ${startupIdea.industry}: 5 Trends That Will Define 2024"</h3>
        <p><strong>Blog Post Topics:</strong></p>
        <ul>
            <li>AI-Powered Automation Becomes Standard</li>
            <li>Real-Time Data Analytics Drives Decisions</li>
            <li>Remote-First Operations Reshape Workflows</li>
            <li>Customer Experience Automation Scales</li>
        </ul>
    </div>

    <div style="margin-top: 50px; text-align: center; color: #7f8c8d;">
        <p><strong>Ready to Deploy These Campaigns?</strong></p>
        <p>© ${new Date().getFullYear()} ${brandName}. All marketing materials ready for deployment.</p>
    </div>
</body>
</html>`;
}

function generateGenericHTML(documentType: string, brandName: string, startupIdea: StartupIdea): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName} - ${documentType.replace('-', ' ').toUpperCase()}</title>
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
        <p>This document contains detailed information about your ${startupIdea.industry} startup project.</p>
        
        <h2>Company Information</h2>
        <ul>
            <li><strong>Company Name:</strong> ${brandName}</li>
            <li><strong>Industry:</strong> ${startupIdea.industry}</li>
            <li><strong>Target Market:</strong> ${startupIdea.targetMarket}</li>
            <li><strong>Description:</strong> ${startupIdea.description}</li>
        </ul>
    </div>
</body>
</html>`;
}

function getMarketSize(industry: string): string {
  const sizes: Record<string, string> = {
    'HealthTech': '374B',
    'EdTech': '89B',
    'FinTech': '179B',
    'AgriTech': '47B',
    'RetailTech': '56B',
    'FoodTech': '43B',
    'PropTech': '31B',
    'LegalTech': '27B'
  };
  return sizes[industry] || '25B';
}

function getFundingAmount(targetMarket: string): string {
  return targetMarket?.includes('Enterprise') ? '$5M' : '$2.5M';
}