import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, Clock, DollarSign, Info } from 'lucide-react';

interface CalculatorState {
  businessType: string;
  monthlyRevenue: number;
  yearsInBusiness: number;
  creditLimit: number;
  dailyPayment: number;
  repaymentDays: number;
}

export default function CreditCalculator() {
  const [state, setState] = useState<CalculatorState>({
    businessType: 'retail',
    monthlyRevenue: 50000,
    yearsInBusiness: 1,
    creditLimit: 0,
    dailyPayment: 0,
    repaymentDays: 0
  });

  const [isCalculating, setIsCalculating] = useState(false);

  const businessTypes = [
    { value: 'retail', label: 'Retail Shop', multiplier: 0.4 },
    { value: 'wholesale', label: 'Wholesale', multiplier: 0.6 },
    { value: 'restaurant', label: 'Restaurant/Food', multiplier: 0.3 },
    { value: 'services', label: 'Services', multiplier: 0.35 },
    { value: 'manufacturing', label: 'Manufacturing', multiplier: 0.5 }
  ];

  useEffect(() => {
    const calculateCredit = () => {
      setIsCalculating(true);
      
      setTimeout(() => {
        const businessMultiplier = businessTypes.find(bt => bt.value === state.businessType)?.multiplier || 0.4;
        const experienceBonus = Math.min(state.yearsInBusiness * 0.1, 0.5);
        const totalMultiplier = businessMultiplier + experienceBonus;
        
        const creditLimit = Math.min(state.monthlyRevenue * totalMultiplier, 500000);
        const dailyPayment = creditLimit * 0.05; // 5% daily payment
        const repaymentDays = Math.ceil(creditLimit / dailyPayment);
        
        setState(prev => ({
          ...prev,
          creditLimit,
          dailyPayment,
          repaymentDays
        }));
        
        setIsCalculating(false);
      }, 1000);
    };

    calculateCredit();
  }, [state.businessType, state.monthlyRevenue, state.yearsInBusiness]);

  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border animate-fade-in-up">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Calculator className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">Credit Limit Calculator</h3>
          <p className="text-gray-600 text-sm">Get an instant estimate of your credit limit</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type
            </label>
            <select
              value={state.businessType}
              onChange={(e) => setState(prev => ({ ...prev, businessType: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            >
              {businessTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Revenue (KES)
            </label>
            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={state.monthlyRevenue}
              onChange={(e) => setState(prev => ({ ...prev, monthlyRevenue: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>KES 10K</span>
              <span className="font-medium text-blue-600">{formatCurrency(state.monthlyRevenue)}</span>
              <span>KES 500K</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years in Business
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={state.yearsInBusiness}
              onChange={(e) => setState(prev => ({ ...prev, yearsInBusiness: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>6 months</span>
              <span className="font-medium text-blue-600">{state.yearsInBusiness} years</span>
              <span>10+ years</span>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
          {isCalculating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Calculating your credit limit...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Estimated Credit Limit</h4>
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {formatCurrency(state.creditLimit)}
                </div>
                <p className="text-xs text-gray-500">Subject to approval and verification</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(state.dailyPayment)}
                  </div>
                  <div className="text-xs text-gray-600">Daily Payment</div>
                </div>

                <div className="bg-white rounded-lg p-4 text-center">
                  <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900">
                    {state.repaymentDays} days
                  </div>
                  <div className="text-xs text-gray-600">Repayment Period</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-600">
                    <p className="font-medium mb-1">How we calculate:</p>
                    <ul className="space-y-1">
                      <li>• Based on your business type and revenue</li>
                      <li>• Experience bonus for established businesses</li>
                      <li>• 5% daily repayment rate from sales</li>
                      <li>• No collateral required</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Apply for This Amount</span>
                <TrendingUp className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
