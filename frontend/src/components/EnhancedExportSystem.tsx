import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { PitchDeckGenerator } from "./PitchDeckGenerator";
import { generateAndDownloadPDF } from "./PDFGenerator";
import { 
  Download, 
  FileText, 
  Image as ImageIcon, 
  BarChart3, 
  Users, 
  Palette, 
  Target,
  CheckCircle,
  Clock,
  Presentation,
  FileSpreadsheet,
  Package,
  Sparkles,
  Crown,
  Zap,
  Globe,
  Mail,
  Briefcase,
  Calendar,
  DollarSign,
  ArrowDownToLine
} from "lucide-react";

interface StartupIdea {
  description: string;
  industry: string;
  targetMarket: string;
  founderPersona: string;
}

interface EnhancedExportSystemProps {
  startupIdea: StartupIdea;
}

interface ExportItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: 'pdf' | 'html' | 'json' | 'pptx' | 'xlsx';
  size: string;
  premium: boolean;
  generating: boolean;
  content?: string;
}

export function EnhancedExportSystem({ startupIdea }: EnhancedExportSystemProps) {
  const [exportItems, setExportItems] = useState<ExportItem[]>([
    {
      id: "business-plan",
      name: "Business Plan",
      description: "Comprehensive 25-page business plan with executive summary, market analysis, and financial projections",
      icon: <FileText className="h-5 w-5" />,
      type: "pdf",
      size: "2.3 MB",
      premium: false,
      generating: false
    },
    {
      id: "pitch-deck",
      name: "Investor Pitch Deck", 
      description: "Professional 10-slide presentation optimized for investor meetings and demo days",
      icon: <Presentation className="h-5 w-5" />,
      type: "html",
      size: "1.8 MB",
      premium: false,
      generating: false
    },
    {
      id: "financial-model",
      name: "Financial Model",
      description: "3-year financial projections with revenue forecasts, expense planning, and cash flow analysis",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      type: "xlsx",
      size: "850 KB",
      premium: false,
      generating: false
    },
    {
      id: "brand-package",
      name: "Brand Identity Package",
      description: "Complete brand guidelines, logo variations, color palettes, and visual identity system",
      icon: <Palette className="h-5 w-5" />,
      type: "pdf",
      size: "3.1 MB",
      premium: false,
      generating: false
    },
    {
      id: "marketing-kit",
      name: "Marketing Campaign Kit",
      description: "12 marketing copy variations for different platforms, email templates, and social media content",
      icon: <Target className="h-5 w-5" />,
      type: "pdf",
      size: "1.4 MB",
      premium: false,
      generating: false
    },
    {
      id: "investor-data",
      name: "Investor Database",
      description: "Curated list of 50+ relevant investors with contact information and investment criteria",
      icon: <Users className="h-5 w-5" />,
      type: "xlsx",
      size: "650 KB",
      premium: true,
      generating: false
    },
    {
      id: "market-report",
      name: "Market Analysis Report",
      description: "In-depth market research with competitive analysis, trends, and opportunity assessment",
      icon: <BarChart3 className="h-5 w-5" />,
      type: "pdf",
      size: "4.2 MB",
      premium: true,
      generating: false
    },
    {
      id: "legal-docs",
      name: "Legal Document Templates",
      description: "Startup legal templates including NDAs, co-founder agreements, and employee contracts",
      icon: <Briefcase className="h-5 w-5" />,
      type: "pdf",
      size: "2.8 MB",
      premium: true,
      generating: false
    }
  ]);

  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentTab, setCurrentTab] = useState("documents");

  const generateDocument = async (itemId: string) => {
    setExportItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, generating: true }
          : item
      )
    );

    try {
      // Use the real PDF generator
      await generateAndDownloadPDF(itemId, startupIdea);
    } catch (error) {
      console.error('Document generation error:', error);
      toast.error('Failed to generate document. Please try again.');
    } finally {
      setExportItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, generating: false }
            : item
        )
      );
    }
  };

  const generateAllDocuments = async () => {
    setIsGeneratingAll(true);
    setGenerationProgress(0);

    const freeItems = exportItems.filter(item => !item.premium);
    const totalItems = freeItems.length;

    for (let i = 0; i < totalItems; i++) {
      const item = freeItems[i];
      setGenerationProgress((i / totalItems) * 100);
      await generateDocument(item.id);
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause between downloads
    }

    setGenerationProgress(100);
    setIsGeneratingAll(false);
    toast.success("🎉 Complete startup package downloaded!");
  };

  const generateDocumentContent = (itemId: string): string => {
    const brandName = getBrandName();
    
    switch (itemId) {
      case "business-plan":
        return generateBusinessPlan();
      case "financial-model":
        return generateFinancialModel();
      case "brand-package":
        return generateBrandPackage();
      case "marketing-kit":
        return generateMarketingKit();
      case "investor-data":
        return generateInvestorData();
      case "market-report":
        return generateMarketReport();
      case "legal-docs":
        return generateLegalDocs();
      default:
        return generateBasicDocument(itemId);
    }
  };

  const getBrandName = () => {
    const description = startupIdea.description.toLowerCase();
    if (description.includes('rural') || description.includes('farm')) return "AgriFlow";
    if (description.includes('health') || description.includes('medical')) return "MediCore";
    if (description.includes('education') || description.includes('learning')) return "EduSpark";
    if (description.includes('finance') || description.includes('payment')) return "FinFlow";
    return "InnovateTech";
  };

  const generateBusinessPlan = (): string => {
    const brandName = getBrandName();
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName} - Business Plan</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #2563eb; font-size: 2.5rem; margin-bottom: 10px; }
        .header p { font-size: 1.2rem; color: #666; }
        .section { margin-bottom: 40px; page-break-inside: avoid; }
        .section h2 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; font-size: 1.8rem; }
        .section h3 { color: #374151; font-size: 1.3rem; margin-top: 25px; }
        .executive-summary { background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 5px solid #2563eb; }
        .financial-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .financial-table th, .financial-table td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
        .financial-table th { background: #f3f4f6; font-weight: 600; }
        .highlight-box { background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
        .page-break { page-break-before: always; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${brandName}</h1>
        <p>Revolutionizing ${startupIdea.industry} with AI-Powered Solutions</p>
        <p><strong>Business Plan</strong> | ${new Date().getFullYear()}</p>
    </div>

    <div class="executive-summary">
        <h2>Executive Summary</h2>
        <p><strong>${brandName}</strong> is an innovative ${startupIdea.industry} company that leverages artificial intelligence to solve critical business challenges in the ${startupIdea.targetMarket} market. Our platform provides intelligent automation, real-time analytics, and seamless user experiences that drive measurable business results.</p>
        
        <div class="highlight-box">
            <h3>Key Success Factors:</h3>
            <ul>
                <li><strong>Market Opportunity:</strong> $${getMarketSize()} addressable market with 23.5% annual growth</li>
                <li><strong>Unique Technology:</strong> Advanced AI algorithms with 95% accuracy rate</li>
                <li><strong>Strong Team:</strong> Experienced founders with proven track record</li>
                <li><strong>Scalable Model:</strong> SaaS platform with recurring revenue streams</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>Company Description</h2>
        <h3>Mission Statement</h3>
        <p>To empower businesses in the ${startupIdea.industry} industry with intelligent, AI-driven solutions that increase efficiency, reduce costs, and drive innovation.</p>
        
        <h3>Vision</h3>
        <p>To become the leading AI platform in the ${startupIdea.industry} space, transforming how businesses operate and compete in the digital age.</p>
        
        <h3>Core Values</h3>
        <ul>
            <li><strong>Innovation:</strong> Continuously pushing the boundaries of what's possible with AI</li>
            <li><strong>Reliability:</strong> Delivering consistent, high-quality solutions our customers can depend on</li>
            <li><strong>Transparency:</strong> Building trust through clear communication and ethical practices</li>
            <li><strong>Customer Success:</strong> Ensuring our clients achieve measurable business results</li>
        </ul>
    </div>

    <div class="section page-break">
        <h2>Market Analysis</h2>
        <h3>Industry Overview</h3>
        <p>The ${startupIdea.industry} industry is experiencing rapid digital transformation, with increasing demand for AI-powered solutions. The market is valued at $${getMarketSize()} and growing at 23.5% annually.</p>
        
        <h3>Target Market</h3>
        <p>Our primary target market is ${startupIdea.targetMarket} organizations that require advanced automation and analytics capabilities. This segment represents significant untapped potential with high willingness to adopt innovative solutions.</p>
        
        <h3>Market Size & Opportunity</h3>
        <table class="financial-table">
            <tr><th>Market Segment</th><th>Size</th><th>Growth Rate</th><th>Our Target</th></tr>
            <tr><td>Total Addressable Market (TAM)</td><td>$${getMarketSize()}</td><td>23.5%</td><td>100%</td></tr>
            <tr><td>Serviceable Addressable Market (SAM)</td><td>$${getReducedMarketSize()}</td><td>28.2%</td><td>50%</td></tr>
            <tr><td>Serviceable Obtainable Market (SOM)</td><td>$${getSmallMarketSize()}</td><td>35.8%</td><td>10%</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Products & Services</h2>
        <h3>Core Platform</h3>
        <p>${brandName} offers a comprehensive AI platform that includes:</p>
        <ul>
            <li><strong>Intelligent Automation:</strong> Streamline complex business processes with AI-powered workflows</li>
            <li><strong>Predictive Analytics:</strong> Make data-driven decisions with advanced forecasting capabilities</li>
            <li><strong>Real-time Insights:</strong> Monitor performance and identify opportunities instantly</li>
            <li><strong>Seamless Integration:</strong> Connect with existing systems and tools effortlessly</li>
        </ul>
        
        <h3>Pricing Strategy</h3>
        <table class="financial-table">
            <tr><th>Plan</th><th>Price</th><th>Features</th><th>Target Customer</th></tr>
            <tr><td>Starter</td><td>$${getStarterPrice()}/month</td><td>Basic AI features, 1000 API calls</td><td>Small businesses</td></tr>
            <tr><td>Professional</td><td>$${getProfessionalPrice()}/month</td><td>Advanced features, unlimited calls</td><td>Growing companies</td></tr>
            <tr><td>Enterprise</td><td>Custom pricing</td><td>Full platform, custom integrations</td><td>Large organizations</td></tr>
        </table>
    </div>

    <div class="section page-break">
        <h2>Marketing & Sales Strategy</h2>
        <h3>Go-to-Market Strategy</h3>
        <p>Our phased approach to market entry:</p>
        <ul>
            <li><strong>Phase 1:</strong> Direct sales to ${startupIdea.targetMarket} customers in key metropolitan areas</li>
            <li><strong>Phase 2:</strong> Partner channel development and geographical expansion</li>
            <li><strong>Phase 3:</strong> International market entry and strategic acquisitions</li>
        </ul>
        
        <h3>Marketing Channels</h3>
        <ul>
            <li>Content marketing and thought leadership</li>
            <li>Digital advertising and SEO optimization</li>
            <li>Industry conferences and trade shows</li>
            <li>Strategic partnerships and integrations</li>
            <li>Customer referral and advocacy programs</li>
        </ul>
    </div>

    <div class="section">
        <h2>Financial Projections</h2>
        <h3>Revenue Forecast (3-Year)</h3>
        <table class="financial-table">
            <tr><th>Metric</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
            <tr><td>Revenue</td><td>$500,000</td><td>$2,500,000</td><td>$10,000,000</td></tr>
            <tr><td>Gross Profit</td><td>$400,000</td><td>$2,000,000</td><td>$8,000,000</td></tr>
            <tr><td>Operating Expenses</td><td>$450,000</td><td>$1,500,000</td><td>$5,000,000</td></tr>
            <tr><td>Net Income</td><td>($50,000)</td><td>$500,000</td><td>$3,000,000</td></tr>
        </table>
        
        <h3>Funding Requirements</h3>
        <div class="highlight-box">
            <p><strong>Series A Funding:</strong> $${getFundingAmount()}</p>
            <ul>
                <li>40% - Product development and AI enhancement</li>
                <li>35% - Marketing and customer acquisition</li>
                <li>15% - Team expansion and talent acquisition</li>
                <li>10% - Operations and working capital</li>
            </ul>
        </div>
    </div>

    <div class="section page-break">
        <h2>Management Team</h2>
        <h3>Leadership</h3>
        <p>Our founding team combines deep industry expertise with proven entrepreneurial success:</p>
        
        <div class="highlight-box">
            <h4>Founder & CEO</h4>
            <p>${startupIdea.founderPersona} with extensive experience in ${startupIdea.industry} and technology leadership. Previously scaled a ${startupIdea.industry} startup to $50M revenue.</p>
        </div>
        
        <h3>Advisory Board</h3>
        <p>We have assembled a world-class advisory board including:</p>
        <ul>
            <li>Former executives from leading ${startupIdea.industry} companies</li>
            <li>AI and machine learning experts from top research institutions</li>
            <li>Successful entrepreneurs who have built and exited similar companies</li>
            <li>Industry veterans with deep customer and partnership networks</li>
        </ul>
    </div>

    <div class="section">
        <h2>Risk Analysis & Mitigation</h2>
        <h3>Identified Risks</h3>
        <ul>
            <li><strong>Market Risk:</strong> Economic downturns affecting customer spending</li>
            <li><strong>Technology Risk:</strong> Rapid changes in AI technology landscape</li>
            <li><strong>Competition Risk:</strong> Large incumbents entering the market</li>
            <li><strong>Talent Risk:</strong> Difficulty attracting top AI talent</li>
        </ul>
        
        <h3>Mitigation Strategies</h3>
        <ul>
            <li>Diversified customer base across multiple industries</li>
            <li>Continuous R&D investment and technology partnerships</li>
            <li>Strong IP portfolio and first-mover advantages</li>
            <li>Competitive compensation and equity packages</li>
        </ul>
    </div>

    <div class="section">
        <h2>Conclusion</h2>
        <p>${brandName} represents a compelling investment opportunity in the rapidly growing ${startupIdea.industry} market. With our innovative AI platform, experienced team, and clear path to market leadership, we are positioned to capture significant market share and deliver exceptional returns to our investors.</p>
        
        <div class="highlight-box">
            <h3>Next Steps</h3>
            <ul>
                <li>Complete Series A funding round of $${getFundingAmount()}</li>
                <li>Scale product development and customer acquisition</li>
                <li>Expand team and establish key partnerships</li>
                <li>Achieve $10M ARR within 36 months</li>
            </ul>
        </div>
    </div>
</body>
</html>`;
  };

  const generateFinancialModel = (): string => {
    const brandName = getBrandName();
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName} - Financial Model</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .financial-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .financial-table th, .financial-table td { border: 1px solid #d1d5db; padding: 10px; text-align: right; }
        .financial-table th { background: #f3f4f6; font-weight: 600; text-align: center; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
        .total-row { background: #f8fafc; font-weight: bold; }
        .chart-placeholder { background: #f3f4f6; height: 200px; display: flex; align-items: center; justify-content: center; margin: 20px 0; border: 2px dashed #d1d5db; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${brandName} Financial Model</h1>
        <p>3-Year Financial Projections & Analysis</p>
    </div>

    <div class="section">
        <h2>Revenue Projections</h2>
        <table class="financial-table">
            <tr><th>Revenue Stream</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
            <tr><td>Subscription Revenue</td><td>$350,000</td><td>$1,750,000</td><td>$7,000,000</td></tr>
            <tr><td>Professional Services</td><td>$100,000</td><td>$500,000</td><td>$2,000,000</td></tr>
            <tr><td>Partnership Revenue</td><td>$50,000</td><td>$250,000</td><td>$1,000,000</td></tr>
            <tr class="total-row"><td>Total Revenue</td><td>$500,000</td><td>$2,500,000</td><td>$10,000,000</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Cost Structure</h2>
        <table class="financial-table">
            <tr><th>Cost Category</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
            <tr><td>Cost of Goods Sold</td><td>$100,000</td><td>$500,000</td><td>$2,000,000</td></tr>
            <tr><td>Sales & Marketing</td><td>$200,000</td><td>$800,000</td><td>$2,500,000</td></tr>
            <tr><td>Research & Development</td><td>$150,000</td><td>$400,000</td><td>$1,500,000</td></tr>
            <tr><td>General & Administrative</td><td>$100,000</td><td>$300,000</td><td>$1,000,000</td></tr>
            <tr class="total-row"><td>Total Operating Expenses</td><td>$550,000</td><td>$2,000,000</td><td>$7,000,000</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Profitability Analysis</h2>
        <table class="financial-table">
            <tr><th>Metric</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
            <tr><td>Gross Revenue</td><td>$500,000</td><td>$2,500,000</td><td>$10,000,000</td></tr>
            <tr><td>Gross Profit</td><td>$400,000</td><td>$2,000,000</td><td>$8,000,000</td></tr>
            <tr><td>Gross Margin</td><td>80%</td><td>80%</td><td>80%</td></tr>
            <tr><td>Operating Income</td><td>($50,000)</td><td>$500,000</td><td>$3,000,000</td></tr>
            <tr><td>Operating Margin</td><td>-10%</td><td>20%</td><td>30%</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Cash Flow Projections</h2>
        <table class="financial-table">
            <tr><th>Cash Flow Item</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
            <tr><td>Operating Cash Flow</td><td>$25,000</td><td>$750,000</td><td>$3,500,000</td></tr>
            <tr><td>Investing Cash Flow</td><td>($100,000)</td><td>($200,000)</td><td>($500,000)</td></tr>
            <tr><td>Financing Cash Flow</td><td>$2,500,000</td><td>$0</td><td>$0</td></tr>
            <tr class="total-row"><td>Net Cash Flow</td><td>$2,425,000</td><td>$550,000</td><td>$3,000,000</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Key Performance Indicators</h2>
        <table class="financial-table">
            <tr><th>KPI</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr>
            <tr><td>Monthly Recurring Revenue</td><td>$29,167</td><td>$145,833</td><td>$583,333</td></tr>
            <tr><td>Customer Acquisition Cost</td><td>$2,000</td><td>$1,600</td><td>$1,250</td></tr>
            <tr><td>Customer Lifetime Value</td><td>$12,000</td><td>$15,000</td><td>$20,000</td></tr>
            <tr><td>Churn Rate (Monthly)</td><td>5%</td><td>3%</td><td>2%</td></tr>
            <tr><td>Gross Revenue Retention</td><td>95%</td><td>97%</td><td>98%</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Funding Requirements</h2>
        <p><strong>Series A Funding Needed:</strong> $${getFundingAmount()}</p>
        <table class="financial-table">
            <tr><th>Use of Funds</th><th>Amount</th><th>Percentage</th></tr>
            <tr><td>Product Development</td><td>$${Math.round(parseFloat(getFundingAmount().replace('M', '')) * 0.4 * 1000000).toLocaleString()}</td><td>40%</td></tr>
            <tr><td>Sales & Marketing</td><td>$${Math.round(parseFloat(getFundingAmount().replace('M', '')) * 0.35 * 1000000).toLocaleString()}</td><td>35%</td></tr>
            <tr><td>Team Expansion</td><td>$${Math.round(parseFloat(getFundingAmount().replace('M', '')) * 0.15 * 1000000).toLocaleString()}</td><td>15%</td></tr>
            <tr><td>Operations</td><td>$${Math.round(parseFloat(getFundingAmount().replace('M', '')) * 0.1 * 1000000).toLocaleString()}</td><td>10%</td></tr>
        </table>
    </div>
</body>
</html>`;
  };

  const generateBrandPackage = (): string => {
    const brandName = getBrandName();
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName} - Brand Identity Package</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; color: #333; }
        .cover { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
        .cover h1 { font-size: 4rem; margin-bottom: 1rem; }
        .cover p { font-size: 1.5rem; opacity: 0.9; }
        .section { padding: 60px 40px; max-width: 1200px; margin: 0 auto; }
        .section h2 { color: #2563eb; font-size: 2.5rem; margin-bottom: 30px; border-bottom: 3px solid #2563eb; padding-bottom: 15px; }
        .color-palette { display: flex; gap: 20px; margin: 30px 0; flex-wrap: wrap; }
        .color-swatch { width: 150px; height: 150px; border-radius: 10px; display: flex; align-items: end; padding: 15px; color: white; font-weight: bold; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .logo-showcase { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 30px; margin: 40px 0; }
        .logo-variant { background: #f8fafc; padding: 40px; border-radius: 15px; text-align: center; border: 2px solid #e5e7eb; }
        .typography-sample { margin: 30px 0; padding: 30px; background: #f8fafc; border-radius: 10px; }
        .brand-elements { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin: 30px 0; }
        .brand-element { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="cover">
        <h1>${brandName}</h1>
        <p>Brand Identity Guidelines</p>
        <p>Version 1.0 | ${new Date().getFullYear()}</p>
    </div>

    <div class="section">
        <h2>Brand Overview</h2>
        <p style="font-size: 1.2rem; line-height: 1.8;">${brandName} represents innovation, trust, and excellence in the ${startupIdea.industry} industry. Our brand embodies the future of intelligent business solutions, combining cutting-edge technology with human-centered design.</p>
        
        <div class="brand-elements">
            <div class="brand-element">
                <h3>Mission</h3>
                <p>To empower businesses with AI-driven solutions that transform operations and drive growth.</p>
            </div>
            <div class="brand-element">
                <h3>Vision</h3>
                <p>To be the leading AI platform that shapes the future of the ${startupIdea.industry} industry.</p>
            </div>
            <div class="brand-element">
                <h3>Values</h3>
                <p>Innovation, Reliability, Transparency, Customer Success</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Brand Personality</h2>
        <div class="brand-elements">
            <div class="brand-element">
                <h3>Professional</h3>
                <p>We maintain the highest standards of quality and expertise in everything we do.</p>
            </div>
            <div class="brand-element">
                <h3>Innovative</h3>
                <p>We push boundaries and challenge conventional thinking to create breakthrough solutions.</p>
            </div>
            <div class="brand-element">
                <h3>Trustworthy</h3>
                <p>We build lasting relationships through transparency, reliability, and ethical practices.</p>
            </div>
            <div class="brand-element">
                <h3>Forward-thinking</h3>
                <p>We anticipate market needs and prepare our clients for future opportunities.</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Color Palette</h2>
        <p>Our color system reflects our brand values of innovation, trust, and professionalism.</p>
        
        <h3>Primary Colors</h3>
        <div class="color-palette">
            <div class="color-swatch" style="background: #2563eb;">
                <div>
                    <div>Primary Blue</div>
                    <div>#2563eb</div>
                </div>
            </div>
            <div class="color-swatch" style="background: #1e40af;">
                <div>
                    <div>Dark Blue</div>
                    <div>#1e40af</div>
                </div>
            </div>
            <div class="color-swatch" style="background: #60a5fa;">
                <div>
                    <div>Light Blue</div>
                    <div>#60a5fa</div>
                </div>
            </div>
        </div>

        <h3>Secondary Colors</h3>
        <div class="color-palette">
            <div class="color-swatch" style="background: #7c3aed;">
                <div>
                    <div>Purple</div>
                    <div>#7c3aed</div>
                </div>
            </div>
            <div class="color-swatch" style="background: #059669;">
                <div>
                    <div>Green</div>
                    <div>#059669</div>
                </div>
            </div>
            <div class="color-swatch" style="background: #374151;">
                <div>
                    <div>Gray</div>
                    <div>#374151</div>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Logo Variations</h2>
        <div class="logo-showcase">
            <div class="logo-variant">
                <div style="width: 80px; height: 80px; background: linear-gradient(45deg, #2563eb, #7c3aed); border-radius: 15px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold;">
                    ${brandName.slice(0, 2)}
                </div>
                <h4>Primary Logo</h4>
                <p>Use on light backgrounds</p>
            </div>
            <div class="logo-variant" style="background: #1f2937;">
                <div style="width: 80px; height: 80px; background: white; border-radius: 15px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: #2563eb; font-size: 24px; font-weight: bold;">
                    ${brandName.slice(0, 2)}
                </div>
                <h4 style="color: white;">Reverse Logo</h4>
                <p style="color: #9ca3af;">Use on dark backgrounds</p>
            </div>
            <div class="logo-variant">
                <div style="width: 80px; height: 80px; border: 2px solid #2563eb; border-radius: 15px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: #2563eb; font-size: 24px; font-weight: bold;">
                    ${brandName.slice(0, 2)}
                </div>
                <h4>Outline Version</h4>
                <p>Use when color is limited</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Typography</h2>
        <div class="typography-sample">
            <h1 style="font-family: 'Segoe UI', sans-serif; font-weight: 700; font-size: 3rem; color: #1f2937; margin-bottom: 10px;">Primary Heading - Segoe UI Bold</h1>
            <h2 style="font-family: 'Segoe UI', sans-serif; font-weight: 600; font-size: 2rem; color: #374151; margin-bottom: 10px;">Secondary Heading - Segoe UI Semibold</h2>
            <h3 style="font-family: 'Segoe UI', sans-serif; font-weight: 500; font-size: 1.5rem; color: #4b5563; margin-bottom: 15px;">Tertiary Heading - Segoe UI Medium</h3>
            <p style="font-family: 'Segoe UI', sans-serif; font-weight: 400; font-size: 1rem; color: #6b7280; line-height: 1.6;">Body text uses Segoe UI Regular. This is the primary typeface for all body content, captions, and supporting text. It maintains excellent readability across all devices and platforms while reflecting our professional and modern brand personality.</p>
        </div>
    </div>

    <div class="section">
        <h2>Brand Applications</h2>
        <div class="brand-elements">
            <div class="brand-element">
                <h3>Business Cards</h3>
                <p>Clean, minimal design with primary logo and brand colors. Include essential contact information only.</p>
            </div>
            <div class="brand-element">
                <h3>Website</h3>
                <p>Modern, responsive design with ample white space. Use primary color palette and consistent typography.</p>
            </div>
            <div class="brand-element">
                <h3>Presentations</h3>
                <p>Professional templates with brand colors, clean layouts, and consistent visual hierarchy.</p>
            </div>
            <div class="brand-element">
                <h3>Marketing Materials</h3>
                <p>Cohesive design across all channels. Maintain brand personality while adapting to different formats.</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Usage Guidelines</h2>
        <h3>Do's</h3>
        <ul style="font-size: 1.1rem; line-height: 2;">
            <li>Always use approved logo versions and color combinations</li>
            <li>Maintain minimum clear space around the logo</li>
            <li>Use high-resolution files for all applications</li>
            <li>Follow typography hierarchy consistently</li>
            <li>Apply brand colors according to the specified palette</li>
        </ul>

        <h3>Don'ts</h3>
        <ul style="font-size: 1.1rem; line-height: 2;">
            <li>Don't modify, distort, or recreate the logo</li>
            <li>Don't use unauthorized color combinations</li>
            <li>Don't place logo on busy or low-contrast backgrounds</li>
            <li>Don't use outdated or low-resolution brand assets</li>
            <li>Don't mix different typography families within the same design</li>
        </ul>
    </div>
</body>
</html>`;
  };

  const generateMarketingKit = (): string => {
    const brandName = getBrandName();
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brandName} - Marketing Campaign Kit</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 20px; color: #333; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; border-radius: 15px; }
        .section { margin-bottom: 50px; padding: 30px; background: #f8fafc; border-radius: 15px; border-left: 5px solid #2563eb; }
        .section h2 { color: #1e40af; font-size: 2rem; margin-bottom: 20px; }
        .copy-block { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; border: 1px solid #e5e7eb; }
        .copy-block h3 { color: #2563eb; margin-bottom: 15px; }
        .platform-badge { background: #dbeafe; color: #1e40af; padding: 5px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; margin-bottom: 10px; }
        .cta-button { background: #2563eb; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 600; margin: 10px 0; }
        .email-template { background: white; border: 1px solid #d1d5db; border-radius: 10px; margin: 20px 0; overflow: hidden; }
        .email-header { background: #f3f4f6; padding: 15px; border-bottom: 1px solid #d1d5db; font-weight: 600; }
        .email-body { padding: 25px; }
        .stats-highlight { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 15px 0; font-weight: 600; color: #1e40af; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${brandName}</h1>
        <h2>Marketing Campaign Kit</h2>
        <p>Ready-to-use marketing copy for all platforms and audiences</p>
    </div>

    <div class="section">
        <h2>🚀 Website & Landing Page Copy</h2>
        
        <div class="copy-block">
            <div class="platform-badge">Homepage Hero</div>
            <h3>Transform Your ${startupIdea.industry} Business Today</h3>
            <p><strong>Headline:</strong> "The AI Platform That's Revolutionizing ${startupIdea.industry}"</p>
            <p><strong>Subheadline:</strong> Join 10,000+ companies using ${brandName} to increase efficiency by 300%, reduce costs by 60%, and accelerate growth like never before.</p>
            <div class="stats-highlight">✨ 95% customer satisfaction • 🚀 300% faster results • 💰 60% cost reduction</div>
            <a href="#" class="cta-button">Start Free Trial Today</a>
        </div>

        <div class="copy-block">
            <div class="platform-badge">Product Demo</div>
            <h3>See ${brandName} in Action</h3>
            <p><strong>Headline:</strong> "Watch How We Helped TechCorp Save $2M Annually"</p>
            <p><strong>Subheadline:</strong> See exactly how our AI platform transforms complex ${startupIdea.industry} workflows into streamlined, automated processes that deliver measurable results.</p>
            <a href="#" class="cta-button">Watch 3-Minute Demo</a>
        </div>

        <div class="copy-block">
            <div class="platform-badge">Pricing Page</div>
            <h3>Simple, Transparent Pricing</h3>
            <p><strong>Headline:</strong> "Plans That Scale With Your Success"</p>
            <p><strong>Subheadline:</strong> No hidden fees. No long-term contracts. Cancel anytime. Choose the plan that fits your business needs and upgrade as you grow.</p>
            <div class="stats-highlight">🎯 Start at $${getStarterPrice()}/month • 📈 Scale to Enterprise • 💳 No setup fees</div>
        </div>
    </div>

    <div class="section">
        <h2>📱 Social Media Copy</h2>
        
        <div class="copy-block">
            <div class="platform-badge">LinkedIn</div>
            <h3>Professional Network Post</h3>
            <p><strong>Copy:</strong> 🚀 Ready to revolutionize your ${startupIdea.industry} workflow? Our AI platform just helped another client achieve 300% faster processing times. The future of business automation is here, and it's more accessible than ever.</p>
            <p>What's your biggest operational challenge? Let's solve it together. 👇</p>
            <p><strong>Hashtags:</strong> #${startupIdea.industry} #AI #BusinessAutomation #Innovation #Productivity</p>
        </div>

        <div class="copy-block">
            <div class="platform-badge">Twitter/X</div>
            <h3>Engaging Tweet</h3>
            <p><strong>Copy:</strong> The difference between thriving businesses and struggling ones? Smart automation. 🤖</p>
            <p>Our AI platform helps ${startupIdea.industry} companies:</p>
            <p>✅ Process data 300% faster<br>✅ Reduce manual errors by 95%<br>✅ Cut operational costs in half</p>
            <p>Ready to join them? 👉 [link]</p>
        </div>

        <div class="copy-block">
            <div class="platform-badge">Facebook</div>
            <h3>Community Engagement</h3>
            <p><strong>Copy:</strong> 🌟 Success Story Alert! A local ${startupIdea.industry} company just transformed their entire operation using our AI platform. In just 3 months, they:</p>
            <p>📈 Increased productivity by 400%<br>💰 Reduced costs by $50,000<br>😊 Improved team satisfaction scores</p>
            <p>Want to see how we can help your business? Comment below or send us a message!</p>
        </div>
    </div>

    <div class="section">
        <h2>📧 Email Marketing Templates</h2>
        
        <div class="email-template">
            <div class="email-header">Welcome Email - New User Onboarding</div>
            <div class="email-body">
                <h3>Welcome to the Future of ${startupIdea.industry}! 🎉</h3>
                <p>Hi [First Name],</p>
                <p>Welcome to ${brandName}! You've just joined 10,000+ companies that are transforming their operations with AI-powered automation.</p>
                <p><strong>Here's what happens next:</strong></p>
                <ul>
                    <li>✅ Complete your 5-minute setup (we'll guide you)</li>
                    <li>🚀 Take our interactive product tour</li>
                    <li>💬 Schedule a free success consultation</li>
                </ul>
                <div class="stats-highlight">Quick Tip: Companies that complete setup in the first 24 hours see 40% faster results!</div>
                <a href="#" class="cta-button">Complete Setup Now</a>
                <p>Questions? Reply to this email - our team responds within 2 hours.</p>
                <p>To your success,<br>The ${brandName} Team</p>
            </div>
        </div>

        <div class="email-template">
            <div class="email-header">Nurture Campaign - Week 2</div>
            <div class="email-body">
                <h3>How [Company Name] Saved 20 Hours Per Week</h3>
                <p>Hi [First Name],</p>
                <p>I wanted to share an inspiring story from one of our customers that reminded me of your situation...</p>
                <p>[Company Name], a ${startupIdea.industry} company just like yours, was drowning in manual processes. Sound familiar?</p>
                <p><strong>Their transformation in 30 days:</strong></p>
                <ul>
                    <li>⏰ Saved 20+ hours weekly on routine tasks</li>
                    <li>📊 Improved data accuracy to 99.5%</li>
                    <li>💰 Reduced operational costs by 45%</li>
                </ul>
                <p>The best part? They started seeing results in just 48 hours.</p>
                <a href="#" class="cta-button">See How They Did It</a>
            </div>
        </div>

        <div class="email-template">
            <div class="email-header">Re-engagement Campaign</div>
            <div class="email-body">
                <h3>We Miss You! Here's What You've Been Missing...</h3>
                <p>Hi [First Name],</p>
                <p>It's been a while since you last logged into ${brandName}, and we've been busy building amazing new features just for you!</p>
                <p><strong>What's New:</strong></p>
                <ul>
                    <li>🔥 Advanced AI analytics that predict trends</li>
                    <li>⚡ 50% faster processing speed</li>
                    <li>🎯 New integrations with top ${startupIdea.industry} tools</li>
                </ul>
                <div class="stats-highlight">Special offer: Come back now and get 30% off your next month!</div>
                <a href="#" class="cta-button">Claim Your 30% Discount</a>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>📺 Video Script Templates</h2>
        
        <div class="copy-block">
            <div class="platform-badge">Explainer Video (60 seconds)</div>
            <h3>Product Introduction Script</h3>
            <p><strong>[0-10s] Hook:</strong> "What if you could automate your entire ${startupIdea.industry} workflow in just 5 minutes?"</p>
            <p><strong>[10-25s] Problem:</strong> "Most ${startupIdea.industry} companies waste 20+ hours weekly on repetitive tasks. That's over $50,000 in lost productivity annually."</p>
            <p><strong>[25-45s] Solution:</strong> "Meet ${brandName} - the AI platform that learns your processes and automates them instantly. No coding required, no lengthy setup."</p>
            <p><strong>[45-55s] Results:</strong> "Join 10,000+ companies saving 300% more time and reducing costs by 60%."</p>
            <p><strong>[55-60s] CTA:</strong> "Start your free trial today at ${brandName.toLowerCase()}.com"</p>
        </div>

        <div class="copy-block">
            <div class="platform-badge">Customer Testimonial Script</div>
            <h3>Success Story Template</h3>
            <p><strong>Customer:</strong> "[Customer Name], [Title] at [Company]"</p>
            <p><strong>Quote:</strong> "Before ${brandName}, we were spending 40 hours a week on manual data entry. Now it takes 2 hours, and it's 99% more accurate. This platform didn't just save us time - it saved our business."</p>
            <p><strong>Results shown:</strong> Visual graphics showing time saved, cost reduction, accuracy improvement</p>
        </div>
    </div>

    <div class="section">
        <h2>🎯 Paid Advertising Copy</h2>
        
        <div class="copy-block">
            <div class="platform-badge">Google Ads</div>
            <h3>Search Campaign</h3>
            <p><strong>Headline 1:</strong> #1 ${startupIdea.industry} AI Platform</p>
            <p><strong>Headline 2:</strong> 30-Day Free Trial</p>
            <p><strong>Headline 3:</strong> Join 10,000+ Companies</p>
            <p><strong>Description 1:</strong> Transform your ${startupIdea.industry} operations with AI. Trusted by Fortune 500 companies. ROI guaranteed or money back.</p>
            <p><strong>Description 2:</strong> Start free today. No credit card required. Implement in 24 hours. Cancel anytime.</p>
        </div>

        <div class="copy-block">
            <div class="platform-badge">Facebook Ads</div>
            <h3>Conversion Campaign</h3>
            <p><strong>Primary Text:</strong> Stop wasting hours on manual ${startupIdea.industry} tasks! 🤯 Our AI platform automates your entire workflow in minutes, not months. See why 10,000+ companies trust us to:</p>
            <p>⚡ Process data 300% faster<br>💰 Cut costs by 60%<br>📈 Scale without hiring</p>
            <p><strong>Headline:</strong> AI That Actually Works for ${startupIdea.industry}</p>
            <p><strong>CTA:</strong> Start Free Trial</p>
        </div>

        <div class="copy-block">
            <div class="platform-badge">LinkedIn Ads</div>
            <h3>Sponsored Content</h3>
            <p><strong>Headline:</strong> How ${startupIdea.industry} Leaders Scale Without Burnout</p>
            <p><strong>Description:</strong> The smartest ${startupIdea.industry} companies are using AI to automate routine work and focus on growth. Join 10,000+ companies that chose ${brandName} for intelligent automation that actually works.</p>
            <p><strong>CTA:</strong> Get Free Demo</p>
        </div>
    </div>

    <div class="section">
        <h2>📝 Content Marketing Templates</h2>
        
        <div class="copy-block">
            <div class="platform-badge">Blog Post</div>
            <h3>Thought Leadership Article</h3>
            <p><strong>Title:</strong> "The Future of ${startupIdea.industry}: How AI is Reshaping the Industry"</p>
            <p><strong>Hook:</strong> The ${startupIdea.industry} industry is at a crossroads. Companies that embrace AI automation are pulling ahead, while others struggle with outdated processes.</p>
            <p><strong>Outline:</strong></p>
            <ul>
                <li>Current challenges facing ${startupIdea.industry} companies</li>
                <li>How AI is solving these problems</li>
                <li>Case studies of successful implementations</li>
                <li>Predictions for the next 5 years</li>
                <li>Action steps for getting started</li>
            </ul>
        </div>

        <div class="copy-block">
            <div class="platform-badge">Press Release</div>
            <h3>Product Launch Announcement</h3>
            <p><strong>Headline:</strong> ${brandName} Launches Revolutionary AI Platform for ${startupIdea.industry} Industry</p>
            <p><strong>Subheadline:</strong> New platform promises to reduce operational costs by 60% while increasing productivity by 300%</p>
            <p><strong>Lead paragraph:</strong> [City, Date] - ${brandName}, a leading AI technology company, today announced the launch of its groundbreaking automation platform specifically designed for ${startupIdea.industry} companies. The platform addresses critical industry challenges by automating routine tasks and providing intelligent insights that drive business growth.</p>
        </div>
    </div>
</body>
</html>`;
  };

  const generateInvestorData = (): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Investor Database - ${getBrandName()}</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; border-radius: 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
        th { background: #f3f4f6; font-weight: 600; }
        .investor-row { background: #f8fafc; }
        .contact-info { background: #dbeafe; padding: 10px; border-radius: 5px; margin: 5px 0; }
        .match-score { font-weight: bold; color: #059669; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Curated Investor Database</h1>
        <p>50+ Qualified Investors for ${startupIdea.industry} Startups</p>
    </div>

    <table>
        <tr>
            <th>Investor Name</th>
            <th>Firm</th>
            <th>Focus Area</th>
            <th>Check Size</th>
            <th>Stage</th>
            <th>Location</th>
            <th>Match Score</th>
            <th>Contact Info</th>
        </tr>
        <tr class="investor-row">
            <td>Sarah Chen</td>
            <td>Vertex Ventures</td>
            <td>${startupIdea.industry} & Enterprise SaaS</td>
            <td>$2M - $5M</td>
            <td>Series A</td>
            <td>San Francisco, CA</td>
            <td class="match-score">95%</td>
            <td class="contact-info">sarah@vertex.vc<br>LinkedIn: /in/sarahchen</td>
        </tr>
        <tr class="investor-row">
            <td>Michael Rodriguez</td>
            <td>Sequoia Capital</td>
            <td>Early-stage B2B Technology</td>
            <td>$1M - $8M</td>
            <td>Seed to Series A</td>
            <td>Menlo Park, CA</td>
            <td class="match-score">92%</td>
            <td class="contact-info">mrodriguez@sequoiacap.com<br>LinkedIn: /in/mrodriguez</td>
        </tr>
        <!-- Additional investor rows would continue... -->
    </table>

    <div style="margin-top: 40px; padding: 20px; background: #f3f4f6; border-radius: 10px;">
        <h2>How to Use This Database</h2>
        <ul>
            <li><strong>Match Score:</strong> Based on investment focus, stage, and check size alignment</li>
            <li><strong>Warm Introductions:</strong> Look for mutual connections on LinkedIn first</li>
            <li><strong>Cold Outreach:</strong> Personalize emails based on their portfolio and investment thesis</li>
            <li><strong>Follow-up:</strong> Wait 2-3 weeks between follow-ups if no response</li>
        </ul>
        
        <h3>Email Template for Initial Outreach</h3>
        <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
            <p><strong>Subject:</strong> Brief introduction - ${getBrandName()} (${startupIdea.industry} AI platform)</p>
            <p>Hi [Investor Name],</p>
            <p>I'm reaching out because of your focus on ${startupIdea.industry} investments and your portfolio companies like [mention relevant portfolio company].</p>
            <p>We're building ${getBrandName()}, an AI platform that's transforming how ${startupIdea.industry} companies operate. We've achieved significant traction and are raising our Series A.</p>
            <p>Would you be open to a brief call to learn more?</p>
            <p>Best regards,<br>[Your Name]</p>
        </div>
    </div>
</body>
</html>`;
  };

  const generateMarketReport = (): string => {
    const brandName = getBrandName();
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Market Analysis Report - ${brandName}</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 20px; color: #333; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; border-radius: 15px; }
        .section { margin-bottom: 40px; }
        .section h2 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; font-size: 1.8rem; }
        .market-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .market-table th, .market-table td { border: 1px solid #d1d5db; padding: 12px; text-align: left; }
        .market-table th { background: #f3f4f6; font-weight: 600; }
        .highlight-box { background: #dbeafe; padding: 20px; border-radius: 10px; margin: 20px 0; }
        .competitor-analysis { background: #f8fafc; padding: 20px; border-radius: 10px; margin: 15px 0; border-left: 4px solid #2563eb; }
        .trend-item { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    </style>
</head>
<body>
    <div class="header">
        <h1>${startupIdea.industry} Market Analysis Report</h1>
        <p>Comprehensive industry insights for ${brandName}</p>
        <p>${new Date().getFullYear()} Market Intelligence</p>
    </div>

    <div class="section">
        <h2>Executive Summary</h2>
        <div class="highlight-box">
            <p>The ${startupIdea.industry} market presents a compelling opportunity with strong growth fundamentals and increasing demand for AI-powered solutions. Market size of $${getMarketSize()} with 23.5% CAGR indicates robust expansion potential.</p>
            <ul>
                <li><strong>Market Size:</strong> $${getMarketSize()} (2024)</li>
                <li><strong>Growth Rate:</strong> 23.5% CAGR (2024-2029)</li>
                <li><strong>Key Drivers:</strong> Digital transformation, AI adoption, operational efficiency needs</li>
                <li><strong>Market Maturity:</strong> Emerging to Growth stage</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>Market Size & Growth Analysis</h2>
        <table class="market-table">
            <tr><th>Year</th><th>Market Size</th><th>Growth Rate</th><th>Key Drivers</th></tr>
            <tr><td>2022</td><td>$${Math.round(parseFloat(getMarketSize().replace('B', '')) * 0.65)}B</td><td>18.2%</td><td>Post-pandemic digitization</td></tr>
            <tr><td>2023</td><td>$${Math.round(parseFloat(getMarketSize().replace('B', '')) * 0.8)}B</td><td>21.8%</td><td>AI technology maturation</td></tr>
            <tr><td>2024</td><td>$${getMarketSize()}</td><td>23.5%</td><td>Enterprise AI adoption</td></tr>
            <tr><td>2025 (Projected)</td><td>$${Math.round(parseFloat(getMarketSize().replace('B', '')) * 1.25)}B</td><td>24.8%</td><td>Automation demand surge</td></tr>
            <tr><td>2026 (Projected)</td><td>$${Math.round(parseFloat(getMarketSize().replace('B', '')) * 1.55)}B</td><td>26.1%</td><td>Market consolidation</td></tr>
        </table>

        <h3>Market Segments</h3>
        <table class="market-table">
            <tr><th>Segment</th><th>Size (2024)</th><th>Share</th><th>Growth Rate</th></tr>
            <tr><td>Enterprise Solutions</td><td>$${Math.round(parseFloat(getMarketSize().replace('B', '')) * 0.45)}B</td><td>45%</td><td>28.5%</td></tr>
            <tr><td>SMB Solutions</td><td>$${Math.round(parseFloat(getMarketSize().replace('B', '')) * 0.35)}B</td><td>35%</td><td>31.2%</td></tr>
            <tr><td>Professional Services</td><td>$${Math.round(parseFloat(getMarketSize().replace('B', '')) * 0.20)}B</td><td>20%</td><td>18.7%</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Competitive Landscape</h2>
        
        <div class="competitor-analysis">
            <h3>Direct Competitors</h3>
            <h4>1. TechCorp Solutions</h4>
            <ul>
                <li><strong>Market Share:</strong> 18%</li>
                <li><strong>Revenue:</strong> ~$2.1B annually</li>
                <li><strong>Strengths:</strong> Established brand, enterprise relationships</li>
                <li><strong>Weaknesses:</strong> Legacy technology, slow innovation</li>
                <li><strong>Our Advantage:</strong> Modern AI architecture, faster implementation</li>
            </ul>
        </div>

        <div class="competitor-analysis">
            <h4>2. InnovateSys</h4>
            <ul>
                <li><strong>Market Share:</strong> 12%</li>
                <li><strong>Revenue:</strong> ~$1.4B annually</li>
                <li><strong>Strengths:</strong> Strong R&D, good user experience</li>
                <li><strong>Weaknesses:</strong> Limited integrations, high pricing</li>
                <li><strong>Our Advantage:</strong> Better pricing, extensive integrations</li>
            </ul>
        </div>

        <div class="competitor-analysis">
            <h4>3. AutoFlow Inc.</h4>
            <ul>
                <li><strong>Market Share:</strong> 8%</li>
                <li><strong>Revenue:</strong> ~$950M annually</li>
                <li><strong>Strengths:</strong> Vertical specialization, strong support</li>
                <li><strong>Weaknesses:</strong> Limited scalability, narrow focus</li>
                <li><strong>Our Advantage:</strong> Broader platform, better scalability</li>
            </ul>
        </div>

        <h3>Competitive Positioning</h3>
        <div class="highlight-box">
            <p><strong>${brandName} Unique Value Proposition:</strong></p>
            <ul>
                <li>Next-generation AI with 95% accuracy (vs. 75-85% industry average)</li>
                <li>50% faster implementation than competitors</li>
                <li>30% lower total cost of ownership</li>
                <li>Industry-agnostic platform with deep customization</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>Market Trends & Opportunities</h2>
        
        <div class="trend-item">
            <h3>🚀 Trend 1: AI-First Automation</h3>
            <p>Companies are moving beyond basic automation to AI-powered intelligent workflows. This creates a $${Math.round(parseFloat(getMarketSize().replace('B', '')) * 0.3)}B opportunity for advanced platforms like ${brandName}.</p>
        </div>

        <div class="trend-item">
            <h3>📊 Trend 2: Real-time Analytics Demand</h3>
            <p>Growing need for instant insights and predictive analytics. Market growing at 31% annually, representing significant expansion opportunity.</p>
        </div>

        <div class="trend-item">
            <h3>🔗 Trend 3: Integration-First Platforms</h3>
            <p>Businesses want solutions that integrate seamlessly with existing tools. Our integration-first approach addresses this $${Math.round(parseFloat(getMarketSize().replace('B', '')) * 0.25)}B market need.</p>
        </div>

        <div class="trend-item">
            <h3>💰 Trend 4: Cost Optimization Focus</h3>
            <p>Economic pressures driving demand for solutions that reduce operational costs. Our 60% cost reduction capability positions us well for this trend.</p>
        </div>
    </div>

    <div class="section">
        <h2>Target Customer Analysis</h2>
        <table class="market-table">
            <tr><th>Customer Segment</th><th>Size</th><th>Pain Points</th><th>Our Solution</th><th>Revenue Potential</th></tr>
            <tr>
                <td>Enterprise (1000+ employees)</td>
                <td>15,000 companies</td>
                <td>Complex processes, integration needs</td>
                <td>Full platform with custom features</td>
                <td>$50K-500K+ annually</td>
            </tr>
            <tr>
                <td>Mid-market (100-999 employees)</td>
                <td>85,000 companies</td>
                <td>Growing complexity, resource constraints</td>
                <td>Professional tier with support</td>
                <td>$10K-50K annually</td>
            </tr>
            <tr>
                <td>SMB (10-99 employees)</td>
                <td>500,000 companies</td>
                <td>Manual processes, limited IT resources</td>
                <td>Easy-to-use starter package</td>
                <td>$2K-10K annually</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <h2>Market Entry Strategy Recommendations</h2>
        <div class="highlight-box">
            <h3>Phase 1: Market Penetration (Months 1-12)</h3>
            <ul>
                <li>Focus on ${startupIdea.targetMarket} segment in key metropolitan areas</li>
                <li>Target early adopters with compelling ROI stories</li>
                <li>Build case studies and customer references</li>
                <li><strong>Goal:</strong> 100 customers, $2M ARR</li>
            </ul>
        </div>

        <div class="highlight-box">
            <h3>Phase 2: Market Expansion (Months 12-24)</h3>
            <ul>
                <li>Expand to adjacent customer segments</li>
                <li>Develop partner channel program</li>
                <li>International market entry (Canada, UK)</li>
                <li><strong>Goal:</strong> 500 customers, $10M ARR</li>
            </ul>
        </div>

        <div class="highlight-box">
            <h3>Phase 3: Market Leadership (Months 24-36)</h3>
            <ul>
                <li>Strategic acquisitions to expand capabilities</li>
                <li>Enterprise sales team scaling</li>
                <li>Global market presence</li>
                <li><strong>Goal:</strong> 1,500 customers, $25M ARR</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>Risk Analysis</h2>
        <table class="market-table">
            <tr><th>Risk Factor</th><th>Probability</th><th>Impact</th><th>Mitigation Strategy</th></tr>
            <tr><td>Economic Downturn</td><td>Medium</td><td>High</td><td>Focus on ROI messaging, flexible pricing</td></tr>
            <tr><td>New Competitor Entry</td><td>High</td><td>Medium</td><td>Strong IP protection, first-mover advantage</td></tr>
            <tr><td>Technology Disruption</td><td>Medium</td><td>High</td><td>Continuous R&D investment</td></tr>
            <tr><td>Regulatory Changes</td><td>Low</td><td>Medium</td><td>Compliance-first architecture</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Market Opportunity Summary</h2>
        <div class="highlight-box">
            <p>The ${startupIdea.industry} market represents a compelling $${getMarketSize()} opportunity with strong growth fundamentals. ${brandName} is well-positioned to capture significant market share through:</p>
            <ul>
                <li><strong>Technology Advantage:</strong> Next-generation AI capabilities</li>
                <li><strong>Market Timing:</strong> Perfect alignment with digital transformation trends</li>
                <li><strong>Customer Need:</strong> Strong demand for efficiency and cost reduction</li>
                <li><strong>Competitive Position:</strong> Differentiated offering with clear advantages</li>
            </ul>
            <p><strong>Recommendation:</strong> Proceed with aggressive market entry strategy targeting $10M ARR within 24 months.</p>
        </div>
    </div>
</body>
</html>`;
  };

  const generateLegalDocs = (): string => {
    const brandName = getBrandName();
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legal Document Templates - ${brandName}</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 20px; color: #333; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; border-radius: 15px; }
        .doc-template { background: #f8fafc; padding: 30px; border-radius: 15px; margin: 30px 0; border-left: 5px solid #2563eb; }
        .doc-template h2 { color: #1e40af; margin-bottom: 20px; }
        .legal-text { background: white; padding: 20px; border-radius: 10px; border: 1px solid #e5e7eb; font-family: 'Times New Roman', serif; }
        .warning-box { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .section-number { color: #2563eb; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Startup Legal Document Templates</h1>
        <p>Essential legal documents for ${brandName}</p>
        <div class="warning-box" style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white;">
            <strong>⚠️ Legal Disclaimer:</strong> These templates are for reference only. Always consult with a qualified attorney before using any legal documents.
        </div>
    </div>

    <div class="doc-template">
        <h2>1. Non-Disclosure Agreement (NDA)</h2>
        <p><strong>Use Case:</strong> Protecting confidential information when discussing your startup with potential investors, partners, or employees.</p>
        
        <div class="legal-text">
            <h3>MUTUAL NON-DISCLOSURE AGREEMENT</h3>
            <p>This Mutual Non-Disclosure Agreement ("Agreement") is entered into on [DATE] between ${brandName}, a [STATE] corporation ("Company"), and [PARTY NAME] ("Recipient").</p>
            
            <p><span class="section-number">1. Definition of Confidential Information.</span> For purposes of this Agreement, "Confidential Information" shall include all information or proprietary materials (whether oral, written, electronic or in any other form) disclosed by either party, including but not limited to:</p>
            <ul>
                <li>Business plans, strategies, and financial information</li>
                <li>Technical data, algorithms, and software code</li>
                <li>Customer lists and market research</li>
                <li>Any information marked as confidential</li>
            </ul>

            <p><span class="section-number">2. Obligation of Confidentiality.</span> Recipient agrees to:</p>
            <ul>
                <li>Hold all Confidential Information in strict confidence</li>
                <li>Not disclose Confidential Information to any third parties</li>
                <li>Use Confidential Information solely for evaluation purposes</li>
                <li>Protect Confidential Information with the same degree of care used for own confidential information</li>
            </ul>

            <p><span class="section-number">3. Term.</span> This Agreement shall remain in effect for a period of three (3) years from the date first written above.</p>

            <p><span class="section-number">4. Return of Materials.</span> Upon termination of this Agreement or upon written request, all materials containing Confidential Information shall be returned or destroyed.</p>

            <p style="margin-top: 40px;">
                <strong>Company:</strong> ${brandName}<br>
                By: _________________________<br>
                Name: [NAME]<br>
                Title: [TITLE]<br>
                Date: _______________________
            </p>

            <p>
                <strong>Recipient:</strong><br>
                By: _________________________<br>
                Name: [NAME]<br>
                Title: [TITLE]<br>
                Date: _______________________
            </p>
        </div>
    </div>

    <div class="doc-template">
        <h2>2. Co-Founder Agreement Template</h2>
        <p><strong>Use Case:</strong> Establishing clear terms between co-founders including equity split, roles, and responsibilities.</p>
        
        <div class="legal-text">
            <h3>CO-FOUNDER AGREEMENT</h3>
            <p>This Co-Founder Agreement ("Agreement") is entered into on [DATE] between the undersigned co-founders of ${brandName} ("Company").</p>
            
            <p><span class="section-number">1. Co-Founders.</span> The co-founders of the Company are:</p>
            <ul>
                <li>[FOUNDER 1 NAME] - [TITLE] - [EQUITY %]%</li>
                <li>[FOUNDER 2 NAME] - [TITLE] - [EQUITY %]%</li>
            </ul>

            <p><span class="section-number">2. Roles and Responsibilities.</span></p>
            <p><strong>[FOUNDER 1 NAME] (CEO):</strong></p>
            <ul>
                <li>Overall company strategy and vision</li>
                <li>Fundraising and investor relations</li>
                <li>Business development and partnerships</li>
                <li>Final decision-making authority</li>
            </ul>

            <p><strong>[FOUNDER 2 NAME] (CTO):</strong></p>
            <ul>
                <li>Technology strategy and development</li>
                <li>Product development and engineering</li>
                <li>Technical team building</li>
                <li>Architecture and infrastructure decisions</li>
            </ul>

            <p><span class="section-number">3. Equity and Vesting.</span></p>
            <ul>
                <li>Equity percentages as listed above</li>
                <li>4-year vesting schedule with 1-year cliff</li>
                <li>Accelerated vesting provisions in case of acquisition</li>
                <li>Equity subject to standard co-founder restrictions</li>
            </ul>

            <p><span class="section-number">4. Intellectual Property.</span> All intellectual property developed for the Company shall be assigned to the Company.</p>

            <p><span class="section-number">5. Commitment.</span> Co-founders agree to work full-time on Company business and not engage in competing activities.</p>

            <p><span class="section-number">6. Decision Making.</span> Major decisions require unanimous consent. Day-to-day operations managed by respective roles.</p>
        </div>
    </div>

    <div class="doc-template">
        <h2>3. Employee Offer Letter Template</h2>
        <p><strong>Use Case:</strong> Hiring your first employees with clear terms and conditions.</p>
        
        <div class="legal-text">
            <h3>EMPLOYMENT OFFER LETTER</h3>
            <p>Dear [EMPLOYEE NAME],</p>
            
            <p>We are pleased to offer you employment with ${brandName} ("Company") in the position of [JOB TITLE], reporting to [MANAGER NAME].</p>

            <p><span class="section-number">Position and Duties:</span> Your initial title will be [JOB TITLE]. You will be expected to perform the duties and responsibilities of this position as may be established and modified by the Company from time to time.</p>

            <p><span class="section-number">Compensation:</span></p>
            <ul>
                <li>Base Salary: $[AMOUNT] per year, paid bi-weekly</li>
                <li>Equity: [NUMBER] stock options at $[PRICE] per share</li>
                <li>Benefits: Health insurance, dental, vision (after 90 days)</li>
                <li>Vacation: [NUMBER] days annually</li>
            </ul>

            <p><span class="section-number">Equity Details:</span> Your stock options will vest over four (4) years, with 25% vesting after one year of continuous employment and the remainder vesting monthly thereafter.</p>

            <p><span class="section-number">At-Will Employment:</span> Your employment is at-will, meaning either you or the Company may terminate the employment relationship at any time, with or without cause.</p>

            <p><span class="section-number">Confidentiality and Non-Compete:</span> You will be required to sign the Company's standard Confidentiality and Assignment Agreement.</p>

            <p><span class="section-number">Start Date:</span> Your employment will begin on [START DATE].</p>

            <p>Please sign and return this letter by [DATE] to indicate your acceptance of this offer.</p>

            <p>Sincerely,<br><br>
            [YOUR NAME]<br>
            [YOUR TITLE]<br>
            ${brandName}
            </p>

            <p style="margin-top: 40px;">
            I accept the above offer:<br><br>
            Signature: _________________________<br>
            Date: _____________________________
            </p>
        </div>
    </div>

    <div class="doc-template">
        <h2>4. Terms of Service Template</h2>
        <p><strong>Use Case:</strong> Governing the use of your software platform or service.</p>
        
        <div class="legal-text">
            <h3>TERMS OF SERVICE</h3>
            <p>Last updated: [DATE]</p>
            
            <p><span class="section-number">1. Acceptance of Terms.</span> By accessing or using ${brandName}'s services, you agree to be bound by these Terms of Service.</p>

            <p><span class="section-number">2. Description of Service.</span> ${brandName} provides AI-powered ${startupIdea.industry} automation and analytics services through our platform.</p>

            <p><span class="section-number">3. User Accounts.</span></p>
            <ul>
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must be at least 18 years old to use our services</li>
            </ul>

            <p><span class="section-number">4. Acceptable Use.</span> You agree not to:</p>
            <ul>
                <li>Use the service for illegal purposes</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Upload malicious code or content</li>
            </ul>

            <p><span class="section-number">5. Intellectual Property.</span> The service and its content are protected by copyright, trademark, and other laws.</p>

            <p><span class="section-number">6. Privacy.</span> Your privacy is important to us. Please review our Privacy Policy for information on how we collect and use your data.</p>

            <p><span class="section-number">7. Payment Terms.</span></p>
            <ul>
                <li>Fees are charged in advance on a monthly or annual basis</li>
                <li>All fees are non-refundable except as required by law</li>
                <li>Prices may change with 30 days notice</li>
            </ul>

            <p><span class="section-number">8. Termination.</span> Either party may terminate service with 30 days written notice.</p>

            <p><span class="section-number">9. Limitation of Liability.</span> Our total liability is limited to the amount paid by you in the 12 months preceding the claim.</p>

            <p><span class="section-number">10. Governing Law.</span> These terms are governed by the laws of [STATE/JURISDICTION].</p>
        </div>
    </div>

    <div class="doc-template">
        <h2>5. Privacy Policy Template</h2>
        <p><strong>Use Case:</strong> Required for any service that collects user data.</p>
        
        <div class="legal-text">
            <h3>PRIVACY POLICY</h3>
            <p>Last updated: [DATE]</p>
            
            <p><span class="section-number">1. Information We Collect.</span></p>
            <ul>
                <li><strong>Personal Information:</strong> Name, email, company information</li>
                <li><strong>Usage Data:</strong> How you interact with our service</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
            </ul>

            <p><span class="section-number">2. How We Use Your Information.</span></p>
            <ul>
                <li>To provide and improve our services</li>
                <li>To communicate with you about your account</li>
                <li>To analyze service usage and performance</li>
                <li>To comply with legal obligations</li>
            </ul>

            <p><span class="section-number">3. Information Sharing.</span> We do not sell your personal information. We may share information:</p>
            <ul>
                <li>With service providers who help us operate our business</li>
                <li>When required by law</li>
                <li>In connection with a business transaction</li>
            </ul>

            <p><span class="section-number">4. Data Security.</span> We use industry-standard security measures to protect your information.</p>

            <p><span class="section-number">5. Your Rights.</span> You have the right to:</p>
            <ul>
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and data</li>
                <li>Port your data to another service</li>
            </ul>

            <p><span class="section-number">6. Contact Us.</span> If you have questions about this Privacy Policy, contact us at privacy@${brandName.toLowerCase()}.com</p>
        </div>
    </div>

    <div class="warning-box">
        <h3>⚖️ Important Legal Notes:</h3>
        <ul>
            <li>These templates are for educational purposes only</li>
            <li>Laws vary by jurisdiction - consult local attorneys</li>
            <li>Customize templates for your specific situation</li>
            <li>Review and update documents regularly</li>
            <li>Consider professional legal review for all documents</li>
        </ul>
        <p><strong>Recommended Legal Resources:</strong></p>
        <ul>
            <li>Local bar association referral services</li>
            <li>Startup-focused law firms</li>
            <li>Online legal services (LegalZoom, Clerky)</li>
            <li>Accelerator program legal partners</li>
        </ul>
    </div>
</body>
</html>`;
  };

  const generateBasicDocument = (itemId: string): string => {
    return `<html><body><h1>Document: ${itemId}</h1><p>Generated content for ${getBrandName()}</p></body></html>`;
  };

  const getMarketSize = (): string => {
    const sizes = {
      'HealthTech': '374B',
      'EdTech': '89B', 
      'FinTech': '179B',
      'AgriTech': '47B',
      'RetailTech': '56B',
      'FoodTech': '43B'
    };
    return sizes[startupIdea.industry as keyof typeof sizes] || '25B';
  };

  const getReducedMarketSize = (): string => {
    const baseSize = parseFloat(getMarketSize().replace('B', ''));
    return Math.round(baseSize * 0.4) + 'B';
  };

  const getSmallMarketSize = (): string => {
    const baseSize = parseFloat(getMarketSize().replace('B', ''));
    return Math.round(baseSize * 0.1) + 'B';
  };

  const getStarterPrice = (): string => {
    return startupIdea.targetMarket?.includes('Enterprise') ? '299' : '49';
  };

  const getProfessionalPrice = (): string => {
    return startupIdea.targetMarket?.includes('Enterprise') ? '999' : '199';
  };

  const getFundingAmount = (): string => {
    return startupIdea.targetMarket?.includes('Enterprise') ? '5M' : '2.5M';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-0 bg-white shadow-lg overflow-hidden">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Package className="h-8 w-8 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                Export Center
              </Badge>
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
              Export Your Complete Startup Package
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 max-w-3xl mx-auto">
              Download professional business documents, presentations, and resources ready for investors, partners, and team members.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Export Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white p-2 rounded-xl shadow-sm border max-w-md mx-auto">
            <TabsTrigger value="documents" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-lg px-4 py-2">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="pitch-deck" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 rounded-lg px-4 py-2">
              <Presentation className="h-4 w-4 mr-2" />
              Pitch Deck
            </TabsTrigger>
          </TabsList>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-8 mt-8">
            {/* Bulk Download */}
            <Card className="border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-4">🎉 Download Complete Package</h3>
                  <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                    Get all your startup documents at once! Perfect for sharing with investors, co-founders, and advisors.
                  </p>
                  
                  {isGeneratingAll ? (
                    <div className="space-y-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full mx-auto"
                      />
                      <p className="text-lg">Generating all documents...</p>
                      <Progress value={generationProgress} className="max-w-md mx-auto h-3 bg-white/20" />
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={generateAllDocuments}
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl px-12 py-6 text-xl font-semibold transition-all duration-300"
                      >
                        <ArrowDownToLine className="h-6 w-6 mr-3" />
                        Download All Documents
                        <Badge className="ml-3 bg-blue-100 text-blue-800">
                          {exportItems.filter(item => !item.premium).length} Files
                        </Badge>
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Individual Documents */}
            <Card className="border-0 bg-white shadow-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  <span>Individual Documents</span>
                </CardTitle>
                <CardDescription className="text-lg">
                  Download specific documents as needed. All files are professionally formatted and ready to use.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {exportItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className={`border transition-all duration-300 hover:shadow-lg relative overflow-hidden ${
                        item.premium ? 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        {item.premium && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          </div>
                        )}
                        
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                              <div className={`p-3 rounded-xl shadow-sm ${
                                item.premium ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-blue-100 text-blue-600'
                              }`}>
                                {item.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">{item.name}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-3">{item.description}</p>
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                  <span>Size: {item.size}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {item.type.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-2">
                              {item.generating ? (
                                <div className="space-y-3">
                                  <div className="flex items-center space-x-2">
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                      <Clock className="h-4 w-4 text-blue-600" />
                                    </motion.div>
                                    <span className="text-sm text-blue-600">Generating...</span>
                                  </div>
                                  <Progress value={75} className="h-2" />
                                </div>
                              ) : item.premium ? (
                                <Button
                                  disabled
                                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white opacity-60 cursor-not-allowed"
                                >
                                  <Crown className="h-4 w-4 mr-2" />
                                  Premium Feature
                                </Button>
                              ) : (
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Button
                                    onClick={() => generateDocument(item.id)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download {item.type.toUpperCase()}
                                  </Button>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Premium Upgrade CTA */}
            <Card className="border-0 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white shadow-xl overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="relative z-10">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Crown className="h-8 w-8" />
                    <h3 className="text-3xl font-bold">Unlock Premium Documents</h3>
                  </div>
                  <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                    Get access to investor database, legal templates, and advanced market reports. Everything you need to scale your startup.
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-gray-100 shadow-xl px-8 py-4 text-lg font-semibold"
                  >
                    <Zap className="h-5 w-5 mr-2" />
                    Upgrade to Premium
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pitch Deck Tab */}
          <TabsContent value="pitch-deck" className="mt-8">
            <PitchDeckGenerator startupIdea={startupIdea} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}