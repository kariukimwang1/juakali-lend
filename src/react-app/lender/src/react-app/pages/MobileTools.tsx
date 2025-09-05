import React from 'react';
import { motion } from 'framer-motion';
import { 
  DevicePhoneMobileIcon,
  QrCodeIcon,
  CameraIcon,
  BellIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  WifiIcon
} from '@heroicons/react/24/outline';


const MobileTools: React.FC = () => {

  const mobileFeatures = [
    {
      id: 'sms',
      title: 'SMS Notifications',
      description: 'Automated SMS alerts for payment reminders and updates',
      icon: BellIcon,
      color: 'from-green-600 to-emerald-600',
      status: 'Active'
    },
    {
      id: 'qr',
      title: 'QR Code Payments',
      description: 'Quick payment collection via QR code scanning',
      icon: QrCodeIcon,
      color: 'from-blue-600 to-cyan-600',
      status: 'Active'
    },
    {
      id: 'location',
      title: 'Location Tracking',
      description: 'GPS tracking for delivery confirmation and security',
      icon: MapPinIcon,
      color: 'from-purple-600 to-pink-600',
      status: 'Active'
    },
    {
      id: 'camera',
      title: 'Photo Verification',
      description: 'Camera integration for delivery proof and documentation',
      icon: CameraIcon,
      color: 'from-orange-600 to-red-600',
      status: 'Active'
    },
    {
      id: 'ussd',
      title: 'USSD Integration',
      description: 'Feature phone support for basic operations',
      icon: DevicePhoneMobileIcon,
      color: 'from-indigo-600 to-purple-600',
      status: 'Development'
    },
    {
      id: 'offline',
      title: 'Offline Mode',
      description: 'Continue operations without internet connectivity',
      icon: WifiIcon,
      color: 'from-gray-600 to-slate-600',
      status: 'Planning'
    }
  ];

  const usageStats = [
    { label: 'SMS Sent Today', value: '234', change: '+12%' },
    { label: 'QR Scans', value: '89', change: '+8%' },
    { label: 'Photo Uploads', value: '156', change: '+15%' },
    { label: 'Location Updates', value: '324', change: '+5%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-white">Mobile Tools</h1>
          <p className="text-xl text-purple-200">Mobile-first features for on-the-go lending management</p>
        </motion.div>

        {/* Usage Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {usageStats.map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-purple-300 text-sm">{stat.label}</p>
              <p className="text-green-400 text-xs mt-1">{stat.change} from yesterday</p>
            </div>
          ))}
        </motion.div>

        {/* Mobile Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mobileFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-gradient-to-br ${feature.color} p-8 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300 text-white relative overflow-hidden`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-8 h-8" />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      feature.status === 'Active' ? 'bg-green-500/20 text-green-200' :
                      feature.status === 'Development' ? 'bg-yellow-500/20 text-yellow-200' :
                      'bg-gray-500/20 text-gray-200'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-sm opacity-90 mb-6">{feature.description}</p>
                  <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors font-medium">
                    Configure
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* SMS Center */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-400" />
            SMS Management Center
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* SMS Templates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Message Templates</h3>
              <div className="space-y-3">
                {[
                  { name: 'Payment Reminder', usage: '45 sent today' },
                  { name: 'Loan Approval', usage: '12 sent today' },
                  { name: 'Delivery Confirmation', usage: '28 sent today' },
                  { name: 'Overdue Notice', usage: '8 sent today' }
                ].map((template) => (
                  <div key={template.name} className="p-4 bg-white/5 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">{template.name}</p>
                        <p className="text-gray-400 text-sm">{template.usage}</p>
                      </div>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <button className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-left">
                  <p className="font-medium">Send Bulk Reminders</p>
                  <p className="text-sm opacity-80">Send payment reminders to all overdue accounts</p>
                </button>
                <button className="p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors text-left">
                  <p className="font-medium">Delivery Updates</p>
                  <p className="text-sm opacity-80">Notify customers about delivery status</p>
                </button>
                <button className="p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors text-left">
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm opacity-80">Send weekly performance summaries</p>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* QR Code Generator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <QrCodeIcon className="w-6 h-6 text-blue-400" />
            QR Code Management
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* QR Generator */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold text-white">Generate Payment QR</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Retailer Name</label>
                  <input
                    type="text"
                    placeholder="Enter retailer name"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Payment Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium">
                  Generate QR Code
                </button>
              </div>
            </div>

            {/* QR Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">QR Preview</h3>
              <div className="bg-white rounded-xl p-8 flex items-center justify-center">
                <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                  <QrCodeIcon className="w-16 h-16 text-gray-400" />
                </div>
              </div>
              <button className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                Download QR
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mobile App Downloads */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <DevicePhoneMobileIcon className="w-6 h-6 text-purple-400" />
            Mobile Applications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Lender App</h3>
              <p className="text-gray-300">Full-featured mobile app for lenders to manage their portfolio on the go</p>
              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium">
                  Download Android
                </button>
                <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium">
                  Download iOS
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Retailer App</h3>
              <p className="text-gray-300">Simplified app for retailers to make payments and track loan status</p>
              <div className="flex gap-4">
                <button className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-medium">
                  Download Android
                </button>
                <button className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium">
                  Download iOS
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MobileTools;
