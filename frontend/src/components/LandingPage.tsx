import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Bot, Lightbulb, TrendingUp, Users, FileText, Target, Sparkles, ArrowRight, Brain, Zap, Shield, CheckCircle, Star, Globe, Rocket, Award, DollarSign, Clock, MessageSquare } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { useRef } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  plan: 'free' | 'professional' | 'enterprise';
  createdAt: Date;
}

interface LandingPageProps {
  onGetStarted: () => void;
  onUpgradePlan: (plan: 'professional' | 'enterprise') => void;
  currentUser: UserProfile | null;
}

export function LandingPage({ onGetStarted, onUpgradePlan, currentUser }: LandingPageProps) {
  const [email, setEmail] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeFeature, setActiveFeature] = useState(0);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const agentsRef = useRef(null);
  const pricingRef = useRef(null);

  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, -200]);
  const yHero = useTransform(scrollY, [0, 500], [0, -100]);
  
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const isAgentsInView = useInView(agentsRef, { once: true, margin: "-100px" });
  const isPricingInView = useInView(pricingRef, { once: true, margin: "-100px" });

  // Mouse tracking for interactive elements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Parallax background elements
  const parallaxElements = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    speed: Math.random() * 0.5 + 0.1,
  }));

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Idea Refinement",
      description: "Transform rough concepts into validated business opportunities with our intelligent analysis engine",
      color: "from-blue-500 to-cyan-500",
      benefits: ["Market trend analysis", "Competitive landscape mapping", "Value proposition optimization"]
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Smart Market Analysis",
      description: "Get comprehensive market insights, competitor analysis, and growth projections in seconds",
      color: "from-green-500 to-emerald-500",
      benefits: ["TAM/SAM/SOM calculations", "Competitor profiling", "Market entry strategies"]
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Brand Generator",
      description: "Create compelling brand names, logos, and visual identity that resonates with your audience",
      color: "from-purple-500 to-pink-500",
      benefits: ["Domain availability check", "Logo design options", "Brand guideline creation"]
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Marketing Copy AI",
      description: "Generate high-converting ad copy, landing pages, and marketing materials tailored to your audience",
      color: "from-orange-500 to-red-500",
      benefits: ["Multi-platform copy", "A/B test variations", "Audience targeting"]
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Pitch Deck Builder",
      description: "Create investor-ready presentations with compelling narratives and financial projections",
      color: "from-indigo-500 to-blue-500",
      benefits: ["Professional templates", "Financial modeling", "Investor matching"]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Investor Network",
      description: "Connect with relevant investors based on your startup profile, industry, and funding stage",
      color: "from-teal-500 to-green-500",
      benefits: ["Investor database access", "Introduction facilitation", "Funding stage matching"]
    }
  ];

  const agents = [
    { name: "Strategic Ideation Agent", role: "Validates and refines business concepts", color: "bg-gradient-to-r from-blue-500 to-cyan-500", delay: 0.1 },
    { name: "Market Intelligence Agent", role: "Analyzes market dynamics and opportunities", color: "bg-gradient-to-r from-green-500 to-emerald-500", delay: 0.2 },
    { name: "Brand Creation Agent", role: "Develops compelling brand identity", color: "bg-gradient-to-r from-purple-500 to-pink-500", delay: 0.3 },
    { name: "Content Generation Agent", role: "Creates persuasive marketing materials", color: "bg-gradient-to-r from-orange-500 to-red-500", delay: 0.4 },
    { name: "Financial Modeling Agent", role: "Builds comprehensive business models", color: "bg-gradient-to-r from-red-500 to-pink-500", delay: 0.5 },
    { name: "Network Orchestrator", role: "Coordinates all agents and manages workflow", color: "bg-gradient-to-r from-indigo-500 to-purple-500", delay: 0.6 }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: 0,
      period: "Free Forever",
      description: "Perfect for exploring and validating your first startup idea",
      features: [
        "3 startup idea analyses per month",
        "Basic AI agent functionality",
        "Standard report templates",
        "Community support forum",
        "Basic market insights"
      ],
      popular: false,
      gradient: "from-gray-500 to-gray-600",
      cta: "Start Free"
    },
    {
      name: "Professional",
      price: 79,
      period: "per month",
      description: "Ideal for serial entrepreneurs and growing businesses",
      features: [
        "25 startup packages per month",
        "All AI agents with advanced features",
        "Premium templates and branding",
        "Priority email support",
        "Advanced market analytics",
        "Custom export formats",
        "Investor database access",
        "Team collaboration tools"
      ],
      popular: true,
      gradient: "from-blue-600 to-purple-600",
      cta: "Start 14-Day Trial"
    },
    {
      name: "Enterprise",
      price: 299,
      period: "per month",
      description: "For accelerators, agencies, and large organizations",
      features: [
        "Unlimited startup packages",
        "White-label platform access",
        "Custom AI model training",
        "Dedicated success manager",
        "API access and integrations",
        "Advanced team management",
        "Custom reporting dashboard",
        "Priority phone support",
        "Custom feature development"
      ],
      popular: false,
      gradient: "from-purple-600 to-pink-600",
      cta: "Contact Sales"
    }
  ];

  const testimonials = [
    { name: "Sarah Chen", role: "CEO, TechFlow", content: "Startify AI helped us raise our Series A in just 3 months. The pitch deck was flawless.", avatar: "SC" },
    { name: "Marcus Rodriguez", role: "Founder, GreenTech Solutions", content: "The market analysis saved us months of research. We launched directly into our target market.", avatar: "MR" },
    { name: "Emily Watson", role: "Product Manager, InnovateCorp", content: "Finally, a tool that understands the startup ecosystem. Game-changing for our innovation team.", avatar: "EW" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onGetStarted();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{ y: yBg }}
      >
        {parallaxElements.map((element) => (
          <motion.div
            key={element.id}
            className="absolute rounded-full"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              background: `radial-gradient(circle, rgba(59, 130, 246, ${0.1 + Math.random() * 0.1}), transparent)`,
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + element.speed * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: element.id * 0.1,
            }}
          />
        ))}
      </motion.div>

      {/* Interactive Mouse Follower */}
      <motion.div
        className="fixed w-32 h-32 rounded-full pointer-events-none z-50 mix-blend-multiply"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.05), transparent)"
        }}
        animate={{
          x: mousePosition.x - 64,
          y: mousePosition.y - 64,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 150,
        }}
      />

      {/* Header */}
      <motion.header 
        className="bg-background/90 backdrop-blur-xl border-b border-border/50 sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img src="/Startify-logo.png" alt="Startify AI" className="w-full h-full object-contain" />
              </motion.div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Startify AI
                </span>
                <div className="text-xs text-muted-foreground">Intelligent Startup Builder</div>
              </div>
            </motion.div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {["features", "about", "pricing"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Button 
                    variant="ghost" 
                    onClick={() => scrollToSection(item)}
                    className="hover:bg-accent/80 hover:scale-105 transition-all duration-200 relative overflow-hidden group"
                  >
                    <span className="relative z-10 capitalize">{item}</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={onGetStarted} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden group px-6 py-2"
              >
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative"
        style={{ y: yHero }}
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isHeroInView ? { scale: 1 } : { scale: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 relative overflow-hidden px-4 py-2">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                <span className="relative z-10 flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  Powered by Advanced Multi-Agent AI
                </span>
              </Badge>
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-blue-900 to-purple-900 bg-clip-text text-transparent mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            Build Your Dream Startup
            <br />
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              in Minutes, Not Months
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            Transform your startup idea into a complete business package with AI agents that handle everything from market analysis to investor-ready pitch decks. Join thousands of entrepreneurs who've already built successful startups with Startify AI.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={onGetStarted} 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 text-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-2xl transition-all duration-300 shadow-xl relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  Start Building Now - Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
            
            <motion.form 
              onSubmit={handleEmailSubmit}
              className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-full px-2 py-2 shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <Input
                type="email"
                placeholder="Enter your email for early access"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground px-4 min-w-[250px]"
              />
              <Button type="submit" size="sm" className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6">
                Join Waitlist
              </Button>
            </motion.form>
          </motion.div>
          
          {/* Enhanced Stats with Animations */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          >
            {[
              { number: "15K+", label: "Startups Created", icon: Rocket, color: "text-blue-600" },
              { number: "97%", label: "Success Rate", icon: Award, color: "text-green-600" },
              { number: "2 min", label: "Average Build Time", icon: Clock, color: "text-purple-600" },
              { number: "$125M+", label: "Funding Raised", icon: DollarSign, color: "text-orange-600" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center relative group"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.6, delay: 1 + index * 0.1, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <motion.div 
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${stat.color.includes('blue') ? 'from-blue-500 to-blue-600' : stat.color.includes('green') ? 'from-green-500 to-green-600' : stat.color.includes('purple') ? 'from-purple-500 to-purple-600' : 'from-orange-500 to-orange-600'} text-white mb-3 shadow-lg`}
                    whileHover={{ rotate: 12, scale: 1.1 }}
                  >
                    <stat.icon className="h-6 w-6" />
                  </motion.div>
                  <motion.div 
                    className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}
                    animate={{ 
                      textShadow: ["0 0 0px currentColor", "0 0 10px currentColor", "0 0 0px currentColor"] 
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Interactive Features Section */}
      <motion.section 
        id="features" 
        ref={featuresRef}
        className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 py-20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isFeaturesInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
            >
              Complete Startup Package in Minutes
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our intelligent AI agents work together to create everything you need for a successful startup launch
            </motion.p>
            
            {/* Feature Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {features.map((feature, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveFeature(index)}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    activeFeature === index
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-gray-800'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {feature.title}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Active Feature Display */}
          <motion.div 
            key={activeFeature}
            className="grid md:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <motion.div 
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${features[activeFeature].color} text-white mb-6 shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                {features[activeFeature].icon}
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{features[activeFeature].title}</h3>
              <p className="text-lg text-gray-600 mb-6">{features[activeFeature].description}</p>
              <ul className="space-y-3">
                {features[activeFeature].benefits.map((benefit, index) => (
                  <motion.li 
                    key={index}
                    className="flex items-center text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    {benefit}
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full w-1/3"></div>
                    <div className="text-sm text-gray-500">Processing...</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="flex items-center space-x-2 pt-4">
                    <motion.div 
                      className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Bot className="h-4 w-4 text-white" />
                    </motion.div>
                    <span className="text-sm text-gray-600">AI Agent Working...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* AI Agents Section */}
      <motion.section 
        id="about" 
        ref={agentsRef}
        className="py-20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isAgentsInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isAgentsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
            >
              Meet Your AI Team
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isAgentsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Six specialized AI agents work together to build your startup from idea to investment-ready
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent, index) => (
              <motion.div 
                key={index} 
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden group border border-gray-100"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={isAgentsInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 50 }}
                transition={{ 
                  duration: 0.6, 
                  delay: agent.delay,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02
                }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${agent.color.split(' ')[3]}, ${agent.color.split(' ')[6]})`
                  }}
                />
                
                <div className="flex items-center space-x-4 mb-4 relative z-10">
                  <motion.div 
                    className={`w-12 h-12 rounded-xl ${agent.color} shadow-lg flex items-center justify-center`}
                    animate={{ 
                      boxShadow: ["0 4px 6px rgba(0,0,0,0.1)", "0 8px 25px rgba(59, 130, 246, 0.3)", "0 4px 6px rgba(0,0,0,0.1)"]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: index * 0.5
                    }}
                  >
                    <Bot className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{agent.name}</h3>
                    <div className="flex items-center space-x-2">
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-green-500"
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed relative z-10">{agent.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Enhanced Pricing Section */}
      <motion.section 
        id="pricing" 
        ref={pricingRef}
        className="bg-gradient-to-r from-gray-50 to-blue-50 py-20 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={isPricingInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
            >
              Choose Your Growth Plan
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Start free and scale as you grow. All plans include our core AI agents and startup building tools.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                className={`relative bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-300 ${
                  plan.popular ? 'ring-4 ring-blue-500 ring-opacity-50 scale-105' : ''
                }`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={isPricingInView ? { opacity: 1, y: 0, scale: plan.popular ? 1.05 : 1 } : { opacity: 0, y: 50, scale: 0.9 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  y: -10,
                  scale: plan.popular ? 1.08 : 1.03,
                  boxShadow: "0 25px 50px rgba(0, 0, 0, 0.15)"
                }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 px-4">
                      <span className="font-semibold flex items-center justify-center">
                        <Star className="h-4 w-4 mr-2" />
                        Most Popular
                      </span>
                    </div>
                  </div>
                )}
                
                <div className={`p-8 ${plan.popular ? 'pt-16' : 'pt-8'}`}>
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r ${plan.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    {plan.name === 'Starter' && <Globe className="h-8 w-8 text-white" />}
                    {plan.name === 'Professional' && <Rocket className="h-8 w-8 text-white" />}
                    {plan.name === 'Enterprise' && <Shield className="h-8 w-8 text-white" />}
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6 min-h-[48px]">{plan.description}</p>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      {plan.price === 0 ? (
                        <span className="text-4xl font-bold text-gray-900">Free</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                          <span className="text-gray-600 ml-2">/{plan.period.split(' ')[1] || 'month'}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{plan.period}</p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex}
                        className="flex items-start"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isPricingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ delay: 0.5 + featureIndex * 0.1 }}
                      >
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={() => {
                        if (plan.name === 'Starter') {
                          onGetStarted();
                        } else if (plan.name === 'Professional') {
                          if (currentUser) {
                            onUpgradePlan('professional');
                          } else {
                            onGetStarted();
                          }
                        } else {
                          if (currentUser) {
                            onUpgradePlan('enterprise');
                          } else {
                            onGetStarted();
                          }
                        }
                      }}
                      className={`w-full py-4 text-lg font-semibold transition-all duration-300 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-blue-700 to-purple-700 text-white hover:from-blue-800 hover:to-purple-800 shadow-lg hover:shadow-xl'
                          : 'bg-gray-800 text-white hover:bg-gray-900'
                      }`}
                    >
                      {currentUser && plan.name !== 'Starter' ? `Upgrade to ${plan.name}` : plan.cta}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Trusted by Thousands of Entrepreneurs
            </motion.h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5, shadow: "0 25px 50px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Ready to Build Your Startup?
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Join thousands of entrepreneurs who've turned their ideas into successful businesses with Startify AI
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <span className="flex items-center">
                Start Building Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Startify AI</span>
              </div>
              <p className="text-gray-400">The intelligent way to build startups</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection('features')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('pricing')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onGetStarted} 
                    className="hover:text-white transition-colors text-left"
                  >
                    API Access
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => scrollToSection('about')} 
                    className="hover:text-white transition-colors text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onGetStarted} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onGetStarted} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Careers
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={onGetStarted} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onGetStarted} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button 
                    onClick={onGetStarted} 
                    className="hover:text-white transition-colors text-left"
                  >
                    Community
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 Startify AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}