import { createContext, useContext } from 'react';

export type Language = 'en' | 'sw';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionary
export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    customers: 'Customers',
    deliveries: 'Deliveries',
    invoices: 'Invoices',
    analytics: 'Analytics',
    payments: 'Payments',
    reports: 'Reports',
    inventory: 'Inventory',
    suppliers: 'Suppliers',
    profile: 'Profile',
    settings: 'Settings',
    notifications: 'Notifications',
    
    // Dashboard
    totalOrders: 'Total Orders',
    totalRevenue: 'Total Revenue',
    totalCustomers: 'Total Customers',
    totalProducts: 'Total Products',
    pendingOrders: 'Pending Orders',
    lowStockItems: 'Low Stock Items',
    avgOrderValue: 'Avg Order Value',
    deliverySuccess: 'Delivery Success',
    salesOverview: 'Sales Overview',
    productCategories: 'Product Categories',
    quickActions: 'Quick Actions',
    addNewProduct: 'Add New Product',
    processOrders: 'Process Orders',
    viewAnalytics: 'View Analytics',
    
    // Common actions
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    download: 'Download',
    print: 'Print',
    
    // Status
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    confirmed: 'Confirmed',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    // Product management
    productName: 'Product Name',
    description: 'Description',
    category: 'Category',
    price: 'Price',
    stock: 'Stock',
    inStock: 'In Stock',
    outOfStock: 'Out of Stock',
    lowStock: 'Low Stock',
    
    // Customer management
    customerName: 'Customer Name',
    phone: 'Phone',
    email: 'Email',
    company: 'Company',
    totalSpent: 'Total Spent',
    
    // Messages
    welcomeBack: 'Welcome back! Here\'s what\'s happening with your business today.',
    noDataFound: 'No data found',
    loadingError: 'Error loading data',
    operationSuccess: 'Operation completed successfully',
    operationError: 'Operation failed',
    
    // Time
    today: 'Today',
    yesterday: 'Yesterday',
    lastWeek: 'Last Week',
    lastMonth: 'Last Month',
    thisYear: 'This Year'
  },
  sw: {
    // Navigation  
    dashboard: 'Dashibodi',
    products: 'Bidhaa',
    orders: 'Maagizo',
    customers: 'Wateja',
    deliveries: 'Usafirishaji',
    invoices: 'Ankara',
    analytics: 'Uchambuzi',
    payments: 'Malipo',
    reports: 'Ripoti',
    inventory: 'Hesabu',
    suppliers: 'Wasambazaji',
    profile: 'Wasifu',
    settings: 'Mipangilio',
    notifications: 'Arifa',
    
    // Dashboard
    totalOrders: 'Jumla ya Maagizo',
    totalRevenue: 'Jumla ya Mapato',
    totalCustomers: 'Jumla ya Wateja',
    totalProducts: 'Jumla ya Bidhaa',
    pendingOrders: 'Maagizo Yanayosubiri',
    lowStockItems: 'Bidhaa za Hisa Ndogo',
    avgOrderValue: 'Wastani wa Thamani ya Agizo',
    deliverySuccess: 'Mafanikio ya Usafirishaji',
    salesOverview: 'Muhtasari wa Mauzo',
    productCategories: 'Aina za Bidhaa',
    quickActions: 'Vitendo vya Haraka',
    addNewProduct: 'Ongeza Bidhaa Mpya',
    processOrders: 'Chakata Maagizo',
    viewAnalytics: 'Angalia Uchambuzi',
    
    // Common actions
    add: 'Ongeza',
    edit: 'Hariri',
    delete: 'Futa',
    view: 'Angalia',
    save: 'Hifadhi',
    cancel: 'Ghairi',
    search: 'Tafuta',
    filter: 'Chuja',
    export: 'Hamisha',
    download: 'Pakua',
    print: 'Chapisha',
    
    // Status
    active: 'Hai',
    inactive: 'Haifanyi',
    pending: 'Inasubiri',
    confirmed: 'Imethibitishwa',
    processing: 'Inachakatwa',
    shipped: 'Imetumwa',
    delivered: 'Imefikishwa',
    cancelled: 'Imeghairiwa',
    
    // Product management
    productName: 'Jina la Bidhaa',
    description: 'Maelezo',
    category: 'Aina',
    price: 'Bei',
    stock: 'Hisa',
    inStock: 'Iko Hisani',
    outOfStock: 'Haijapatikana',
    lowStock: 'Hisa Ndogo',
    
    // Customer management
    customerName: 'Jina la Mteja',
    phone: 'Simu',
    email: 'Barua Pepe',
    company: 'Kampuni',
    totalSpent: 'Jumla Aliyotumia',
    
    // Messages
    welcomeBack: 'Karibu tena! Hapa kuna jinsi biashara yako inavyoendelea leo.',
    noDataFound: 'Hakuna data iliyopatikana',
    loadingError: 'Hitilafu katika kupakia data',
    operationSuccess: 'Operesheni imekamilika kwa mafanikio',
    operationError: 'Operesheni imeshindwa',
    
    // Time
    today: 'Leo',
    yesterday: 'Jana',
    lastWeek: 'Wiki Iliyopita',
    lastMonth: 'Mwezi Uliopita',
    thisYear: 'Mwaka Huu'
  }
};
