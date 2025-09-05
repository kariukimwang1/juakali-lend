import { useState } from 'react';
import { UserRoleType } from '@/shared/types';
import { 
  Users, 
  Building2, 
  Truck, 
  DollarSign, 
  Shield, 
  Check,
  ArrowRight
} from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: UserRoleType | null;
  onRoleSelect: (role: UserRoleType) => void;
  disabled?: boolean;
}

const roleConfigs = {
  customer: {
    icon: Users,
    title: 'Customer',
    description: 'Access financial products and services for your business needs',
    features: [
      'Apply for business loans',
      'Access credit lines',
      'Track payment history',
      'Build credit score'
    ],
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    selectedBorder: 'border-blue-500'
  },
  retailer: {
    icon: Building2,
    title: 'Retailer',
    description: 'Manage your retail business and connect with suppliers',
    features: [
      'Inventory management',
      'Supplier connections',
      'Point of sale financing',
      'Business analytics'
    ],
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    selectedBorder: 'border-green-500'
  },
  supplier: {
    icon: Truck,
    title: 'Supplier',
    description: 'Supply products and services to retailers and businesses',
    features: [
      'Product catalog management',
      'Order fulfillment',
      'Payment processing',
      'Delivery tracking'
    ],
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    selectedBorder: 'border-purple-500'
  },
  lender: {
    icon: DollarSign,
    title: 'Lender',
    description: 'Provide financial services and manage lending portfolio',
    features: [
      'Portfolio management',
      'Risk assessment',
      'Interest rate management',
      'Collections tracking'
    ],
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    selectedBorder: 'border-orange-500'
  },
  admin: {
    icon: Shield,
    title: 'Administrator',
    description: 'Platform administration with advanced security features',
    features: [
      'User management',
      'Security monitoring',
      'System configuration',
      'Audit logs access'
    ],
    color: 'from-red-500 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    selectedBorder: 'border-red-500'
  }
};

export default function RoleSelector({ selectedRole, onRoleSelect, disabled }: RoleSelectorProps) {
  const [hoveredRole, setHoveredRole] = useState<UserRoleType | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Role</h3>
        <p className="text-gray-600">Select the role that best describes your business needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(roleConfigs).map(([role, config]) => {
          const Icon = config.icon;
          const isSelected = selectedRole === role;
          const isHovered = hoveredRole === role;
          
          return (
            <div
              key={role}
              className={`
                relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${isSelected ? 
                  `${config.selectedBorder} ${config.bgColor} shadow-lg scale-105` : 
                  `${config.borderColor} bg-white hover:${config.bgColor} hover:shadow-md`
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              onClick={() => !disabled && onRoleSelect(role as UserRoleType)}
              onMouseEnter={() => setHoveredRole(role as UserRoleType)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}

              <div className="flex items-start space-x-4">
                <div className={`
                  w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-r ${config.color}
                  ${isHovered ? 'scale-110' : ''}
                  transition-transform duration-300
                `}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {config.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    {config.description}
                  </p>

                  <ul className="space-y-1">
                    {config.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-xs text-gray-500">
                        <ArrowRight className="w-3 h-3 mr-2 text-gray-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {role === 'admin' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-700">
                    <Shield className="w-4 h-4 mr-2" />
                    <span className="text-xs font-medium">
                      Requires manual approval and enhanced security verification
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedRole && (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Selected: <span className="font-semibold text-gray-900">
              {roleConfigs[selectedRole].title}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
