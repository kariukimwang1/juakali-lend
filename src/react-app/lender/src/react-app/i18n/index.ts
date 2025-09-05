import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.portfolioOverview': 'Portfolio Overview',
      'nav.investmentManagement': 'Investment Management',
      'nav.dealFlow': 'Deal Flow',
      'nav.riskManagement': 'Risk Management',
      'nav.suppliers': 'Suppliers',
      'nav.cashFlow': 'Cash Flow',
      'nav.orderTracking': 'Order Tracking',
      'nav.analytics': 'Analytics',
      'nav.alerts': 'Alerts',
      'nav.automation': 'Automation',
      'nav.mobileTools': 'Mobile Tools',
      'nav.security': 'Security',
      'nav.education': 'Education',
      'nav.community': 'Community',
      'nav.settings': 'Settings',
      
      // Dashboard
      'dashboard.title': 'Portfolio Overview',
      'dashboard.subtitle': 'Monitor your goods lending portfolio performance and manage investments',
      'dashboard.totalCapitalDeployed': 'Total Capital Deployed',
      'dashboard.activeLoans': 'Active Loans',
      'dashboard.dailyCollectionRate': 'Daily Collection Rate',
      'dashboard.portfolioYield': 'Portfolio Yield',
      'dashboard.fundNewLoan': 'Fund New Loan',
      'dashboard.exportReport': 'Export Report',
      'dashboard.recentLoans': 'Recent Loans',
      'dashboard.alertsNotifications': 'Alerts & Notifications',
      
      // Investment Management
      'investments.title': 'Investment Management',
      'investments.subtitle': 'Automate your lending strategy and manage capital deployment',
      'investments.availableCapital': 'Available Capital',
      'investments.autoDeployToday': 'Auto-Deploy Today',
      'investments.pendingReview': 'Pending Review',
      'investments.activeRules': 'Active Rules',
      'investments.createNewRule': 'Create New Rule',
      'investments.autoLendingRules': 'Auto-Lending Rules',
      'investments.manageRules': 'Manage Rules',
      'investments.pendingDeployments': 'Pending Deployments',
      'investments.portfolioStrategy': 'Portfolio Strategy',
      
      // Common
      'common.approve': 'Approve',
      'common.reject': 'Reject',
      'common.viewAll': 'View All',
      'common.deployed': 'Deployed',
      'common.active': 'Active',
      'common.overdue': 'Overdue',
      'common.days': 'days',
      'common.notifications': 'Notifications',
      'common.profile': 'Profile',
      'common.search': 'Search loans, retailers, suppliers...',
      'common.signOut': 'Sign Out',
      
      // Notifications
      'notifications.paymentReceived': 'Daily payment received from {{retailer}}',
      'notifications.riskAlert': 'Risk alert: Late payment from {{retailer}}',
      'notifications.newOpportunity': 'New high-quality loan request available',
      'notifications.markAsRead': 'Mark as Read',
      'notifications.markAsUnread': 'Mark as Unread',
      'notifications.deleteNotification': 'Delete',
      'notifications.noNotifications': 'No notifications available',
      
      // Profile
      'profile.settings': 'Profile Settings',
      'profile.portfolioAnalytics': 'Portfolio Analytics',
      'profile.billingPayments': 'Billing & Payments',
      'profile.securitySettings': 'Security Settings',
      'profile.helpSupport': 'Help & Support',
      'profile.personalInfo': 'Personal Information',
      'profile.name': 'Full Name',
      'profile.email': 'Email Address',
      'profile.phone': 'Phone Number',
      'profile.language': 'Language',
      'profile.save': 'Save Changes',
      
      // Status
      'status.active': 'Active',
      'status.pending': 'Pending',
      'status.completed': 'Completed',
      'status.overdue': 'Overdue',
      'status.defaulted': 'Defaulted',
    }
  },
  sw: {
    translation: {
      // Navigation
      'nav.portfolioOverview': 'Muhtasari wa Mkoba',
      'nav.investmentManagement': 'Usimamizi wa Uwekezaji',
      'nav.dealFlow': 'Mtiririko wa Mikataba',
      'nav.riskManagement': 'Usimamizi wa Hatari',
      'nav.suppliers': 'Wasambazaji',
      'nav.cashFlow': 'Mtiririko wa Fedha',
      'nav.orderTracking': 'Ufuatiliaji wa Agizo',
      'nav.analytics': 'Uchambuzi',
      'nav.alerts': 'Arifa',
      'nav.automation': 'Otomatiki',
      'nav.mobileTools': 'Vifaa vya Simu',
      'nav.security': 'Usalama',
      'nav.education': 'Elimu',
      'nav.community': 'Jamii',
      'nav.settings': 'Mipangilio',
      
      // Dashboard
      'dashboard.title': 'Muhtasari wa Mkoba',
      'dashboard.subtitle': 'Fuatilia utendaji wa mkoba wako wa mikopo ya bidhaa na simamia uwekezaji',
      'dashboard.totalCapitalDeployed': 'Jumla ya Mtaji Uliotumika',
      'dashboard.activeLoans': 'Mikopo Hai',
      'dashboard.dailyCollectionRate': 'Kiwango cha Ukusanyaji wa Kila Siku',
      'dashboard.portfolioYield': 'Mapato ya Mkoba',
      'dashboard.fundNewLoan': 'Fidiria Mkopo Mpya',
      'dashboard.exportReport': 'Hamisha Ripoti',
      'dashboard.recentLoans': 'Mikopo ya Hivi Karibuni',
      'dashboard.alertsNotifications': 'Arifa na Taarifa',
      
      // Investment Management
      'investments.title': 'Usimamizi wa Uwekezaji',
      'investments.subtitle': 'Fanya otomatiki mkakati wako wa mikopo na simamia uwekaji wa mtaji',
      'investments.availableCapital': 'Mtaji Uliopo',
      'investments.autoDeployToday': 'Uwekaji Otomatiki Leo',
      'investments.pendingReview': 'Zinasubiri Mapitio',
      'investments.activeRules': 'Sheria Zinazotumika',
      'investments.createNewRule': 'Unda Sheria Mpya',
      'investments.autoLendingRules': 'Sheria za Mikopo Otomatiki',
      'investments.manageRules': 'Simamia Sheria',
      'investments.pendingDeployments': 'Uwekaji Unaongoja',
      'investments.portfolioStrategy': 'Mkakati wa Mkoba',
      
      // Common
      'common.approve': 'Kubali',
      'common.reject': 'Kataa',
      'common.viewAll': 'Ona Zote',
      'common.deployed': 'Imetumika',
      'common.active': 'Hai',
      'common.overdue': 'Imechelewa',
      'common.days': 'siku',
      'common.notifications': 'Arifa',
      'common.profile': 'Wasifu',
      'common.search': 'Tafuta mikopo, wachuuzi, wasambazaji...',
      'common.signOut': 'Ondoka',
      
      // Notifications
      'notifications.paymentReceived': 'Malipo ya kila siku yamepokewa kutoka {{retailer}}',
      'notifications.riskAlert': 'Tahadhari ya hatari: Malipo ya kuchelewa kutoka {{retailer}}',
      'notifications.newOpportunity': 'Ombi jipya la mkopo wa hali ya juu linapatikana',
      'notifications.markAsRead': 'Weka kama Umesoma',
      'notifications.markAsUnread': 'Weka kama Hujasoma',
      'notifications.deleteNotification': 'Futa',
      'notifications.noNotifications': 'Hakuna arifa zinazopatikana',
      
      // Profile
      'profile.settings': 'Mipangilio ya Wasifu',
      'profile.portfolioAnalytics': 'Uchambuzi wa Mkoba',
      'profile.billingPayments': 'Malipo na Bili',
      'profile.securitySettings': 'Mipangilio ya Usalama',
      'profile.helpSupport': 'Msaada na Uongozi',
      'profile.personalInfo': 'Taarifa za Kibinafsi',
      'profile.name': 'Jina Kamili',
      'profile.email': 'Barua Pepe',
      'profile.phone': 'Nambari ya Simu',
      'profile.language': 'Lugha',
      'profile.save': 'Hifadhi Mabadiliko',
      
      // Status
      'status.active': 'Hai',
      'status.pending': 'Inasubiri',
      'status.completed': 'Imekamilika',
      'status.overdue': 'Imechelewa',
      'status.defaulted': 'Imeshindwa',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
