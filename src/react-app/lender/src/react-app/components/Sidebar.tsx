import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  DocumentChartBarIcon,
  BeakerIcon,
  GlobeAltIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const getMenuItems = (t: any) => [
  { id: 'dashboard', label: t('nav.portfolioOverview'), icon: HomeIcon, category: 'main' },
  { id: 'investments', label: t('nav.investmentManagement'), icon: CurrencyDollarIcon, category: 'main' },
  { id: 'deals', label: t('nav.dealFlow'), icon: ClipboardDocumentListIcon, category: 'main' },
  { id: 'risk', label: t('nav.riskManagement'), icon: ExclamationTriangleIcon, category: 'main' },
  { id: 'suppliers', label: t('nav.suppliers'), icon: TruckIcon, category: 'relationships' },
  { id: 'cash-flow', label: t('nav.cashFlow'), icon: ChartBarIcon, category: 'finance' },
  { id: 'orders', label: t('nav.orderTracking'), icon: BuildingStorefrontIcon, category: 'operations' },
  { id: 'analytics', label: t('nav.analytics'), icon: DocumentChartBarIcon, category: 'insights' },
  { id: 'alerts', label: t('nav.alerts'), icon: BellIcon, category: 'management' },
  { id: 'automation', label: t('nav.automation'), icon: BeakerIcon, category: 'advanced' },
  { id: 'mobile', label: t('nav.mobileTools'), icon: GlobeAltIcon, category: 'tools' },
  { id: 'security', label: t('nav.security'), icon: ShieldCheckIcon, category: 'management' },
  { id: 'education', label: t('nav.education'), icon: AcademicCapIcon, category: 'resources' },
  { id: 'community', label: t('nav.community'), icon: UserGroupIcon, category: 'social' },
  { id: 'settings', label: t('nav.settings'), icon: CogIcon, category: 'management' }
];

const categories = {
  main: 'Core Features',
  relationships: 'Relationships', 
  finance: 'Finance',
  operations: 'Operations',
  insights: 'Analytics',
  advanced: 'Advanced',
  tools: 'Tools',
  management: 'Management',
  resources: 'Resources',
  social: 'Social'
};

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { t } = useLanguage();
  const menuItems = getMenuItems(t);

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <motion.div 
      className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white h-screen border-r border-slate-700/50 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <CurrencyDollarIcon className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                LendFlow
              </h1>
              <p className="text-xs text-slate-400">Goods Lending Platform</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-6 -right-3 w-6 h-6 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          <motion.div
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ←
          </motion.div>
        </button>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-100px)] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="space-y-2">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2">
                {categories[category as keyof typeof categories]}
              </h3>
            )}
            {items.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                  whileHover={{ x: isActive ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  {!isCollapsed && (
                    <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {item.label}
                    </span>
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-20"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
