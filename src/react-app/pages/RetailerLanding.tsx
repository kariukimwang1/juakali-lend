import { Link } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  Calculator,
  Smartphone,
  CheckCircle,
  Star,
  Users,
  Zap,
  DollarSign,
  ShoppingCart,
  BarChart3,
  CreditCard,
  Play,
  MessageCircle,
  Headphones
} from 'lucide-react';
import CreditCalculator from '@/react-app/components/CreditCalculator';

export default function RetailerLandingPage() {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome back, {user.google_user_data.given_name}!
            </h1>
            <Link 
              to="/dashboard" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/">
                <img 
                  src="https://mocha-cdn.com/0199066b-560c-7592-afe1-52d8c7bcd567/juakali-lend-new-logo-horizontal.png" 
                  alt="JuaKali Lend" 
                  className="h-8 w-auto"
                />
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/lender" className="text-gray-600 hover:text-gray-900 text-sm">For Lenders</Link>
              <Link to="/supplier" className="text-gray-600 hover:text-gray-900 text-sm">For Suppliers</Link>
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </Link>
              <Link 
                to="/register?type=retailer" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Retailer Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 px-4 py-2 rounded-full mb-6">
                <ShoppingCart className="w-4 h-4" />
                <span className="text-sm font-medium">For Retailers</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Stock Your Shop Now,
                <span className="text-yellow-300"> Pay from Daily Sales</span>
              </h1>
              
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                Get the goods you need without upfront payment. Pay just 5% daily from your sales. 
                No collateral, no fixed installments - just flexible financing that works with your business flow.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">5 Min</div>
                  <div className="text-sm opacity-80">Application</div>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">Instant</div>
                  <div className="text-sm opacity-80">Approval</div>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-lg text-center">
                  <DollarSign className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-semibold">5%</div>
                  <div className="text-sm opacity-80">Daily Payment</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register?type=retailer" 
                  className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 group"
                >
                  <span>Apply for Credit</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 group">
                  <Calculator className="w-5 h-5" />
                  <span>Calculate Credit Limit</span>
                </button>
              </div>
            </div>
            
            {/* Success Story Spotlight */}
            <div className="relative animate-slide-in-right">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80"
                    alt="Mary Wanjiku"
                    className="w-16 h-16 rounded-full object-cover border-2 border-white border-opacity-30"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">Mary Wanjiku</h3>
                    <p className="text-sm opacity-80">Electronics Shop, Kibera</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <blockquote className="text-lg mb-6 italic">
                  "I got KES 25,000 to stock my shop and paid it back in just 3 weeks from my daily sales. 
                  No stress, no pressure - just business growth!"
                </blockquote>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <div className="text-sm opacity-80">Credit Limit</div>
                    <div className="font-bold">KES 50,000</div>
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <div className="text-sm opacity-80">Sales Growth</div>
                    <div className="font-bold">+40%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse-subtle"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Credit Calculator Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See What You Qualify For
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get an instant estimate of your credit limit based on your business type and monthly sales
            </p>
          </div>
          
          <CreditCalculator />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Retailers Choose JuaKali Lend
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to grow your retail business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Access</h3>
              <p className="text-gray-600">No collateral required, digital approval in minutes, not days.</p>
            </div>
            
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Repayment</h3>
              <p className="text-gray-600">Pay 5% daily from sales, no fixed installments that stress your cash flow.</p>
            </div>
            
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Credit Growth</h3>
              <p className="text-gray-600">Build your credit score and qualify for larger amounts over time.</p>
            </div>
            
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <ShoppingCart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Supplier Network</h3>
              <p className="text-gray-600">Access to multiple quality suppliers with competitive prices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works for Retailers
            </h2>
            <p className="text-xl text-gray-600">
              From application to stocking your shop in 4 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: 1,
                title: "Apply in 5 Minutes",
                description: "Complete our simple application with your business details and verification documents.",
                icon: <CreditCard className="w-8 h-8" />,
                color: "blue"
              },
              {
                step: 2,
                title: "Get Instant Approval",
                description: "Our AI reviews your application and provides immediate credit decision and limit.",
                icon: <Zap className="w-8 h-8" />,
                color: "purple"
              },
              {
                step: 3,
                title: "Choose Your Goods",
                description: "Browse our supplier marketplace and select the inventory you need for your shop.",
                icon: <ShoppingCart className="w-8 h-8" />,
                color: "green"
              },
              {
                step: 4,
                title: "Pay from Sales",
                description: "Pay just 5% of the loan amount daily from your business sales via mobile money.",
                icon: <Smartphone className="w-8 h-8" />,
                color: "orange"
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-lg animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`bg-${item.color}-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <div className={`text-${item.color}-600`}>
                      {item.icon}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className={`bg-${item.color}-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold`}>
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
                
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Manage Everything from Your Phone
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our mobile-optimized platform gives you complete control over your credit, 
                payments, and business growth - all from your smartphone.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    icon: <Smartphone className="w-6 h-6 text-blue-600" />,
                    title: "Mobile-First Design",
                    description: "Optimized for smartphones with intuitive touch interface"
                  },
                  {
                    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
                    title: "Real-Time Tracking",
                    description: "Monitor your credit limit, payments, and account status live"
                  },
                  {
                    icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
                    title: "SMS Notifications",
                    description: "Get payment reminders and updates via SMS"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative animate-slide-in-right">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-semibold mb-6">Retailer Dashboard Preview</h3>
                <div className="space-y-4">
                  <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm opacity-80">Available Credit</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold">KES 45,000</div>
                  </div>
                  
                  <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                    <div className="text-sm opacity-80 mb-2">Next Payment</div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">KES 1,250</span>
                      <span className="text-sm">in 2 days</span>
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                    <div className="text-sm opacity-80 mb-2">Credit Score</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-lg font-semibold">750</div>
                      <div className="text-sm text-green-300">+25 this month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Support When You Need It
            </h2>
            <p className="text-xl text-gray-600">
              We're here to help you succeed every step of the way
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600 text-sm mb-4">Chat, phone, and WhatsApp support available round the clock</p>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Get Help</button>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Business Training</h3>
              <p className="text-gray-600 text-sm mb-4">Free resources and training to help grow your business</p>
              <button className="text-green-600 hover:text-green-800 font-medium text-sm">Learn More</button>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 text-sm mb-4">Connect with other retailers and share experiences</p>
              <button className="text-purple-600 hover:text-purple-800 font-medium text-sm">Join Community</button>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Play className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Guides</h3>
              <p className="text-gray-600 text-sm mb-4">Step-by-step video tutorials for every feature</p>
              <button className="text-orange-600 hover:text-orange-800 font-medium text-sm">Watch Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Stock Your Shop?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of retailers who have grown their businesses with JuaKali Lend. 
            Apply now and get approved in minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register?type=retailer" 
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 group"
            >
              <span>Apply for Credit Now</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              Already Applied? Login
            </Link>
          </div>
          
          <div className="mt-8 text-sm opacity-80">
            <p>🔒 Secure application • ⚡ 5-minute approval • 📱 Mobile-friendly</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src="https://mocha-cdn.com/0199066b-560c-7592-afe1-52d8c7bcd567/juakali-lend-new-logo-horizontal.png" 
                alt="JuaKali Lend" 
                className="h-8 w-auto mb-4 filter brightness-0 invert opacity-80"
              />
              <p className="text-gray-400">
                Empowering Kenya's retailers with accessible, fair, and fast credit solutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Retailers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Apply for Credit</li>
                <li>Credit Calculator</li>
                <li>Supplier Marketplace</li>
                <li>Business Training</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Video Tutorials</li>
                <li>Community Forum</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>CBK Licensing</li>
                <li>Complaints Process</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 JuaKali Lend. All rights reserved. Licensed by Central Bank of Kenya.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
