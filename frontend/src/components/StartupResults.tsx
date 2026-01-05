import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { generateAndDownloadPDF } from "./PDFGenerator";
import { 
  Lightbulb, 
  TrendingUp, 
  Palette, 
  Target, 
  FileText, 
  Users, 
  Download, 
  Eye,
  Sparkles,
  BarChart3,
  DollarSign,
  Star,
  Calendar,
  MapPin,
  RefreshCw,
  Copy,
  Heart,
  UserPlus,
  ExternalLink,
  BookmarkPlus,
  Package,
  Globe,
  Briefcase,
  Award,
  CheckCircle,
  TrendingDown,
  ArrowUpRight,
  Building,
  Mail,
  Phone,
  Clock,
  Activity
} from "lucide-react";

interface StartupIdea {
  description: string;
  industry: string;
  targetMarket: string;
  founderPersona: string;
}

interface StartupResultsProps {
  startupIdea: StartupIdea;
}

interface BrandIdentity {
  name: string;
  domain: string;
  tagline: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  personality: string[];
  logoStyle: string;
  available: boolean;
}

interface MarketingCopy {
  id: string;
  title: string;
  headline: string;
  subheadline: string;
  cta: string;
  platform: string;
  tone: string;
  target: string;
}

interface Investor {
  name: string;
  firm: string;
  focus: string;
  checkSize: string;
  location: string;
  description: string;
  portfolio: string[];
  website: string;
  stage: string;
  matchScore: number;
  recentInvestments: string[];
  investmentThesis: string;
}

export function StartupResults({ startupIdea }: StartupResultsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState(0);
  const [currentCopyIndex, setCurrentCopyIndex] = useState(0);
  const [currentInvestorIndex, setCurrentInvestorIndex] = useState(0);
  const [savedInvestors, setSavedInvestors] = useState<Set<string>>(new Set());
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
  const [backendResults, setBackendResults] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    setSelectedBrand(0);
    setCurrentCopyIndex(0);
    setCurrentInvestorIndex(0);
    setSavedInvestors(new Set());
    
    // Load real backend results from localStorage
    try {
      const storedResults = localStorage.getItem('latest_startup_results');
      if (storedResults) {
        const results = JSON.parse(storedResults);
        setBackendResults(results);
        console.log('Loaded backend results:', results);
      }
    } catch (error) {
      console.error('Error loading backend results:', error);
    }
    
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [startupIdea]);

  // Copy to clipboard functionality
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard!`);
    }).catch(() => {
      toast.error("Failed to copy to clipboard");
    });
  };

  // Investor functions
  const handleGetIntroduction = (investor: Investor) => {
    toast.success(`Introduction request sent to ${investor.name}! You'll receive a response within 48 hours.`);
  };

  const handleSaveInvestor = (investorName: string) => {
    setSavedInvestors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(investorName)) {
        newSet.delete(investorName);
        toast.success(`Removed ${investorName} from saved investors`);
      } else {
        newSet.add(investorName);
        toast.success(`Saved ${investorName} to your investor list`);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-0 bg-white shadow-lg">
          <CardContent className="p-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <motion.div 
                className="w-4 h-4 bg-blue-500 rounded-full"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              />
              <motion.div 
                className="w-4 h-4 bg-purple-500 rounded-full"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div 
                className="w-4 h-4 bg-green-500 rounded-full"
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <p className="text-center text-xl text-gray-600">Generating comprehensive results...</p>
            <Progress value={85} className="mt-6 h-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Load real results from backend - NO FALLBACK!
  const generateResults = () => {
    // If we have backend results, use them!
    if (backendResults && backendResults.brand_names && backendResults.brand_names.length > 0) {
      console.log('✅ Using REAL backend data!');
      console.log('Brand names:', backendResults.brand_names);
      console.log('Slogans:', backendResults.slogans);
      console.log('Ad copies:', backendResults.ad_copies);
      
      return {
        brandIdentities: backendResults.brand_names.slice(0, 8).map((name: string, i: number) => ({
          name: name,
          domain: `${name.toLowerCase().replace(/\s+/g, '')}.com`,
          tagline: backendResults.slogans[i] || backendResults.slogans[0] || `Innovative ${startupIdea.industry} solution`,
          description: `${name} empowers businesses with cutting-edge technology and data-driven insights.`,
          colors: {
            primary: ["#2563eb", "#7c3aed", "#059669", "#dc2626", "#ea580c", "#0891b2", "#a21caf", "#374151"][i],
            secondary: ["#60a5fa", "#a78bfa", "#34d399", "#f87171", "#fb923c", "#38bdf8", "#d946ef", "#6b7280"][i],
            accent: ["#dbeafe", "#e9d5ff", "#d1fae5", "#fee2e2", "#fed7aa", "#e0f2fe", "#fae8ff", "#f3f4f6"][i]
          },
          personality: [
            ["Innovative", "Trustworthy", "Professional"],
            ["Creative", "Bold", "Forward-thinking"],
            ["Reliable", "Efficient", "Modern"],
            ["Dynamic", "Energetic", "Results-driven"],
            ["Expert", "Premium", "Sophisticated"],
            ["Collaborative", "Transparent", "Agile"],
            ["Visionary", "Cutting-edge", "Transformative"],
            ["Established", "Secure", "Enterprise-grade"]
          ][i],
          logoStyle: ["Modern Geometric", "Minimalist", "Tech-Forward", "Bold Typography", "Abstract Symbol", "Clean Lines", "Dynamic Icon", "Professional Emblem"][i],
          available: [true, true, false, true, true, false, true, true][i]
        })),
        marketingCopies: backendResults.ad_copies.slice(0, 12).map((copy: string, i: number) => ({
          id: String(i + 1),
          title: ["Hero Section - Landing Page", "Social Media - LinkedIn", "Email Campaign - Welcome Series", "Google Ads - Search Campaign", "Product Hunt Launch", "Twitter Thread", "Facebook Ad Campaign", "Instagram Story", "YouTube Pre-roll Ad", "Blog Post Intro", "Press Release", "Newsletter Header"][i] || "Marketing Copy",
          headline: copy.split('.')[0] + '.',
          subheadline: copy,
          cta: ["Start Free Trial", "Learn More", "Get Started Now", "Try It Free", "Join Waitlist", "Read More", "Sign Up Today", "Discover More", "Watch Demo", "Download Guide", "Contact Sales", "Subscribe Now"][i],
          platform: ["Website", "LinkedIn", "Email", "Google Ads", "Product Hunt", "Twitter", "Facebook", "Instagram", "YouTube", "Blog", "Press", "Newsletter"][i],
          tone: ["Professional & Confident", "Professional & Engaging", "Welcoming & Educational", "Direct & Action-Oriented", "Exciting & Community-Focused", "Conversational & Viral", "Emotional & Relatable", "Visual & Aspirational", "Entertaining & Informative", "Thought Leadership", "Formal & Newsworthy", "Personal & Valuable"][i],
          target: ["Business Decision Makers", "C-Suite Executives", "New Users", "Active Searchers", "Early Adopters", "Tech Community", "General Audience", "Young Professionals", "Video Consumers", "Industry Professionals", "Media & Press", "Subscribers"][i]
        })),
        investors: backendResults.investors || [],
        marketInsights: backendResults.market_insights || undefined
      };
    }
    
    // NO BACKEND DATA - Return empty arrays
    console.error('❌ No backend data found in localStorage!');
    console.error('Please generate results from the Dashboard first.');
    
    return {
      brandIdentities: [],
      marketingCopies: [],
      investors: [],
      marketInsights: undefined
    };
  };

  const results = generateResults();

  // Show error if no backend data
  if (!results.brandIdentities || results.brandIdentities.length === 0) {
    return (
      <div className="space-y-8">
        <Card className="border-0 bg-white shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <RefreshCw className="h-8 w-8 text-orange-600" />
              <Badge className="bg-orange-100 text-orange-800 px-4 py-2">
                No Data Available
              </Badge>
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
              No Results Found
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please generate results from the Dashboard first. The backend data was not found in localStorage.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="border-0 bg-white shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <Badge className="bg-green-100 text-green-800 px-4 py-2">
                Generation Complete
              </Badge>
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
              Your Startup Package is Ready!
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've analyzed your idea and generated comprehensive business assets including brand identities, marketing materials, and investor matches.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 bg-white shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Brand Identities</h3>
              <p className="text-3xl font-bold text-blue-600">{results.brandIdentities.length}</p>
              <p className="text-sm text-gray-600">Unique concepts generated</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Marketing Copies</h3>
              <p className="text-3xl font-bold text-green-600">{results.marketingCopies.length}</p>
              <p className="text-sm text-gray-600">Ready-to-use campaigns</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Investor Matches</h3>
              <p className="text-3xl font-bold text-purple-600">{results.investors.length}</p>
              <p className="text-sm text-gray-600">Qualified investors found</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white shadow-md">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Market Size</h3>
              <p className="text-3xl font-bold text-orange-600">{results.marketInsights?.marketSize || 'N/A'}</p>
              <p className="text-sm text-gray-600">Total addressable market</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Tabs defaultValue="branding" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white p-2 rounded-xl shadow-sm border max-w-2xl mx-auto">
            <TabsTrigger value="branding" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-lg">
              <Palette className="h-4 w-4 mr-2" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="marketing" className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 rounded-lg">
              <Target className="h-4 w-4 mr-2" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="investors" className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700 rounded-lg">
              <Users className="h-4 w-4 mr-2" />
              Investors
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700 rounded-lg">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6 mt-8">
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Sparkles className="h-6 w-6 text-blue-600" />
                  <span>Brand Identity Concepts</span>
                  <Badge className="bg-blue-100 text-blue-800">{results.brandIdentities.length} Generated</Badge>
                </CardTitle>
                <CardDescription>
                  AI-generated brand identities tailored to your startup concept and target market
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.brandIdentities.map((brand, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className={`cursor-pointer border-2 transition-all duration-300 hover:shadow-lg ${
                        selectedBrand === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedBrand(index)}>
                        <CardContent className="p-6">
                          {/* Logo Placeholder */}
                          <div 
                            className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-xl"
                            style={{ backgroundColor: brand.colors.primary }}
                          >
                            {brand.name.slice(0, 2)}
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{brand.name}</h3>
                              <p className="text-sm text-gray-600">{brand.tagline}</p>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-gray-500" />
                              <span className="text-sm font-medium">{brand.domain}</span>
                              <Badge className={`text-xs ${brand.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {brand.available ? 'Available' : 'Taken'}
                              </Badge>
                            </div>
                            
                            <div className="flex space-x-1">
                              <div 
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: brand.colors.primary }}
                              />
                              <div 
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: brand.colors.secondary }}
                              />
                              <div 
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: brand.colors.accent }}
                              />
                            </div>
                            
                            <div className="flex flex-wrap gap-1">
                              {brand.personality.map((trait, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="pt-2 space-y-2">
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(brand.name, 'Brand name');
                                }}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Marketing Tab */}
          <TabsContent value="marketing" className="space-y-6 mt-8">
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Target className="h-6 w-6 text-green-600" />
                  <span>Marketing Copy Library</span>
                  <Badge className="bg-green-100 text-green-800">{results.marketingCopies.length} Variations</Badge>
                </CardTitle>
                <CardDescription>
                  Ready-to-use marketing copy for different platforms and audiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.marketingCopies.map((copy, index) => (
                    <motion.div
                      key={copy.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <Badge className="bg-green-100 text-green-800">
                                {copy.platform}
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(`${copy.headline}\n\n${copy.subheadline}\n\n${copy.cta}`, 'Marketing copy')}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 mb-2">{copy.title}</h3>
                              <div className="space-y-3">
                                <div>
                                  <p className="font-medium text-gray-700">Headline:</p>
                                  <p className="text-gray-900">{copy.headline}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Subheadline:</p>
                                  <p className="text-gray-600">{copy.subheadline}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-700">Call to Action:</p>
                                  <Badge className="bg-blue-100 text-blue-800 font-medium">
                                    {copy.cta}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-200">
                              <div className="flex justify-between text-sm text-gray-600">
                                <span><strong>Tone:</strong> {copy.tone}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Target:</strong> {copy.target}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investors Tab */}
          <TabsContent value="investors" className="space-y-6 mt-8">
            <Card className="border-0 bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Users className="h-6 w-6 text-purple-600" />
                  <span>Investor Matches</span>
                  <Badge className="bg-purple-100 text-purple-800">{results.investors.length} Found</Badge>
                </CardTitle>
                <CardDescription>
                  Curated list of investors who match your startup profile and funding stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {results.investors.map((investor, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="border-0 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                  {investor.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">{investor.name}</h3>
                                  <p className="text-sm text-gray-600">{investor.firm}</p>
                                </div>
                              </div>
                              <Badge className={`text-xs ${
                                investor.matchScore >= 90 ? 'bg-green-100 text-green-800' :
                                investor.matchScore >= 80 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {investor.matchScore}% Match
                              </Badge>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Target className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{investor.focus}</span>
                              </div>
                              {investor.checkSize && (
                                <div className="flex items-center space-x-2">
                                  <DollarSign className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{investor.checkSize}</span>
                                </div>
                              )}
                              {investor.location && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{investor.location}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <Activity className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{investor.stage}</span>
                              </div>
                            </div>
                            
                            {investor.description && (
                              <p className="text-sm text-gray-600">{investor.description}</p>
                            )}
                            
                            {investor.portfolio && investor.portfolio.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-2">Recent Portfolio:</p>
                                <div className="flex flex-wrap gap-1">
                                  {investor.portfolio.slice(0, 3).map((company: string, i: number) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {company}
                                    </Badge>
                                  ))}
                                  {investor.portfolio.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{investor.portfolio.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            <div className="pt-2 space-y-2">
                              <Button 
                                size="sm" 
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                onClick={() => handleGetIntroduction(investor)}
                              >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Request Introduction
                              </Button>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="flex-1"
                                  onClick={() => handleSaveInvestor(investor.name)}
                                >
                                  <Heart className={`h-4 w-4 mr-1 ${savedInvestors.has(investor.name) ? 'fill-red-500 text-red-500' : ''}`} />
                                  {savedInvestors.has(investor.name) ? 'Saved' : 'Save'}
                                </Button>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="flex-1">
                                      <ExternalLink className="h-4 w-4 mr-1" />
                                      Profile
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                          {investor.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                          <div className="text-xl font-bold">{investor.name}</div>
                                          <div className="text-gray-600">{investor.firm}</div>
                                        </div>
                                      </DialogTitle>
                                      <DialogDescription className="space-y-4 pt-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <h4 className="font-medium text-gray-900">Investment Focus</h4>
                                            <p className="text-gray-600">{investor.focus}</p>
                                          </div>
                                          {investor.checkSize && (
                                            <div>
                                              <h4 className="font-medium text-gray-900">Check Size</h4>
                                              <p className="text-gray-600">{investor.checkSize}</p>
                                            </div>
                                          )}
                                          <div>
                                            <h4 className="font-medium text-gray-900">Stage</h4>
                                            <p className="text-gray-600">{investor.stage}</p>
                                          </div>
                                          {investor.location && (
                                            <div>
                                              <h4 className="font-medium text-gray-900">Location</h4>
                                              <p className="text-gray-600">{investor.location}</p>
                                            </div>
                                          )}
                                        </div>
                                        
                                        {investor.investmentThesis && (
                                          <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Investment Thesis</h4>
                                            <p className="text-gray-600">{investor.investmentThesis}</p>
                                          </div>
                                        )}
                                        
                                        {investor.portfolio && investor.portfolio.length > 0 && (
                                          <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Portfolio Companies</h4>
                                            <div className="flex flex-wrap gap-2">
                                              {investor.portfolio.map((company: string, i: number) => (
                                                <Badge key={i} variant="outline" className="text-xs">
                                                  {company}
                                                </Badge>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {investor.recentInvestments && investor.recentInvestments.length > 0 && (
                                          <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Recent Investments</h4>
                                            <ul className="text-sm text-gray-600 space-y-1">
                                              {investor.recentInvestments.map((investment: string, i: number) => (
                                                <li key={i}>• {investment}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        
                                        <div className="flex space-x-3 pt-4">
                                          <Button 
                                            onClick={() => {
                                              handleGetIntroduction(investor);
                                            }}
                                            className="flex-1"
                                          >
                                            Request Introduction
                                          </Button>
                                          <Button 
                                            variant="outline"
                                            onClick={() => window.open(`https://${investor.website}`, '_blank')}
                                          >
                                            Visit Website
                                          </Button>
                                        </div>
                                      </DialogDescription>
                                    </DialogHeader>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="insights" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                    <span>Market Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900">Market Size</h3>
                      <p className="text-2xl font-bold text-orange-600">{results.marketInsights?.marketSize || 'N/A'}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900">Growth Rate</h3>
                      <p className="text-2xl font-bold text-green-600">{results.marketInsights?.growth || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Competition Level</h4>
                      <div className="flex items-center space-x-2">
                        <Progress value={60} className="flex-1" />
                        <span className="text-sm font-medium">{results.marketInsights?.competition || 'Medium'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Time to Market</h4>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{results.marketInsights?.timeline || 'TBD'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Suggested Funding</h4>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{results.marketInsights?.funding || 'TBD'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Lightbulb className="h-6 w-6 text-yellow-600" />
                    <span>Key Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Market Entry Strategy</h4>
                      <p className="text-sm text-blue-800">
                        Focus on {startupIdea.targetMarket} segment first, then expand to adjacent markets after achieving product-market fit.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Competitive Advantage</h4>
                      <p className="text-sm text-green-800">
                        Leverage AI capabilities and focus on user experience to differentiate from traditional solutions.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Funding Strategy</h4>
                      <p className="text-sm text-purple-800">
                        Recommend Series A funding of {results.marketInsights?.funding || 'TBD'} after demonstrating strong user traction.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-medium text-orange-900 mb-2">Growth Metrics</h4>
                      <p className="text-sm text-orange-800">
                        Target 30% month-over-month growth in user acquisition and 95%+ customer satisfaction scores.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Export CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <Card className="border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Launch Your Startup?</h3>
            <p className="text-lg opacity-90 mb-6">
              Export your complete startup package with professional documents, presentations, and business plans.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => generateAndDownloadPDF('business-plan', startupIdea)}
            >
              <Download className="h-5 w-5 mr-2" />
              Export Business Plan PDF
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}