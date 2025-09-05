import { motion } from 'framer-motion';
import { useState } from 'react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import { 
  UserCircleIcon,
  CogIcon,
  ShieldCheckIcon,
  BellIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  CameraIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    lastLogin: Date;
  };
}

export default function Profile() {
  const { t, currentLanguage, changeLanguage, languages } = useLanguage();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: 'John Investor',
    email: 'john.investor@email.com',
    phone: '+254 712 345 678',
    language: currentLanguage,
    timezone: 'Africa/Nairobi',
    notifications: {
      email: true,
      sms: true,
      push: true
    },
    security: {
      twoFactorEnabled: true,
      lastLogin: new Date()
    }
  });

  const tabs = [
    { id: 'personal', label: t('profile.personalInfo'), icon: UserCircleIcon },
    { id: 'notifications', label: t('common.notifications'), icon: BellIcon },
    { id: 'security', label: t('profile.securitySettings'), icon: ShieldCheckIcon },
    { id: 'preferences', label: 'Preferences', icon: CogIcon }
  ];

  const handleSave = () => {
    // Save profile data
    setIsEditing(false);
    // TODO: API call to save profile
  };

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    setProfileData(prev => ({ ...prev, language: langCode }));
  };

  const renderPersonalInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <UserCircleIcon className="w-16 h-16 text-white" />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-slate-200"
          >
            <CameraIcon className="w-4 h-4 text-slate-600" />
          </motion.button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{profileData.name}</h3>
          <p className="text-slate-600">Premium Lender</p>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1">
            Change Photo
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <IdentificationIcon className="w-4 h-4 inline mr-2" />
            {t('profile.name')}
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <EnvelopeIcon className="w-4 h-4 inline mr-2" />
            {t('profile.email')}
          </label>
          <input
            type="email"
            value={profileData.email}
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <PhoneIcon className="w-4 h-4 inline mr-2" />
            {t('profile.phone')}
          </label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <GlobeAltIcon className="w-4 h-4 inline mr-2" />
            {t('profile.language')}
          </label>
          <select
            value={profileData.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationSettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid gap-4">
        {Object.entries(profileData.notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-800 capitalize">{key} Notifications</h4>
              <p className="text-sm text-slate-600">
                Receive notifications via {key === 'push' ? 'mobile app' : key}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setProfileData(prev => ({
                ...prev,
                notifications: { ...prev.notifications, [key]: !value }
              }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                value ? 'bg-blue-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </motion.button>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderSecuritySettings = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
          <div>
            <h4 className="font-medium text-slate-800">Two-Factor Authentication</h4>
            <p className="text-sm text-slate-600">Add an extra layer of security to your account</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setProfileData(prev => ({
              ...prev,
              security: { ...prev.security, twoFactorEnabled: !prev.security.twoFactorEnabled }
            }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              profileData.security.twoFactorEnabled ? 'bg-green-600' : 'bg-slate-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                profileData.security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </motion.button>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl">
          <h4 className="font-medium text-slate-800 mb-2">Recent Activity</h4>
          <div className="space-y-2 text-sm text-slate-600">
            <p>Last login: {profileData.security.lastLogin.toLocaleDateString()}</p>
            <p>Password last changed: 30 days ago</p>
            <p>Active sessions: 2 devices</p>
          </div>
          <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all activity
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {t('profile.settings')}
          </h1>
          <p className="text-slate-600">Manage your account settings and preferences</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                {t('profile.save')}
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <PencilIcon className="w-4 h-4" />
              Edit Profile
            </motion.button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-slate-200/50">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-slate-200/50">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-800">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
            </div>

            {activeTab === 'personal' && renderPersonalInfo()}
            {activeTab === 'notifications' && renderNotificationSettings()}
            {activeTab === 'security' && renderSecuritySettings()}
            {activeTab === 'preferences' && (
              <div className="text-center py-8 text-slate-500">
                Preferences settings coming soon...
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
