import { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  CreditCard, 
  Smartphone, 
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Play
} from 'lucide-react';

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  details: string[];
  color: string;
}

export default function ProcessWalkthrough() {
  const [activeStep, setActiveStep] = useState(1);
  const [showVideo, setShowVideo] = useState(false);

  const steps: ProcessStep[] = [
    {
      id: 1,
      title: "Complete KYC Verification",
      description: "Verify your identity and business details through our comprehensive but simple process.",
      icon: <FileText className="w-8 h-8" />,
      duration: "5 minutes",
      details: [
        "Upload ID and business registration",
        "Provide business details and location",
        "Verify phone number with OTP",
        "Take a selfie for identity confirmation"
      ],
      color: "blue"
    },
    {
      id: 2,
      title: "Instant AI Assessment",
      description: "Our AI analyzes your application and provides immediate approval decision.",
      icon: <Zap className="w-8 h-8" />,
      duration: "30 seconds",
      details: [
        "Credit scoring using mobile money data",
        "Business assessment and risk analysis",
        "Automated approval/rejection decision",
        "Credit limit determination"
      ],
      color: "purple"
    },
    {
      id: 3,
      title: "Choose Your Goods",
      description: "Browse our supplier marketplace and select the goods you need for your business.",
      icon: <CreditCard className="w-8 h-8" />,
      duration: "10 minutes",
      details: [
        "Browse verified supplier catalogs",
        "Compare prices and quality",
        "Select goods within your credit limit",
        "Review and confirm your order"
      ],
      color: "green"
    },
    {
      id: 4,
      title: "Easy Daily Payments",
      description: "Pay just 5% of your loan daily from your business sales via mobile money.",
      icon: <Smartphone className="w-8 h-8" />,
      duration: "Ongoing",
      details: [
        "Automatic payment reminders via SMS",
        "Pay through M-Pesa, Airtel Money, or bank",
        "Track payments in real-time",
        "Build credit score with each payment"
      ],
      color: "orange"
    }
  ];

  const getStepColor = (step: ProcessStep, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600',
      purple: isActive ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600',
      green: isActive ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600',
      orange: isActive ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-600'
    };
    return colors[step.color as keyof typeof colors];
  };

  const getBorderColor = (step: ProcessStep) => {
    const colors = {
      blue: 'border-blue-200',
      purple: 'border-purple-200',
      green: 'border-green-200',
      orange: 'border-orange-200'
    };
    return colors[step.color as keyof typeof colors];
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl animate-fade-in-up">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-gray-900 mb-4">
          Simple 4-Step Process
        </h3>
        <p className="text-xl text-gray-600 mb-6">
          From application to funding in as little as 15 minutes
        </p>
        
        <button 
          onClick={() => setShowVideo(true)}
          className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Play className="w-5 h-5" />
          <span>Watch 90-second explainer</span>
        </button>
      </div>

      {/* Process Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            <div
              className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                activeStep === step.id
                  ? `${getBorderColor(step)} bg-gray-50 transform scale-105`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setActiveStep(step.id)}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`p-4 rounded-full mb-4 ${getStepColor(step, activeStep === step.id)}`}>
                  {step.icon}
                </div>
                
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{step.duration}</span>
                </div>
              </div>
            </div>

            {/* Connector Arrow */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active Step Details */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 rounded-lg ${getStepColor(steps[activeStep - 1], true)}`}>
            {steps[activeStep - 1].icon}
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              Step {activeStep}: {steps[activeStep - 1].title}
            </h4>
            <p className="text-gray-600">{steps[activeStep - 1].description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps[activeStep - 1].details.map((detail, index) => (
            <div 
              key={index} 
              className="flex items-center space-x-3 animate-slide-in-right"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-200">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h5 className="font-semibold text-gray-900 mb-1">Bank-Grade Security</h5>
          <p className="text-sm text-gray-600">256-bit SSL encryption</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Zap className="w-6 h-6 text-purple-600" />
          </div>
          <h5 className="font-semibold text-gray-900 mb-1">Instant Processing</h5>
          <p className="text-sm text-gray-600">AI-powered decisions</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h5 className="font-semibold text-gray-900 mb-1">CBK Licensed</h5>
          <p className="text-sm text-gray-600">Fully regulated platform</p>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">How JuaKali Lend Works</h3>
              <button
                onClick={() => setShowVideo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">Video player would be embedded here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
