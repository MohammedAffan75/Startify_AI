import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner@2.0.3";
import { 
  Presentation, 
  Download, 
  Eye, 
  Copy, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target, 
  Lightbulb,
  BarChart3,
  Zap,
  CheckCircle,
  PlayCircle,
  ArrowRight,
  Star,
  Award,
  Rocket,
  Building,
  Globe,
  Calendar,
  Sparkles
} from "lucide-react";

interface StartupIdea {
  description: string;
  industry: string;
  targetMarket: string;
  founderPersona: string;
}

interface PitchDeckGeneratorProps {
  startupIdea: StartupIdea;
}

interface PitchSlide {
  id: number;
  title: string;
  subtitle: string;
  content: string;
  type: string;
  icon: React.ReactNode;
  data?: any;
}

export function PitchDeckGenerator({ startupIdea }: PitchDeckGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);

  const generatePitchDeck = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate realistic generation process
    const steps = [
      "Analyzing your business concept...",
      "Researching market data...", 
      "Creating problem statement...",
      "Developing solution framework...",
      "Building market analysis...",
      "Calculating financial projections...",
      "Identifying competitive advantages...",
      "Crafting business model...",
      "Designing go-to-market strategy...",
      "Finalizing investor presentation..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress((i + 1) * 10);
      toast.loading(steps[i], { id: 'pitch-generation' });
    }

    setIsGenerating(false);
    setIsGenerated(true);
    toast.success("🎉 Professional pitch deck generated!", { id: 'pitch-generation' });
  };

  const downloadPitchDeck = () => {
    // Create actual downloadable content
    const content = generatePitchDeckHTML();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${startupIdea.industry || 'Startup'}_Pitch_Deck.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Pitch deck downloaded successfully!");
  };

  const generatePitchDeckHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${startupIdea.industry || 'Startup'} Pitch Deck</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .slide { width: 100vw; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px; box-sizing: border-box; color: white; text-align: center; }
        .slide h1 { font-size: 4rem; margin-bottom: 1rem; font-weight: 700; }
        .slide h2 { font-size: 3rem; margin-bottom: 2rem; font-weight: 600; }
        .slide p { font-size: 1.5rem; line-height: 1.8; max-width: 800px; margin-bottom: 2rem; }
        .slide ul { font-size: 1.3rem; line-height: 2; text-align: left; }
        .metric { background: rgba(255,255,255,0.2); padding: 20px; border-radius: 15px; margin: 10px; }
        .chart { width: 400px; height: 300px; background: rgba(255,255,255,0.1); border-radius: 15px; margin: 20px; }
    </style>
</head>
<body>
    <div class="slide">
        <h1>${generateBrandName()}</h1>
        <p>${generateTagline()}</p>
        <p>Transforming ${startupIdea.industry} with AI-powered innovation</p>
    </div>
    
    <div class="slide">
        <h2>The Problem</h2>
        <p>${generateProblemStatement()}</p>
        <ul>
            <li>Current solutions are outdated and inefficient</li>
            <li>Market lacks intelligent automation</li>
            <li>Users struggle with complex workflows</li>
        </ul>
    </div>
    
    <div class="slide">
        <h2>Our Solution</h2>
        <p>${generateSolutionStatement()}</p>
        <div class="metric">
            <h3>300% Faster</h3>
            <p>Processing Speed</p>
        </div>
        <div class="metric">
            <h3>95% Accuracy</h3>
            <p>AI Predictions</p>
        </div>
    </div>
    
    <div class="slide">
        <h2>Market Opportunity</h2>
        <div class="metric">
            <h3>$${getMarketSize()}</h3>
            <p>Total Addressable Market</p>
        </div>
        <div class="metric">
            <h3>23.5% CAGR</h3>
            <p>Annual Growth Rate</p>
        </div>
        <div class="metric">
            <h3>500M+</h3>
            <p>Potential Users</p>
        </div>
    </div>
    
    <div class="slide">
        <h2>Business Model</h2>
        <p>Subscription-based SaaS with multiple revenue streams</p>
        <div class="metric">
            <h3>$${getStarterPrice()}/month</h3>
            <p>Starter Plan</p>
        </div>
        <div class="metric">
            <h3>$${getProfessionalPrice()}/month</h3>
            <p>Professional Plan</p>
        </div>
        <div class="metric">
            <h3>Enterprise</h3>
            <p>Custom Pricing</p>
        </div>
    </div>
    
    <div class="slide">
        <h2>Competitive Advantage</h2>
        <ul>
            <li>Advanced AI algorithms with 95% accuracy</li>
            <li>Seamless integration with existing workflows</li>
            <li>Real-time analytics and insights</li>
            <li>Enterprise-grade security and compliance</li>
            <li>Scalable architecture for global deployment</li>
        </ul>
    </div>
    
    <div class="slide">
        <h2>Go-to-Market Strategy</h2>
        <div class="metric">
            <h3>Phase 1</h3>
            <p>Target ${startupIdea.targetMarket} segment</p>
        </div>
        <div class="metric">
            <h3>Phase 2</h3>
            <p>Expand to adjacent markets</p>
        </div>
        <div class="metric">
            <h3>Phase 3</h3>
            <p>International expansion</p>
        </div>
    </div>
    
    <div class="slide">
        <h2>Financial Projections</h2>
        <div class="metric">
            <h3>Year 1: $500K</h3>
            <p>Revenue Target</p>
        </div>
        <div class="metric">
            <h3>Year 2: $2.5M</h3>
            <p>Revenue Target</p>
        </div>
        <div class="metric">
            <h3>Year 3: $10M</h3>
            <p>Revenue Target</p>
        </div>
    </div>
    
    <div class="slide">
        <h2>Funding Requirements</h2>
        <p>Seeking $${getFundingAmount()} Series A funding</p>
        <ul>
            <li>40% - Product development and AI enhancement</li>
            <li>35% - Marketing and customer acquisition</li>
            <li>15% - Team expansion and talent acquisition</li>
            <li>10% - Operations and infrastructure</li>
        </ul>
    </div>
    
    <div class="slide">
        <h1>Thank You</h1>
        <p>Ready to revolutionize ${startupIdea.industry} together?</p>
        <p>Let's build the future of intelligent business solutions</p>
    </div>
</body>
</html>`;
  };

  const generateBrandName = () => {
    const description = startupIdea.description.toLowerCase();
    if (description.includes('rural') || description.includes('farm')) return "AgriFlow";
    if (description.includes('health') || description.includes('medical')) return "MediCore";
    if (description.includes('education') || description.includes('learning')) return "EduSpark";
    if (description.includes('finance') || description.includes('payment')) return "FinFlow";
    return "InnovateTech";
  };

  const generateTagline = () => {
    return `The future of ${startupIdea.industry} is here`;
  };

  const generateProblemStatement = () => {
    return `Current ${startupIdea.industry} solutions fail to meet the evolving needs of ${startupIdea.targetMarket} customers, creating inefficiencies and missed opportunities worth billions in the market.`;
  };

  const generateSolutionStatement = () => {
    return `Our AI-powered platform revolutionizes ${startupIdea.industry} by providing intelligent automation, real-time insights, and seamless user experiences that drive measurable business results.`;
  };

  const getMarketSize = () => {
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

  const getStarterPrice = () => {
    return startupIdea.targetMarket?.includes('Enterprise') ? '299' : '49';
  };

  const getProfessionalPrice = () => {
    return startupIdea.targetMarket?.includes('Enterprise') ? '999' : '199';
  };

  const getFundingAmount = () => {
    return startupIdea.targetMarket?.includes('Enterprise') ? '5M' : '2.5M';
  };

  // Generate pitch slides data
  const pitchSlides: PitchSlide[] = [
    {
      id: 1,
      title: "Company Introduction",
      subtitle: generateBrandName(),
      content: generateTagline(),
      type: "title",
      icon: <Rocket className="h-6 w-6" />
    },
    {
      id: 2, 
      title: "Problem Statement",
      subtitle: "Market Pain Points",
      content: generateProblemStatement(),
      type: "problem",
      icon: <Target className="h-6 w-6" />
    },
    {
      id: 3,
      title: "Our Solution",
      subtitle: "AI-Powered Innovation",
      content: generateSolutionStatement(),
      type: "solution", 
      icon: <Lightbulb className="h-6 w-6" />
    },
    {
      id: 4,
      title: "Market Opportunity", 
      subtitle: `$${getMarketSize()} Market Size`,
      content: "Massive growth opportunity in expanding market",
      type: "market",
      icon: <TrendingUp className="h-6 w-6" />
    },
    {
      id: 5,
      title: "Business Model",
      subtitle: "Subscription SaaS",
      content: "Recurring revenue with multiple pricing tiers",
      type: "business",
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      id: 6,
      title: "Competitive Advantage",
      subtitle: "Unique Value Proposition", 
      content: "Advanced AI with 95% accuracy and seamless integration",
      type: "competitive",
      icon: <Award className="h-6 w-6" />
    },
    {
      id: 7,
      title: "Go-to-Market Strategy",
      subtitle: "Phased Approach",
      content: `Starting with ${startupIdea.targetMarket} then expanding globally`,
      type: "gtm",
      icon: <Globe className="h-6 w-6" />
    },
    {
      id: 8,
      title: "Financial Projections",
      subtitle: "3-Year Growth Plan",
      content: "Path to $10M ARR with 40% gross margins",
      type: "financial",
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      id: 9,
      title: "Funding Requirements",
      subtitle: `$${getFundingAmount()} Series A`,
      content: "Fuel growth and scale operations globally", 
      type: "funding",
      icon: <Building className="h-6 w-6" />
    },
    {
      id: 10,
      title: "Thank You",
      subtitle: "Questions & Discussion",
      content: "Ready to revolutionize the industry together",
      type: "closing",
      icon: <Star className="h-6 w-6" />
    }
  ];

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
              <Presentation className="h-8 w-8 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
                Professional Pitch Deck
              </Badge>
            </div>
            <CardTitle className="text-4xl font-bold text-gray-900 mb-4">
              Investor Pitch Deck Generator
            </CardTitle>
            <CardDescription className="text-xl text-gray-600 max-w-3xl mx-auto">
              Create a compelling, professional pitch deck tailored to your startup. Perfect for investor meetings, demo days, and funding presentations.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Generation Status */}
      <AnimatePresence>
        {!isGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-0 bg-white shadow-lg">
              <CardContent className="p-12 text-center">
                {!isGenerating ? (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      <Presentation className="h-24 w-24 text-blue-600 mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Create Your Pitch Deck?</h3>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                      Generate a professional 10-slide investor presentation with market analysis, financial projections, and compelling storytelling.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={generatePitchDeck}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-12 py-6 text-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <Sparkles className="h-6 w-6 mr-3" />
                        Generate Professional Pitch Deck
                        <ArrowRight className="h-5 w-5 ml-3" />
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="mb-6"
                    >
                      <Zap className="h-16 w-16 text-blue-600 mx-auto" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Generating Your Pitch Deck...</h3>
                    <div className="max-w-md mx-auto mb-6">
                      <Progress value={generationProgress} className="h-3" />
                    </div>
                    <p className="text-gray-600">Creating professional slides with compelling content...</p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Pitch Deck */}
      <AnimatePresence>
        {isGenerated && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Success Header */}
            <Card className="border-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <CheckCircle className="h-8 w-8" />
                  <Badge className="bg-white text-green-600 px-4 py-2">
                    Generation Complete
                  </Badge>
                </div>
                <h3 className="text-3xl font-bold mb-4">Your Pitch Deck is Ready! 🎉</h3>
                <p className="text-lg opacity-90 mb-6">
                  Professional 10-slide presentation optimized for investor meetings and funding rounds.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button 
                    onClick={downloadPitchDeck}
                    size="lg" 
                    className="bg-white text-green-600 hover:bg-gray-100 shadow-lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Pitch Deck
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-white hover:text-green-600"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    Preview Slides
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Slide Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Current Slide Display */}
              <Card className="border-0 bg-white shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-3">
                      <PlayCircle className="h-6 w-6 text-blue-600" />
                      <span>Slide Preview</span>
                    </CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">
                      {currentSlide + 1} of {pitchSlides.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-6 min-h-[300px] flex flex-col justify-center"
                  >
                    <div className="flex justify-center">
                      <div className="p-4 bg-blue-100 rounded-2xl">
                        {pitchSlides[currentSlide]?.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {pitchSlides[currentSlide]?.title}
                      </h3>
                      <p className="text-lg text-blue-600 font-medium mb-4">
                        {pitchSlides[currentSlide]?.subtitle}
                      </p>
                      <p className="text-gray-600 leading-relaxed">
                        {pitchSlides[currentSlide]?.content}
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                      disabled={currentSlide === 0}
                    >
                      Previous
                    </Button>
                    <div className="text-sm text-gray-500">
                      Slide {currentSlide + 1} of {pitchSlides.length}
                    </div>
                    <Button
                      onClick={() => setCurrentSlide(Math.min(pitchSlides.length - 1, currentSlide + 1))}
                      disabled={currentSlide === pitchSlides.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Slide Navigator */}
              <Card className="border-0 bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Presentation className="h-6 w-6 text-purple-600" />
                    <span>All Slides</span>
                  </CardTitle>
                  <CardDescription>
                    Click any slide to preview its content
                  </CardDescription>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-y-auto">
                  <div className="space-y-3">
                    {pitchSlides.map((slide, index) => (
                      <motion.div
                        key={slide.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className={`cursor-pointer border transition-all duration-200 ${
                            currentSlide === index 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                          onClick={() => setCurrentSlide(index)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className={`p-2 rounded-lg ${
                                  currentSlide === index ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {slide.icon}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{slide.title}</h4>
                                <p className="text-sm text-gray-600 truncate">{slide.subtitle}</p>
                              </div>
                              <div className="flex-shrink-0">
                                <Badge variant="outline" className="text-xs">
                                  {index + 1}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 bg-white shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Presentation className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Professional Design</h3>
                  <p className="text-sm text-gray-600">Investor-ready slides with modern, clean design that captures attention</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Data-Driven Content</h3>
                  <p className="text-sm text-gray-600">Market analysis, financial projections, and competitive insights included</p>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white shadow-md">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ready to Present</h3>
                  <p className="text-sm text-gray-600">Downloadable HTML format that works on any device or presentation system</p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card className="border-0 bg-gray-50 shadow-sm">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Take Your Pitch to the Next Level</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button 
                    onClick={downloadPitchDeck}
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Full Presentation
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => {
                      const text = pitchSlides.map(slide => 
                        `${slide.title}\n${slide.subtitle}\n${slide.content}\n---`
                      ).join('\n');
                      navigator.clipboard.writeText(text);
                      toast.success("Pitch deck content copied to clipboard!");
                    }}
                    className="w-full sm:w-auto"
                  >
                    <Copy className="h-5 w-5 mr-2" />
                    Copy All Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}