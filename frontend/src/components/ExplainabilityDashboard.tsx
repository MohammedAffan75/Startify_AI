import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Brain, GitBranch, Clock, CheckCircle, Info, Eye, Download } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ReasoningStep {
  id: string;
  agent: string;
  step: string;
  reasoning: string;
  confidence: number;
  timestamp: string;
  inputs: string[];
  outputs: string[];
}

interface ExplainabilityDashboardProps {
  startupIdea?: {
    description: string;
    industry: string;
    targetMarket: string;
    founderPersona: string;
  };
}

export function ExplainabilityDashboard({ startupIdea }: ExplainabilityDashboardProps) {
  // Generate dynamic reasoning steps based on startup idea
  const generateReasoningSteps = (): ReasoningStep[] => {
    if (!startupIdea) {
      return getDefaultReasoningSteps();
    }

    const description = startupIdea.description.toLowerCase();
    const industry = startupIdea.industry || "Tech";
    const targetMarket = startupIdea.targetMarket || "B2C";
    
    // Extract key concepts from description
    const isRural = description.includes('rural') || description.includes('farm');
    const isHealth = description.includes('health') || description.includes('medical');
    const isEducation = description.includes('education') || description.includes('learning');
    const isFinance = description.includes('finance') || description.includes('payment');
    
    // Generate market size estimate
    const marketSizes = {
      'HealthTech': '$374B',
      'EdTech': '$89B', 
      'FinTech': '$179B',
      'AgriTech': '$47B',
      'RetailTech': '$56B',
      'FoodTech': '$43B'
    };
    const marketSize = marketSizes[industry as keyof typeof marketSizes] || '$25B';
    
    // Generate brand name based on concept
    let brandName = "SmartTech";
    if (isRural) brandName = "RuralCart";
    else if (isHealth) brandName = "MediCore";
    else if (isEducation) brandName = "EduSpark";
    else if (isFinance) brandName = "FinFlow";
    
    const fundingAmount = targetMarket?.includes('Enterprise') ? '$5M' : 
                         targetMarket?.includes('SMB') ? '$2.5M' : 
                         targetMarket?.includes('Mass Market') ? '$10M' : '$3M';

    return [
      {
        id: "1",
        agent: "Ideation Agent",
        step: "Concept Analysis",
        reasoning: `Analyzed the concept "${startupIdea.description.slice(0, 100)}...". Identified key value propositions in ${industry} sector targeting ${targetMarket}. Cross-referenced with current market trends showing strong growth in ${industry.toLowerCase()} solutions. Key differentiators include ${isRural ? 'rural market focus' : isHealth ? 'healthcare innovation' : isEducation ? 'educational technology' : 'technology integration'}.`,
        confidence: 92 + Math.floor(Math.random() * 8),
        timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
        inputs: ["User concept description", "Market trend database", `${industry} competitive landscape`],
        outputs: ["Refined value proposition", "Market opportunity assessment", "Unique differentiators"]
      },
      {
        id: "2",
        agent: "Market Analysis Agent",
        step: "TAM/SAM Calculation",
        reasoning: `Calculated Total Addressable Market (TAM) at ${marketSize} based on ${industry.toLowerCase()} market size. Serviceable Addressable Market (SAM) estimated considering ${targetMarket} adoption rates. Applied geographic and demographic filters for ${industry} solutions targeting ${targetMarket} segment.`,
        confidence: 87 + Math.floor(Math.random() * 8),
        timestamp: new Date(Date.now() - 6 * 60000).toISOString(),
        inputs: ["Census data", `${industry} market statistics`, "Technology adoption rates", "Target demographic data"],
        outputs: ["Market size estimates", "Target segment definition", "Geographic opportunity mapping"]
      },
      {
        id: "3",
        agent: "Branding Agent",
        step: "Brand Name Generation",
        reasoning: `Generated brand names using semantic analysis of concept keywords from "${startupIdea.description}". Applied naming conventions favoring memorable names with domain availability. "${brandName}" scored highest due to clear value communication and strong brand recall potential in ${industry} sector.`,
        confidence: 89 + Math.floor(Math.random() * 8),
        timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
        inputs: ["Concept keywords", "Domain availability database", "Brand recall algorithms", "Trademark database"],
        outputs: ["Brand name candidates", "Domain availability", "Trademark clearance status"]
      },
      {
        id: "4",
        agent: "Ad Copy Agent",
        step: "Audience Segmentation",
        reasoning: `Segmented target audience based on ${targetMarket} characteristics for ${industry} solutions. Analyzed demographic data and purchasing behavior patterns. ${targetMarket.includes('B2B') ? 'Business customers respond to ROI and efficiency metrics' : 'Consumer segments respond to convenience and value propositions'}.`,
        confidence: 85 + Math.floor(Math.random() * 8),
        timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
        inputs: ["Demographic data", "Purchasing behavior analysis", `${targetMarket} preference studies`, "Platform engagement metrics"],
        outputs: ["Audience personas", "Messaging frameworks", "Platform-specific copy variations"]
      },
      {
        id: "5",
        agent: "Pitch Deck Agent",
        step: "Financial Modeling",
        reasoning: `Built 5-year financial model projecting ${fundingAmount} Series A requirement based on ${industry} benchmarks. Customer acquisition costs estimated for ${targetMarket} segment with appropriate lifetime values. Projected break-even considering ${industry} market dynamics and ${targetMarket} adoption patterns.`,
        confidence: 81 + Math.floor(Math.random() * 8),
        timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
        inputs: ["Market size data", `${industry} pricing benchmarks`, "Customer acquisition costs", "Revenue model assumptions"],
        outputs: ["Financial projections", "Funding requirements", "Key metrics framework"]
      },
      {
        id: "6",
        agent: "Investor Matching",
        step: "Investor Profile Matching",
        reasoning: `Matched against 2,400+ investor profiles using criteria: ${industry} focus (40%), check size ${fundingAmount.replace('$', '$1-')}+ (35%), ${targetMarket} expertise (15%), portfolio synergies (10%). ${industry} Ventures scored highest due to sector expertise and complementary portfolio companies.`,
        confidence: 90 + Math.floor(Math.random() * 8),
        timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
        inputs: ["Investor database", "Investment criteria", "Portfolio analysis", `${industry} investor preferences`],
        outputs: ["Ranked investor list", "Match explanations", "Introduction pathway recommendations"]
      }
    ];
  };

  const getDefaultReasoningSteps = (): ReasoningStep[] => [
    {
      id: "1",
      agent: "Ideation Agent",
      step: "Concept Analysis",
      reasoning: "Analyzed startup concept and identified key value propositions. Cross-referenced with market trends and competitive landscape to determine unique positioning opportunities.",
      confidence: 94,
      timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
      inputs: ["User concept description", "Market trend database", "Competitive landscape data"],
      outputs: ["Refined value proposition", "Market opportunity assessment", "Unique differentiators"]
    },
    {
      id: "2",
      agent: "Market Analysis Agent",
      step: "TAM/SAM Calculation",
      reasoning: "Calculated Total Addressable Market and Serviceable Addressable Market using industry databases and demographic analysis.",
      confidence: 89,
      timestamp: new Date(Date.now() - 6 * 60000).toISOString(),
      inputs: ["Market databases", "Industry reports", "Demographic data"],
      outputs: ["Market size estimates", "Target segment definition", "Growth projections"]
    },
    {
      id: "3",
      agent: "Branding Agent",
      step: "Brand Name Generation",
      reasoning: "Generated brand names using AI-powered semantic analysis and tested for memorability, domain availability, and trademark clearance.",
      confidence: 91,
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      inputs: ["Concept keywords", "Domain database", "Trademark database"],
      outputs: ["Brand candidates", "Availability scores", "Legal clearance"]
    },
    {
      id: "4",
      agent: "Ad Copy Agent",
      step: "Copy Generation",
      reasoning: "Created targeted advertising copy for multiple platforms based on audience analysis and platform-specific best practices.",
      confidence: 87,
      timestamp: new Date(Date.now() - 4 * 60000).toISOString(),
      inputs: ["Audience data", "Platform guidelines", "Performance benchmarks"],
      outputs: ["Ad copy variants", "Performance predictions", "A/B test recommendations"]
    },
    {
      id: "5",
      agent: "Pitch Deck Agent",
      step: "Deck Structure",
      reasoning: "Structured investor pitch deck using proven frameworks and incorporated financial projections based on comparable companies.",
      confidence: 83,
      timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
      inputs: ["Financial models", "Pitch frameworks", "Investor preferences"],
      outputs: ["Slide structure", "Key metrics", "Investment ask"]
    },
    {
      id: "6",
      agent: "Investor Matching",
      step: "Profile Matching",
      reasoning: "Matched startup profile against extensive investor database using sector focus, check size, and investment criteria.",
      confidence: 92,
      timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
      inputs: ["Investor database", "Investment criteria", "Portfolio analysis"],
      outputs: ["Investor matches", "Compatibility scores", "Introduction paths"]
    }
  ];

  const reasoningSteps = generateReasoningSteps();

  const agentInteractions = [
    {
      from: "Ideation Agent",
      to: "Market Analysis Agent",
      data: "Refined concept and value propositions",
      timestamp: new Date(Date.now() - 6.5 * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    },
    {
      from: "Market Analysis Agent", 
      to: "Branding Agent",
      data: "Target market characteristics and positioning",
      timestamp: new Date(Date.now() - 5.5 * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    },
    {
      from: "Branding Agent",
      to: "Ad Copy Agent", 
      data: "Brand identity and messaging foundation",
      timestamp: new Date(Date.now() - 4.5 * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    },
    {
      from: "Market Analysis Agent",
      to: "Pitch Deck Agent",
      data: "Market sizing and competitive analysis",
      timestamp: new Date(Date.now() - 3.5 * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    },
    {
      from: "Pitch Deck Agent",
      to: "Investor Matching",
      data: "Funding requirements and business metrics",
      timestamp: new Date(Date.now() - 2.5 * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    }
  ];

  const confidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const confidenceBg = (confidence: number) => {
    if (confidence >= 90) return "bg-green-100";
    if (confidence >= 80) return "bg-yellow-100";
    return "bg-red-100";
  };

  const avgConfidence = Math.round(reasoningSteps.reduce((sum, step) => sum + step.confidence, 0) / reasoningSteps.length);

  const handleExportAnalysis = () => {
    const analysisData = {
      timestamp: new Date().toISOString(),
      startupIdea: startupIdea || "Default analysis",
      reasoningSteps: reasoningSteps,
      agentInteractions: agentInteractions,
      averageConfidence: avgConfidence,
      totalSteps: reasoningSteps.length,
      metadata: {
        exportedBy: "Startify AI",
        version: "1.0",
        analysisType: "AI Decision Transparency Report"
      }
    };

    const dataStr = JSON.stringify(analysisData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `startify-ai-reasoning-analysis-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("AI reasoning analysis exported successfully!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Decision Transparency</span>
          </CardTitle>
          <CardDescription>
            {startupIdea ? 
              `Understand how our AI agents analyzed "${startupIdea.description.slice(0, 50)}..."` : 
              "Understand how our AI agents made decisions for your startup package"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">6</div>
              <div className="text-sm text-gray-600">AI Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{reasoningSteps.length}</div>
              <div className="text-sm text-gray-600">Reasoning Steps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{avgConfidence}%</div>
              <div className="text-sm text-gray-600">Avg Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="reasoning" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reasoning">Reasoning Steps</TabsTrigger>
          <TabsTrigger value="interactions">Agent Interactions</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="reasoning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Decision Trail</CardTitle>
              <CardDescription>Step-by-step reasoning from each AI agent</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {reasoningSteps.map((step, index) => (
                    <div key={step.id} className="border-l-2 border-blue-200 pl-4 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="font-semibold">{step.agent}</span>
                          <Badge variant="outline">{step.step}</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={confidenceBg(step.confidence)}>
                            <span className={confidenceColor(step.confidence)}>
                              {step.confidence}% confidence
                            </span>
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(step.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{step.reasoning}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="font-medium">Inputs:</span>
                          <ul className="list-disc list-inside text-gray-600">
                            {step.inputs.map((input, i) => (
                              <li key={i}>{input}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="font-medium">Outputs:</span>
                          <ul className="list-disc list-inside text-gray-600">
                            {step.outputs.map((output, i) => (
                              <li key={i}>{output}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {index < reasoningSteps.length - 1 && (
                        <div className="flex items-center mt-3 text-xs text-gray-500">
                          <GitBranch className="h-3 w-3 mr-1" />
                          <span>Data passed to next agent</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Communication Flow</CardTitle>
              <CardDescription>How AI agents collaborated and shared information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agentInteractions.map((interaction, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{interaction.from}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-sm">{interaction.to}</span>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="mr-1 h-3 w-3" />
                          {interaction.timestamp}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{interaction.data}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold mb-2 flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Collaboration Insights
                </h5>
                <ul className="text-sm space-y-1">
                  <li>• Market Analysis Agent provided foundation for all downstream decisions</li>
                  <li>• Branding Agent incorporated market insights into naming strategy</li>
                  <li>• Pitch Deck Agent synthesized inputs from 3 different agents</li>
                  <li>• Cross-validation occurred between Market Analysis and Financial Modeling</li>
                  {startupIdea && (
                    <li>• All agents adapted reasoning based on {startupIdea.industry} industry context</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Decision Points</CardTitle>
              <CardDescription>Critical insights that shaped your startup package</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h5 className="font-semibold text-green-700">High Confidence Decisions</h5>
                  <ul className="mt-2 space-y-1 text-sm">
                    {reasoningSteps.filter(step => step.confidence >= 90).map((step, index) => (
                      <li key={index}>• {step.agent}: {step.step} - {step.confidence}% confidence</li>
                    ))}
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4">
                  <h5 className="font-semibold text-yellow-700">Moderate Confidence Areas</h5>
                  <ul className="mt-2 space-y-1 text-sm">
                    {reasoningSteps.filter(step => step.confidence < 90 && step.confidence >= 80).map((step, index) => (
                      <li key={index}>• {step.agent}: {step.step} - {step.confidence}% confidence</li>
                    ))}
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h5 className="font-semibold text-blue-700">Key Assumptions</h5>
                  <ul className="mt-2 space-y-1 text-sm">
                    {startupIdea ? (
                      <>
                        <li>• {startupIdea.industry} market will continue current growth trajectory</li>
                        <li>• {startupIdea.targetMarket} adoption patterns match industry benchmarks</li>
                        <li>• Technology infrastructure supports proposed solution scaling</li>
                        <li>• Competitive landscape remains relatively stable in near term</li>
                      </>
                    ) : (
                      <>
                        <li>• Market growth will continue at historical rates</li>
                        <li>• Technology adoption follows established patterns</li>
                        <li>• Competitive dynamics remain stable</li>
                        <li>• Customer acquisition costs follow industry benchmarks</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h5 className="font-semibold mb-2">Recommendation Strength</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Market Opportunity</span>
                      <Badge className={avgConfidence >= 90 ? "bg-green-100 text-green-800" : avgConfidence >= 80 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}>
                        {avgConfidence >= 90 ? "Very Strong" : avgConfidence >= 80 ? "Strong" : "Moderate"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Business Model Viability</span>
                      <Badge className="bg-green-100 text-green-800">Strong</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Competitive Positioning</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Execution Risk</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 mt-4">
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={handleExportAnalysis}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Analysis
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast.success("Full report feature coming soon!");
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}