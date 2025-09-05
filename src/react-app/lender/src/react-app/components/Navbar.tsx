import { motion } from 'framer-motion';
import { 
  BellIcon, 
  UserCircleIcon, 
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SunIcon,
  MoonIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

interface NavbarProps {
  lenderName?: string;
  notifications?: number;
}

export default function Navbar({ lenderName = "John Investor", notifications = 3 }: NavbarProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const { t, currentLanguage, changeLanguage, languages } = useLanguage();

  return (
    <motion.nav 
      className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-6 py-4 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="flex items-center justify-between">
        {/* Search Section */}
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder={t('common.search')}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder-slate-400 text-slate-700"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <div className="relative">
            <motion.button
              onClick={() => setShowLanguages(!showLanguages)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <GlobeAltIcon className="w-5 h-5 text-slate-600" />
            </motion.button>

            {/* Language Dropdown */}
            {showLanguages && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50"
              >
                <div className="p-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setShowLanguages(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all ${
                        currentLanguage === lang.code
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Theme Toggle */}
          <motion.button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5 text-slate-600" />
            ) : (
              <MoonIcon className="w-5 h-5 text-slate-600" />
            )}
          </motion.button>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BellIcon className="w-5 h-5 text-slate-600" />
              {notifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {notifications}
                </motion.span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-100">
                  <h3 className="font-semibold text-slate-800">{t('common.notifications')}</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[
                    { type: 'payment', message: t('notifications.paymentReceived', { retailer: 'Electronics Store Ltd' }), time: '2 min ago', urgent: false },
                    { type: 'risk', message: t('notifications.riskAlert', { retailer: 'Fashion Boutique' }), time: '15 min ago', urgent: true },
                    { type: 'opportunity', message: t('notifications.newOpportunity'), time: '1 hour ago', urgent: false }
                  ].map((notification, index) => (
                    <div key={index} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-all ${notification.urgent ? 'bg-red-50/50' : ''}`}>
                      <p className="text-sm text-slate-700 mb-1">{notification.message}</p>
                      <p className="text-xs text-slate-500">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-slate-100">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Settings */}
          <motion.button
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Cog6ToothIcon className="w-5 h-5 text-slate-600" />
          </motion.button>

          {/* Profile */}
          <div className="relative">
            <motion.button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <UserCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-slate-700">{lenderName}</p>
                <p className="text-xs text-slate-500">Premium Lender</p>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-slate-400" />
            </motion.button>

            {/* Profile Dropdown */}
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-100">
                  <p className="font-medium text-slate-800">{lenderName}</p>
                  <p className="text-sm text-slate-500">john.investor@email.com</p>
                </div>
                <div className="p-2">
                  {[
                    'Profile Settings',
                    'Portfolio Analytics',
                    'Billing & Payments',
                    'Security Settings',
                    'Help & Support'
                  ].map((item, index) => (
                    <button key={index} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-all">
                      {item}
                    </button>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100">
                  <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    {t('common.signOut')}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
