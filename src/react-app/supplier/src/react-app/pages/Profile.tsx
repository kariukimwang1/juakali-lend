import { useState } from 'react';
import { 
  Building2, 
   
  MapPin, 
  Calendar,
  Save,
  
  Edit,
  Camera,
  Globe,
  
  DollarSign,
  Package,
  Users,
  ShoppingCart
} from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import StatsCard from '@/react-app/components/StatsCard';
import toast from 'react-hot-toast';

// Sample supplier profile data
const supplierProfile = {
  id: 1,
  companyName: 'SupplyFlow Enterprises',
  businessType: 'Wholesale Distributor',
  registrationNumber: 'REG-2023-001234',
  kraPin: 'A001234567Z',
  logoUrl: '',
  description: 'Leading supplier of quality office equipment and electronics in Kenya. We pride ourselves on excellent customer service and competitive pricing.',
  yearEstablished: 2015,
  industry: 'Office Equipment & Electronics',
  primaryContactPerson: 'John Kamau',
  primaryPhone: '+254712345678',
  primaryEmail: 'john@supplyflow.com',
  secondaryPhone: '+254723456789',
  secondaryEmail: 'support@supplyflow.com',
  businessAddress: '123 Industrial Area, Nairobi',
  county: 'Nairobi',
  city: 'Nairobi',
  postalCode: '00100',
  tradingHours: 'Monday - Friday: 8:00 AM - 6:00 PM, Saturday: 9:00 AM - 4:00 PM',
  serviceAreas: 'Nairobi, Kiambu, Machakos, Kajiado',
  deliveryOptions: 'Same-day delivery within Nairobi, Next-day delivery to surrounding counties',
  paymentTerms: 'Net 30 days, Early payment discount available',
  returnPolicy: '30-day return policy for defective items'
};

const businessStats = {
  totalProducts: 245,
  totalCustomers: 180,
  totalOrders: 1247,
  monthlyRevenue: 2840000
};

export default function Profile() {
  const { } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(supplierProfile);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save profile changes
    console.log('Saving profile:', profile);
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // In a real app, you'd upload the file here
      toast.success('Logo uploaded successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Supplier Profile
          </h1>
          <p className="text-slate-600 mt-1">Manage your business information and settings</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Edit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Business Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value={businessStats.totalProducts}
          icon={Package}
          change="+5 this month"
          changeType="increase"
          gradient="from-blue-500 to-indigo-600"
        />
        <StatsCard
          title="Total Customers"
          value={businessStats.totalCustomers}
          icon={Users}
          change="+12 this month"
          changeType="increase"
          gradient="from-green-500 to-emerald-600"
        />
        <StatsCard
          title="Total Orders"
          value={businessStats.totalOrders}
          icon={ShoppingCart}
          change="+23 this month"
          changeType="increase"
          gradient="from-purple-500 to-pink-600"
        />
        <StatsCard
          title="Monthly Revenue"
          value={`KSh ${(businessStats.monthlyRevenue / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          change="+8.5% this month"
          changeType="increase"
          gradient="from-orange-500 to-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Logo & Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6 space-y-6">
            {/* Logo Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {profile.logoUrl || logoFile ? (
                    <img
                      src={logoFile ? URL.createObjectURL(logoFile) : profile.logoUrl}
                      alt="Company Logo"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <Building2 className="w-16 h-16 text-white" />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-slate-50 transition-colors">
                    <Camera className="w-4 h-4 text-slate-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{profile.companyName}</h3>
              <p className="text-slate-600">{profile.businessType}</p>
            </div>

            {/* Quick Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">Est. {profile.yearEstablished}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{profile.industry}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600">{profile.city}, {profile.county}</span>
              </div>
            </div>

            {/* Registration Info */}
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Registration Number:</span>
                <span className="text-sm font-medium">{profile.registrationNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">KRA PIN:</span>
                <span className="text-sm font-medium">{profile.kraPin}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Company Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Company Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.companyName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Business Type
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.businessType}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Industry
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Year Established
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={profile.yearEstablished}
                    onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.yearEstablished}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company Description
              </label>
              {isEditing ? (
                <textarea
                  value={profile.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="text-slate-900">{profile.description}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Primary Contact Person
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.primaryContactPerson}
                    onChange={(e) => handleInputChange('primaryContactPerson', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.primaryContactPerson}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Primary Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.primaryPhone}
                    onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.primaryPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Primary Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.primaryEmail}
                    onChange={(e) => handleInputChange('primaryEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.primaryEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Secondary Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.secondaryPhone}
                    onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.secondaryPhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Address */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Business Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.businessAddress}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.businessAddress}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  County
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.county}
                    onChange={(e) => handleInputChange('county', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.county}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Postal Code
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.postalCode}</p>
                )}
              </div>
            </div>
          </div>

          {/* Business Operations */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Business Operations</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Trading Hours
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.tradingHours}
                    onChange={(e) => handleInputChange('tradingHours', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.tradingHours}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Service Areas
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.serviceAreas}
                    onChange={(e) => handleInputChange('serviceAreas', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.serviceAreas}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Delivery Options
                </label>
                {isEditing ? (
                  <textarea
                    value={profile.deliveryOptions}
                    onChange={(e) => handleInputChange('deliveryOptions', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.deliveryOptions}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Terms
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.paymentTerms}
                    onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.paymentTerms}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Return Policy
                </label>
                {isEditing ? (
                  <textarea
                    value={profile.returnPolicy}
                    onChange={(e) => handleInputChange('returnPolicy', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="text-slate-900">{profile.returnPolicy}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
