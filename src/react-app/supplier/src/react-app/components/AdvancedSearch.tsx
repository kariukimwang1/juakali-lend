import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';

interface SearchFilter {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'range';
  options?: { value: string; label: string }[];
  icon?: React.ComponentType<any>;
}

interface AdvancedSearchProps {
  filters: SearchFilter[];
  onSearch: (filters: Record<string, any>) => void;
  placeholder?: string;
}

export default function AdvancedSearch({ filters, onSearch, placeholder }: AdvancedSearchProps) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValues, setSearchValues] = useState<Record<string, any>>({});
  const [quickSearch, setQuickSearch] = useState('');

  const handleFilterChange = (filterId: string, value: any) => {
    const newValues = { ...searchValues, [filterId]: value };
    setSearchValues(newValues);
    onSearch({ ...newValues, quickSearch });
  };

  const handleQuickSearchChange = (value: string) => {
    setQuickSearch(value);
    onSearch({ ...searchValues, quickSearch: value });
  };

  const clearFilters = () => {
    setSearchValues({});
    setQuickSearch('');
    onSearch({ quickSearch: '' });
  };

  const activeFiltersCount = Object.values(searchValues).filter(v => v && v !== '').length;

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 shadow-lg">
      {/* Quick Search */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={placeholder || t('search')}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
            value={quickSearch}
            onChange={(e) => handleQuickSearchChange(e.target.value)}
          />
        </div>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-all duration-200 ${
            isExpanded || activeFiltersCount > 0
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium">{t('filter')}</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 px-3 py-3 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="text-sm">Clear</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-slate-200 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter) => (
              <div key={filter.id} className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-slate-700">
                  {filter.icon && <filter.icon className="w-4 h-4" />}
                  <span>{filter.label}</span>
                </label>
                
                {filter.type === 'text' && (
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchValues[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  />
                )}

                {filter.type === 'select' && (
                  <select
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchValues[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  >
                    <option value="">All</option>
                    {filter.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}

                {filter.type === 'date' && (
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchValues[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  />
                )}

                {filter.type === 'number' && (
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchValues[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  />
                )}

                {filter.type === 'range' && (
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchValues[`${filter.id}_min`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.id}_min`, e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={searchValues[`${filter.id}_max`] || ''}
                      onChange={(e) => handleFilterChange(`${filter.id}_max`, e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Filter Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-sm text-slate-600">Quick filters:</span>
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors">
              Active Products
            </button>
            <button className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200 transition-colors">
              Low Stock
            </button>
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors">
              Recent Orders
            </button>
            <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors">
              VIP Customers
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
