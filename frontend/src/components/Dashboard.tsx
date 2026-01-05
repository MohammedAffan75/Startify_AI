import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { motion, AnimatePresence } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { StartupResults } from "./StartupResults";
import { ExplainabilityDashboard } from "./ExplainabilityDashboard";
import { EnhancedExportSystem } from "./EnhancedExportSystem";
import { generateAndDownloadPDF } from "./PDFGenerator";
import { Bot, Sparkles, Clock, CheckCircle, AlertCircle, Lightbulb, TrendingUp, FileText, Target, Users, Palette, Settings, User, Bell, Globe, LogOut, Crown, Zap, BarChart3, Activity, Brain, Rocket, ChevronRight, Star, Gauge, Briefcase, DollarSign, Award, Eye, Download, PlayCircle, Pause, ArrowRight, Building2, Calendar, MapPin, Mic, MicOff } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  plan: 'free' | 'professional' | 'enterprise';
  createdAt: Date;
}

interface DashboardProps {
  onBack: () => void;
  onSignOut: () => void;
  user: UserProfile;
}

interface StartupIdea {
  description: string;
  industry: string;
  targetMarket: string;
  founderPersona: string;
}

interface AgentStatus {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  icon: React.ReactNode;
  description: string;
  timeEstimate: string;
}

// Professional Stat Card Component - Fixed Uniform Size
const MetricCard = ({ icon, title, value, subtitle, color }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  color: string;
}) => (
  <motion.div
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
  >
    <Card className="relative overflow-hidden border-0 bg-white shadow-md hover:shadow-xl transition-all duration-300 group h-32">
      <CardContent className="p-6 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium text-gray-600 leading-tight">{title}</p>
            <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 leading-tight">{subtitle}</p>
            )}
          </div>
          <motion.div 
            className={`p-3 rounded-lg ${color} shadow-sm flex-shrink-0`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Professional Quick Action Component - Fixed Uniform Size
const ActionCard = ({ icon, title, description, onClick, disabled = false }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <motion.div
    whileHover={!disabled ? { y: -2, scale: 1.01 } : {}}
    whileTap={!disabled ? { scale: 0.99 } : {}}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className="h-full"
  >
    <Card 
      className={`cursor-pointer border-0 bg-white shadow-md hover:shadow-lg transition-all duration-300 group h-full flex flex-col ${
        disabled ? 'opacity-60 cursor-not-allowed' : ''
      }`}
      onClick={!disabled ? onClick : undefined}
    >
      <CardContent className="p-6 text-center space-y-4 flex flex-col flex-1 justify-between min-h-[200px]">
        <motion.div 
          className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg flex-shrink-0"
          whileHover={!disabled ? { rotate: 5, scale: 1.1 } : {}}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>
        <div className="space-y-2 flex-1 flex flex-col justify-center">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
        <div className="flex-shrink-0">
          {!disabled && (
            <ArrowRight className="h-4 w-4 text-blue-600 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export function Dashboard({ onBack, onSignOut, user }: DashboardProps) {
  const [currentTab, setCurrentTab] = useState("overview");
  const [startupIdea, setStartupIdea] = useState<StartupIdea>({
    description: "",
    industry: "",
    targetMarket: "",
    founderPersona: ""
  });

  // Speech to Text
  const [isRecording, setIsRecording] = useState(false);
  const [supportsSpeech, setSupportsSpeech] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  // Settings state
  const [settings, setSettings] = useState({
    profile: {
      name: user.name,
      email: user.email,
      company: user.company || "",
      role: user.role || ""
    },
    preferences: {
      notifications: true,
      emailUpdates: true,
      autoSave: true,
      language: "en",
      timezone: "UTC"
    }
  });

  const [agents, setAgents] = useState<AgentStatus[]>([
    { 
      name: "Strategic Analysis", 
      status: 'pending', 
      progress: 0, 
      icon: <Brain className="h-4 w-4" />,
      description: "Analyzing market trends and business strategy",
      timeEstimate: "2-3 min"
    },
    { 
      name: "Market Research", 
      status: 'pending', 
      progress: 0, 
      icon: <TrendingUp className="h-4 w-4" />,
      description: "Conducting competitive analysis",
      timeEstimate: "3-4 min"
    },
    { 
      name: "Brand Development", 
      status: 'pending', 
      progress: 0, 
      icon: <Palette className="h-4 w-4" />,
      description: "Creating brand identity and positioning",
      timeEstimate: "2-3 min"
    },
    { 
      name: "Content Creation", 
      status: 'pending', 
      progress: 0, 
      icon: <Target className="h-4 w-4" />,
      description: "Generating marketing materials",
      timeEstimate: "1-2 min"
    },
    { 
      name: "Financial Modeling", 
      status: 'pending', 
      progress: 0, 
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Building financial projections",
      timeEstimate: "4-5 min"
    },
    { 
      name: "Investor Matching", 
      status: 'pending', 
      progress: 0, 
      icon: <Users className="h-4 w-4" />,
      description: "Creating investor presentations",
      timeEstimate: "3-4 min"
    }
  ]);

  const industries = [
    "HealthTech", "EdTech", "FinTech", "AgriTech", "CleanTech", 
    "RetailTech", "FoodTech", "PropTech", "LegalTech", "HR Tech", 
    "Gaming", "SaaS", "E-commerce", "Marketplace", "AI/ML", "Other"
  ];

  const targetMarkets = [
    "B2B Enterprise", "B2B SMB", "B2C Mass Market", "B2C Niche", 
    "B2B2C", "Marketplace", "Government/Public Sector", "Non-profit"
  ];

  const founderPersonas = [
    "Solo Technical Founder", "Business-focused Founder", "Serial Entrepreneur", 
    "First-time Entrepreneur", "Social Impact Focused", "VC-backed Growth", 
    "Bootstrap/Self-funded", "Academic/Research Background"
  ];

  // --- Speech to Text setup (Web Speech API) ---
  useEffect(() => {
    // Detect Web Speech API support in the browser
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupportsSpeech(false);
      return;
    }

    setSupportsSpeech(true);

    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.interimResults = true;
    recog.lang = 'en-US';

    recog.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalTranscript += res[0].transcript;
        }
      }
      if (finalTranscript) {
        setStartupIdea(prev => ({
          ...prev,
          description: (prev.description ? prev.description + ' ' : '') + finalTranscript.trim()
        }));
      }
    };

    recog.onerror = (e: any) => {
      console.warn('Speech recognition error:', e);
      setIsRecording(false);
    };

    recognitionRef.current = recog;

    return () => {
      try {
        recog.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!supportsSpeech) {
      toast.error('Speech to text is not supported in this browser. Try Chrome on desktop.');
      return;
    }

    const recog = recognitionRef.current;
    if (!recog) return;

    try {
      if (isRecording) {
        recog.stop();
        setIsRecording(false);
      } else {
        recog.start();
        setIsRecording(true);
        toast.info('Listening... Speak your idea');
      }
    } catch (e) {
      console.error('Recognition toggle error:', e);
      toast.error('Could not access microphone. Please check browser permissions.');
      setIsRecording(false);
    }
  };

  // Welcome animation timeout
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGenerate = async () => {
    if (!startupIdea.description.trim()) {
      toast.error("Please describe your startup idea first!");
      return;
    }
    
    setIsGenerating(true);
    setGenerationComplete(false);
    setCurrentStep(0);
    
    // Track actual start time
    const startTime = Date.now();
    
    // Clear previous results from localStorage
    console.log('🗑️ Clearing previous results...');
    localStorage.removeItem('latest_startup_results');
    
    // Reset all agents to pending
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'pending' as const, progress: 0 })));
    
    try {
      // No authentication required for local backend
      const projectId = 'qtasahyujisrwvwepprd';
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
      
      // Start API call immediately
      console.log('🚀 Starting backend processing...', `${API_BASE_URL}/api/generate`);
      
      // Set first agent to running (NLP Parser)
      setCurrentStep(0);
      setAgents(prev => prev.map((agent, index) => 
        index === 0 ? { ...agent, status: 'running' as const, progress: 50 } : agent
      ));
      
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: user.email,
          idea: `${startupIdea.description} | Industry: ${startupIdea.industry} | Target: ${startupIdea.targetMarket} | Founder: ${startupIdea.founderPersona}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate startup analysis');
      }

      const data = await response.json();
      const jobId = data.job_id;
      
      // Complete NLP Parser agent
      setAgents(prev => prev.map((agent, index) => 
        index === 0 ? { ...agent, status: 'completed' as const, progress: 100 } : agent
      ));
      
      // Poll for results and update agents based on backend progress
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max
      let lastAgentIndex = 0;
      
      const pollInterval = setInterval(async () => {
        try {
          const statusResp = await fetch(`${API_BASE_URL}/api/status/${jobId}`);
          const statusData = await statusResp.json();
          
          // Update agents based on processing time
          const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
          const agentIndex = Math.min(Math.floor(elapsedSeconds / 5), agents.length - 1);
          
          if (agentIndex > lastAgentIndex) {
            // Move to next agent
            setCurrentStep(agentIndex);
            setAgents(prev => prev.map((agent, index) => {
              if (index < agentIndex) return { ...agent, status: 'completed' as const, progress: 100 };
              if (index === agentIndex) return { ...agent, status: 'running' as const, progress: 50 };
              return agent;
            }));
            lastAgentIndex = agentIndex;
          }
          
          if (statusData.status === 'completed') {
            clearInterval(pollInterval);
            
            // Mark all agents as completed
            setAgents(prev => prev.map(agent => ({ ...agent, status: 'completed' as const, progress: 100 })));
            setCurrentStep(agents.length - 1);
            
            // Fetch the full results
            const resultsResp = await fetch(`${API_BASE_URL}/api/results/${jobId}`);
            const resultsData = await resultsResp.json();
            
            const totalTime = Math.floor((Date.now() - startTime) / 1000);
            console.log(`✅ Backend processing completed in ${totalTime} seconds`);
            
            console.log('✅ New results received:', {
              jobId,
              brandNames: resultsData.brand_names?.length,
              investors: resultsData.investors?.length,
              marketInsights: resultsData.market_insights
            });

            // Store the complete results in localStorage
            const payload = {
              ...resultsData,
              processingTime: totalTime,
              generatedAt: new Date().toISOString(),
            };
            localStorage.setItem('latest_startup_results', JSON.stringify(payload));

            setIsGenerating(false);
            setGenerationComplete(true);
            toast.success(`Your startup package is ready! (${totalTime}s)`);
            return;
          } else if (attempts++ >= maxAttempts) {
            clearInterval(pollInterval);
            throw new Error('Generation timeout');
          }
        } catch (pollError) {
          clearInterval(pollInterval);
          console.error('Polling error:', pollError);
          setIsGenerating(false);
          toast.error('Failed to fetch results');
        }
      }, 2000); // Poll every 2 seconds
      // Agents are updated by the polling interval above
    } catch (error) {
      console.error('Generation error:', error);
      
      // Set all agents to error state
      setAgents(prev => prev.map(agent => ({ ...agent, status: 'error' as const })));
      setIsGenerating(false);
      
      toast.error(error instanceof Error ? error.message : "Failed to generate startup analysis");
    }
  };

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'running':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="h-4 w-4 text-blue-600" />
          </motion.div>
        );
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return <Crown className="h-4 w-4" />;
      case 'professional':
        return <Zap className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'from-purple-500 to-pink-500';
      case 'professional':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Welcome Animation */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center text-white"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <Rocket className="w-full h-full" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}</h1>
              <p className="text-lg opacity-90">Preparing your workspace...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Professional Header */}
      <motion.header 
        className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm w-full backdrop-blur-sm bg-white/95"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
              <motion.div 
                className="flex items-center space-x-2 sm:space-x-3"
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                  <img src="/Startify-logo.png" alt="Startify AI" className="w-full h-full object-contain" />
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Startify AI
                  </span>
                  <div className="text-xs text-gray-500 flex items-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <span>Professional Dashboard</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex items-center gap-2 sm:gap-4 flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* User Profile */}
              <div className="hidden md:flex items-center space-x-3 bg-gray-50 rounded-xl px-3 sm:px-4 py-2 border">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r ${getPlanColor(user.plan)} rounded-lg flex items-center justify-center text-white`}>
                  {getPlanIcon(user.plan)}
                </div>
                <div className="hidden lg:block">
                  <div className="font-medium text-gray-900 text-sm">{user.name}</div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`text-xs bg-gradient-to-r ${getPlanColor(user.plan)} text-white border-0`}>
                      {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onSignOut}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 w-full">
        <div className="w-full">
          
          {/* Main Dashboard Area (Full Width) */}
          <div className="w-full space-y-0">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              {/* Clean Tab Navigation - Fixed Layout */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
              >
                <div className="bg-white p-2 rounded-xl shadow-sm border">
                  <TabsList className="!grid !w-full !grid-cols-6 !h-auto !bg-transparent !p-0 gap-1">
                    {[
                      { value: 'overview', icon: Activity, label: 'Overview', requiresGeneration: false },
                      { value: 'builder', icon: Sparkles, label: 'Builder', requiresGeneration: false },
                      { value: 'results', icon: FileText, label: 'Results', requiresGeneration: true },
                      { value: 'insights', icon: Lightbulb, label: 'Insights', requiresGeneration: true },
                      { value: 'export', icon: Download, label: 'Export', requiresGeneration: true },
                      { value: 'settings', icon: Settings, label: 'Settings', requiresGeneration: false }
                    ].map((tab) => {
                      const isDisabled = tab.requiresGeneration && !generationComplete;
                      
                      return (
                        <div key={tab.value} className="relative flex-1">
                          {isDisabled && (
                            <div 
                              className="absolute inset-0 z-10 cursor-not-allowed rounded-lg flex items-center justify-center bg-transparent"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toast.info(`Generate a startup first to unlock ${tab.label}!`, {
                                  description: "Go to the Builder tab to get started"
                                });
                              }}
                            />
                          )}
                          <TabsTrigger 
                            value={tab.value}
                            disabled={isDisabled}
                            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm hover:bg-gray-50 transition-all duration-200 rounded-lg px-2 sm:px-4 py-3 disabled:opacity-50 flex items-center justify-center gap-1.5 sm:gap-2 relative overflow-hidden text-xs sm:text-sm !h-auto w-full"
                          >
                            <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="font-medium hidden sm:inline">{tab.label}</span>
                            <span className="font-medium sm:hidden">{tab.label.substring(0, 3)}</span>
                            
                            {/* Active indicator */}
                            {currentTab === tab.value && (
                              <motion.div
                                className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full"
                                layoutId="activeIndicator"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                              />
                            )}
                            
                            {/* Lock icon for disabled tabs */}
                            {isDisabled && (
                              <div className="absolute top-1 right-1">
                                <div className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                </div>
                              </div>
                            )}
                          </TabsTrigger>
                        </div>
                      );
                    })}
                  </TabsList>
                </div>
                
                {/* Status Indicators */}
                {!generationComplete && currentTab !== 'builder' && (
                  <motion.div 
                    className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <AlertCircle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Results, Insights, and Export tabs are locked.</span> Generate your startup in the Builder tab to unlock all features!
                    </p>
                  </motion.div>
                )}
                
                {generationComplete && (
                  <motion.div 
                    className="mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl flex items-center gap-3 shadow-sm"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-900">✨ All features unlocked!</p>
                      <p className="text-sm text-green-700">Your startup package is ready. Click Results, Insights, or Export tabs to explore.</p>
                    </div>
                    <Button
                      onClick={() => setCurrentTab('results')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      View Results
                    </Button>
                  </motion.div>
                )}
              </motion.div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Welcome Section */}
                  <div className="text-center space-y-3 py-6">
                    <motion.h1 
                      className="text-3xl sm:text-4xl font-bold text-gray-900"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Welcome back, {user.name.split(' ')[0]} 👋
                    </motion.h1>
                    <motion.p 
                      className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Your AI-powered startup creation platform is ready. Let's build something extraordinary.
                    </motion.p>
                  </div>

                  {/* Metrics Grid - All Same Size */}
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <MetricCard
                      icon={<Briefcase className="h-5 w-5 text-white" />}
                      title="Startups Created"
                      value={generationComplete ? "1" : "0"}
                      subtitle={generationComplete ? "This session" : "Get started"}
                      color="bg-gradient-to-r from-blue-500 to-blue-600"
                    />
                    <MetricCard
                      icon={<Gauge className="h-5 w-5 text-white" />}
                      title="Success Rate"
                      value={generationComplete ? "100%" : "0%"}
                      subtitle={generationComplete ? "Perfect score" : "Ready to start"}
                      color="bg-gradient-to-r from-green-500 to-green-600"
                    />
                    <MetricCard
                      icon={<Award className="h-5 w-5 text-white" />}
                      title="AI Insights"
                      value={generationComplete ? "24" : "0"}
                      subtitle={generationComplete ? "Generated" : "Pending"}
                      color="bg-gradient-to-r from-purple-500 to-purple-600"
                    />
                    <MetricCard
                      icon={<Eye className="h-5 w-5 text-white" />}
                      title="Plan Status"
                      value={user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                      subtitle="Active"
                      color={`bg-gradient-to-r ${getPlanColor(user.plan)}`}
                    />
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div 
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                      <ActionCard
                        icon={<Sparkles className="h-6 w-6" />}
                        title="Create Startup"
                        description="Generate a comprehensive business package with AI"
                        onClick={() => setCurrentTab('builder')}
                      />
                      
                      <ActionCard
                        icon={<FileText className="h-6 w-6" />}
                        title="View Results"
                        description="Explore your generated startup insights"
                        onClick={() => setCurrentTab('results')}
                        disabled={!generationComplete}
                      />
                      
                      <ActionCard
                        icon={<Download className="h-6 w-6" />}
                        title="Export Package"
                        description="Download business documents and presentations"
                        onClick={() => setCurrentTab('export')}
                        disabled={!generationComplete}
                      />
                    </div>
                  </motion.div>

                  {/* Recent Activity */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card className="border-0 bg-white shadow-md">
                      <CardHeader>
                        <CardTitle className="text-lg sm:text-xl flex items-center gap-3">
                          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Activity className="h-5 w-5 text-blue-600" />
                          </div>
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                      {generationComplete ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">Startup Package Complete</h3>
                            <p className="text-sm text-gray-600">Your comprehensive business package has been generated successfully.</p>
                          </div>
                          <Button
                            onClick={() => setCurrentTab('results')}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white flex-shrink-0 w-full sm:w-auto"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Results
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Rocket className="h-8 w-8 text-blue-500" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">Ready to Get Started?</h3>
                          <p className="text-sm text-gray-600 mb-4">Create your first startup package with our AI agents.</p>
                          <Button
                            onClick={() => setCurrentTab('builder')}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Start Building
                          </Button>
                        </div>
                      )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </TabsContent>

              {/* Builder Tab */}
              <TabsContent value="builder" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="border-0 bg-white shadow-lg">
                    <CardHeader className="text-center pb-6 pt-8">
                      <Badge className="w-fit mx-auto mb-4 bg-blue-50 text-blue-700 border-blue-200 px-4 py-1.5">
                        <Zap className="h-4 w-4 mr-2" />
                        AI-Powered Generation
                      </Badge>
                      
                      <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                        Build Your Startup
                      </CardTitle>
                      
                      <CardDescription className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
                        Describe your idea and let our AI agents create a comprehensive business package
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-8">
                      {/* Idea Description */}
                      <div className="space-y-3">
                        <Label htmlFor="description" className="text-lg font-medium flex items-center space-x-2">
                          <Lightbulb className="h-5 w-5 text-yellow-500" />
                          <span>Describe Your Startup Idea *</span>
                        </Label>
                        <div
                          className="relative rounded-md border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors"
                        >
                          <Textarea
                            id="description"
                            placeholder="Speak or type your idea..."
                            value={startupIdea.description}
                            onChange={(e) => setStartupIdea(prev => ({ ...prev, description: e.target.value }))}
                            className="min-h-[120px] w-full resize-none border-none bg-transparent text-base focus-visible:ring-0 focus-visible:outline-none shadow-none pr-24"
                          />
                          <button
                            type="button"
                            onClick={toggleRecording}
                            className={`absolute bottom-3 right-3 inline-flex items-center justify-center rounded-full border px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-md transition-all duration-200
                              ${isRecording
                                ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 ring-2 ring-red-300 animate-pulse'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'}
                            `}
                            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                            title={supportsSpeech ? (isRecording ? 'Listening… click to stop' : 'Click to start listening') : 'Speech to text not supported'}
                            disabled={!supportsSpeech}
                          >
                            {isRecording ? (
                              <>
                                <MicOff className="h-4 w-4 mr-1" />
                                <span>Listening…</span>
                              </>
                            ) : (
                              <>
                                <Mic className="h-4 w-4 mr-1" />
                                <span>Speak</span>
                              </>
                            )}
                          </button>
                        </div>
                        {supportsSpeech ? (
                          <p className="text-xs text-gray-500">Tip: Click Speak and describe your idea. Your speech will be transcribed here.</p>
                        ) : (
                          <p className="text-xs text-gray-500">Speech to text not supported in this browser. Try Chrome.</p>
                        )}
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{startupIdea.description.length}/500 characters</span>
                          <span className="text-blue-600 hover:text-blue-800 cursor-pointer">
                            Need inspiration? →
                          </span>
                        </div>
                      </div>

                      {/* Selection Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { key: 'industry', label: 'Industry', options: industries, icon: <Target className="h-4 w-4" /> },
                          { key: 'targetMarket', label: 'Target Market', options: targetMarkets, icon: <Users className="h-4 w-4" /> },
                          { key: 'founderPersona', label: 'Founder Type', options: founderPersonas, icon: <User className="h-4 w-4" /> }
                        ].map(({ key, label, options, icon }) => (
                          <div key={key} className="space-y-3">
                            <Label className="text-base font-medium flex items-center space-x-2">
                              {icon}
                              <span>{label}</span>
                            </Label>
                            <Select 
                              value={startupIdea[key as keyof StartupIdea]} 
                              onValueChange={(value) => setStartupIdea(prev => ({ ...prev, [key]: value }))}
                            >
                              <SelectTrigger className="h-12 border-gray-300 focus:border-blue-500">
                                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {options.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>

                      {/* Generate Button */}
                      <div className="flex justify-center pt-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={handleGenerate}
                            disabled={!startupIdea.description.trim() || isGenerating}
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
                          >
                            {isGenerating ? (
                              <div className="flex items-center space-x-3">
                                <motion.div 
                                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                <span>Generating...</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-3">
                                <Sparkles className="h-5 w-5" />
                                <span>Generate Startup Package</span>
                                <ChevronRight className="h-4 w-4" />
                              </div>
                            )}
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Agent Processing Display */}
                <AnimatePresence>
                  {isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-0 bg-white shadow-lg">
                        <CardHeader className="text-center pb-4">
                          <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"
                            >
                              <Activity className="h-5 w-5 text-blue-600" />
                            </motion.div>
                            <span>AI Agents Processing</span>
                          </CardTitle>
                          <CardDescription className="text-sm sm:text-base mt-2">
                            Our specialized agents are building your comprehensive startup package
                          </CardDescription>
                          
                          {/* Overall Progress */}
                          <div className="mt-4 bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-gray-700">Overall Progress</span>
                              <span className="text-blue-600 font-bold">
                                {Math.round((currentStep / agents.length) * 100)}%
                              </span>
                            </div>
                            <Progress 
                              value={(currentStep / agents.length) * 100} 
                              className="h-2"
                            />
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="space-y-4">
                            {agents.map((agent, index) => (
                              <motion.div
                                key={index}
                                className={`p-4 rounded-lg border transition-all duration-300 ${
                                  agent.status === 'running' 
                                    ? 'border-blue-200 bg-blue-50' 
                                    : agent.status === 'completed'
                                    ? 'border-green-200 bg-green-50'
                                    : 'border-gray-200 bg-gray-50'
                                }`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="flex items-center space-x-4">
                                  <div className={`p-2 rounded-lg ${
                                    agent.status === 'completed' ? 'bg-green-500 text-white' : 
                                    agent.status === 'running' ? 'bg-blue-500 text-white' : 
                                    'bg-gray-300 text-gray-600'
                                  }`}>
                                    {agent.icon}
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                                      <div className="flex items-center space-x-2">
                                        {getStatusIcon(agent.status)}
                                        <Badge 
                                          variant="outline"
                                          className={
                                            agent.status === 'completed' ? 'border-green-200 text-green-800' :
                                            agent.status === 'running' ? 'border-blue-200 text-blue-800' :
                                            'border-gray-200 text-gray-600'
                                          }
                                        >
                                          {agent.status === 'completed' && 'Complete'}
                                          {agent.status === 'running' && `${agent.progress}%`}
                                          {agent.status === 'pending' && `ETA: ${agent.timeEstimate}`}
                                        </Badge>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
                                    <Progress 
                                      value={agent.progress} 
                                      className={`h-1 ${
                                        agent.status === 'completed' ? '[&>div]:bg-green-500' :
                                        agent.status === 'running' ? '[&>div]:bg-blue-500' :
                                        '[&>div]:bg-gray-300'
                                      }`}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* Results Tab */}
              <TabsContent value="results">
                <AnimatePresence mode="wait">
                  {generationComplete ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <StartupResults startupIdea={startupIdea} />
                    </motion.div>
                  ) : (
                    <Card className="border-0 bg-white shadow-md">
                      <CardContent className="p-8 sm:p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Results Coming Soon</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-md mx-auto">
                          Generate your startup package to see comprehensive results and insights.
                        </p>
                        <Button 
                          onClick={() => setCurrentTab('builder')}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Start Building
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights">
                <AnimatePresence mode="wait">
                  {generationComplete ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <ExplainabilityDashboard startupIdea={startupIdea} />
                    </motion.div>
                  ) : (
                    <Card className="border-0 bg-white shadow-md">
                      <CardContent className="p-8 sm:p-12 text-center">
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Lightbulb className="h-10 w-10 text-yellow-500" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">AI Insights Available Soon</h3>
                        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                          Complete your startup generation to access detailed AI insights and explanations.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* Export Tab */}
              <TabsContent value="export">
                <AnimatePresence mode="wait">
                  {generationComplete ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <EnhancedExportSystem startupIdea={startupIdea} />
                    </motion.div>
                  ) : (
                    <Card className="border-0 bg-white shadow-md">
                      <CardContent className="p-8 sm:p-12 text-center">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Download className="h-10 w-10 text-green-500" />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Export Not Available</h3>
                        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                          Generate your startup package first to access export options.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </AnimatePresence>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Profile Settings */}
                  <Card className="border-0 bg-white shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                        <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <span>Profile Settings</span>
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">Manage your account information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { key: 'name', label: 'Full Name', type: 'text' },
                          { key: 'email', label: 'Email', type: 'email' },
                          { key: 'company', label: 'Company', type: 'text' },
                          { key: 'role', label: 'Role', type: 'text' }
                        ].map((field) => (
                          <div key={field.key} className="space-y-2">
                            <Label htmlFor={field.key}>{field.label}</Label>
                            <Input
                              id={field.key}
                              type={field.type}
                              value={settings.profile[field.key as keyof typeof settings.profile]}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                profile: { ...prev.profile, [field.key]: e.target.value }
                              }))}
                              className="border-gray-300 focus:border-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preferences */}
                  <Card className="border-0 bg-white shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-lg sm:text-xl">
                        <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center">
                          <Bell className="h-5 w-5 text-purple-600" />
                        </div>
                        <span>Preferences</span>
                      </CardTitle>
                      <CardDescription className="text-sm sm:text-base">Customize your experience</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {[
                        { key: 'notifications', label: 'Email Notifications', description: 'Receive updates about your startup packages' },
                        { key: 'emailUpdates', label: 'Product Updates', description: 'Get notified about new features' },
                        { key: 'autoSave', label: 'Auto Save', description: 'Automatically save your work' }
                      ].map((pref) => (
                        <div key={pref.key} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <Label htmlFor={pref.key} className="font-medium">{pref.label}</Label>
                            <p className="text-sm text-gray-600">{pref.description}</p>
                          </div>
                          <Switch
                            id={pref.key}
                            checked={settings.preferences[pref.key as keyof typeof settings.preferences] as boolean}
                            onCheckedChange={(checked) => setSettings(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, [pref.key]: checked }
                            }))}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}