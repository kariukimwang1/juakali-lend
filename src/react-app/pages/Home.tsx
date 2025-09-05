import { Link } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  TrendingUp, 
  Users,
  Smartphone,
  Play,
  Globe,
  Award,
  BarChart3
} from 'lucide-react';
import StatisticsCounter from '@/react-app/components/StatisticsCounter';
import TestimonialCarousel from '@/react-app/components/TestimonialCarousel';
import LiveActivityMap from '@/react-app/components/LiveActivityMap';
import CreditCalculator from '@/react-app/components/CreditCalculator';
import ProcessWalkthrough from '@/react-app/components/ProcessWalkthrough';
import LanguageSwitcher from '@/react-app/components/LanguageSwitcher';

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome back, {user.google_user_data?.given_name || user.google_user_data?.name || user.email?.split('@')[0] || 'User'}!
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
              <img 
                src="https://mocha-cdn.com/0199066b-560c-7592-afe1-52d8c7bcd567/juakali-lend-new-logo-horizontal.png" 
                alt="JuaKali Lend" 
                className="h-8 w-auto"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                {t('common.login')}
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('common.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="mb-8 flex justify-center lg:justify-start">
                <img 
                  src="https://mocha-cdn.com/0199066b-560c-7592-afe1-52d8c7bcd567/juakali-lend-new-logo.png" 
                  alt="JuaKali Lend" 
                  className="h-24 w-auto filter drop-shadow-2xl"
                />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {t('hero.title')} 
                <span className="text-yellow-300"> {t('hero.titleHighlight')}</span> 
                {t('hero.titleEnd')}
              </h1>
              <p className="text-xl mb-8 opacity-90 leading-relaxed">
                {t('hero.subtitle')}
              </p>
              
              {/* Role-based CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Link 
                  to="/register?type=retailer" 
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col items-center text-center group"
                >
                  <Smartphone className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{t('hero.cta.retailer')}</span>
                  <span className="text-xs opacity-70">{t('hero.cta.retailerSub')}</span>
                </Link>
                
                <Link 
                  to="/register?type=lender" 
                  className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col items-center text-center group border border-white border-opacity-30"
                >
                  <TrendingUp className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{t('hero.cta.lender')}</span>
                  <span className="text-xs opacity-70">{t('hero.cta.lenderSub')}</span>
                </Link>
                
                <Link 
                  to="/register?type=supplier" 
                  className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex flex-col items-center text-center group border border-white border-opacity-30"
                >
                  <BarChart3 className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm">{t('hero.cta.supplier')}</span>
                  <span className="text-xs opacity-70">{t('hero.cta.supplierSub')}</span>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/register" 
                  className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 group"
                >
                  <span>{t('hero.startApplication')}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 group">
                  <Play className="w-5 h-5" />
                  <span>{t('common.watchDemo')}</span>
                </button>
              </div>
            </div>
            
            {/* Hero Dashboard Preview */}
            <div className="relative animate-slide-in-right">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 border border-white border-opacity-20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm opacity-80">Live Dashboard</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs">Real-time</span>
                    </div>
                  </div>
                  
                  <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                    <p className="text-sm opacity-80 mb-2">Platform Activity</p>
                    <StatisticsCounter />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                      <p className="text-xs opacity-80 mb-1">Avg. Approval</p>
                      <p className="text-lg font-semibold">5 mins</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                      <p className="text-xs opacity-80 mb-1">Daily Returns</p>
                      <p className="text-lg font-semibold">5%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse-subtle"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('features.quickApproval.title')}</h3>
              <p className="text-gray-600">{t('features.quickApproval.description')}</p>
            </div>
            
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('features.noCollateral.title')}</h3>
              <p className="text-gray-600">{t('features.noCollateral.description')}</p>
            </div>
            
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('features.buildCredit.title')}</h3>
              <p className="text-gray-600">{t('features.buildCredit.description')}</p>
            </div>
            
            <div className="text-center group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-orange-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('features.mobileFirst.title')}</h3>
              <p className="text-gray-600">{t('features.mobileFirst.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Calculator Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('calculator.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('calculator.subtitle')}
            </p>
          </div>
          
          <CreditCalculator />
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProcessWalkthrough />
        </div>
      </section>

      {/* Live Statistics Dashboard */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('statistics.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('statistics.subtitle')}
            </p>
          </div>
          
          <LiveActivityMap />
        </div>
      </section>

      {/* Social Proof & Testimonials */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('testimonials.title')}</h2>
            <p className="text-xl text-gray-300">{t('testimonials.subtitle')}</p>
          </div>
          
          {/* Animated Statistics */}
          <div className="mb-16">
            <StatisticsCounter />
          </div>

          {/* Awards & Recognition */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-yellow-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">Best Fintech 2024</h4>
              <p className="text-sm text-gray-400">Kenya Fintech Awards</p>
            </div>
            
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">CBK Licensed</h4>
              <p className="text-sm text-gray-400">Central Bank of Kenya</p>
            </div>
            
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">ISO 27001</h4>
              <p className="text-sm text-gray-400">Security Certified</p>
            </div>
            
            <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold mb-2">50K+ Users</h4>
              <p className="text-sm text-gray-400">Growing Daily</p>
            </div>
          </div>
          
          {/* Enhanced Testimonial Carousel */}
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">{t('footer.description')}</h2>
          <p className="text-xl mb-8 opacity-90">
            {t('testimonials.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2 group"
            >
              <span>{t('common.getStarted')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center"
            >
              {t('common.alreadyCustomer')}
            </Link>
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
                Empowering Kenya's entrepreneurs with accessible, fair, and fast credit solutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Business Loans</li>
                <li>Working Capital</li>
                <li>Equipment Financing</li>
                <li>Credit Building</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Loan Calculator</li>
                <li>FAQs</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Licensing</li>
                <li>Complaints</li>
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
