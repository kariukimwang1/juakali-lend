import { useState } from "react";
import { Bell, Search, Menu, X, Globe, ChevronDown } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import { useLanguage } from "@/react-app/hooks/useLanguage";

interface TopBarProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function TopBar({ onMobileMenuToggle, isMobileMenuOpen }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: 'en' | 'sw') => {
    setLanguage(lang);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <div className="md:pl-64 flex flex-col flex-1">
      <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <button
          type="button"
          className="px-4 border-r border-slate-200 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
          onClick={onMobileMenuToggle}
        >
          <span className="sr-only">Open sidebar</span>
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
        
        <div className="flex-1 px-4 flex justify-between items-center">
          <div className="flex-1 flex items-center">
            <div className="w-full max-w-lg lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50/50 text-slate-900 placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder={language === 'en' ? 'Search products, orders, customers...' : 'Tafuta bidhaa, maagizo, wateja...'}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="ml-4 flex items-center md:ml-6 space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-1 bg-white/50 p-2 rounded-xl text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${language === 'en' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange('sw')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${language === 'sw' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}
                  >
                    Kiswahili
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative bg-white/50 p-2 rounded-xl text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>
            
            <div className="relative">
              <div className="flex items-center space-x-3">
                <span className="hidden md:block text-sm font-medium text-slate-700">
                  {language === 'en' ? 'Good morning! 👋' : 'Habari za asubuhi! 👋'}
                </span>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <NotificationPanel 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </div>
  );
}
