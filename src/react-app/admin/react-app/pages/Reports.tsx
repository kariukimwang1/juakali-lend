import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import StatsCard from '@/react-app/components/StatsCard';
import clsx from 'clsx';

interface Report {
  id: number;
  title: string;
  description: string;
  type: string;
  category: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: 'pdf' | 'excel' | 'csv';
  generated_by: string;
  generated_at?: string;
  file_url?: string;
  file_size?: number;
  parameters: Record<string, any>;
  auto_schedule?: string;
  recipients?: string[];
  created_at: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  parameters: Array<{
    name: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
  }>;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [reportParameters, setReportParameters] = useState<Record<string, any>>({});

  useEffect(() => {
    fetchReports();
    fetchReportTemplates();
  }, [selectedCategory, selectedStatus, searchTerm]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        category: selectedCategory,
        status: selectedStatus,
        search: searchTerm,
      });

      const response = await fetch(`/api/reports?${params}`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      // Mock data for demo
      setReports([
        {
          id: 1,
          title: 'Monthly Financial Report',
          description: 'Comprehensive financial performance report for January 2024',
          type: 'financial',
          category: 'Finance',
          status: 'completed',
          format: 'pdf',
          generated_by: 'Admin User',
          generated_at: '2024-01-21T10:30:00Z',
          file_url: '/reports/financial-jan-2024.pdf',
          file_size: 2457600,
          parameters: { month: '2024-01', include_charts: true },
          auto_schedule: 'monthly',
          recipients: ['ceo@company.com', 'cfo@company.com'],
          created_at: '2024-01-21T10:15:00Z'
        },
        {
          id: 2,
          title: 'User Activity Report',
          description: 'Daily active users and engagement metrics',
          type: 'analytics',
          category: 'Analytics',
          status: 'processing',
          format: 'excel',
          generated_by: 'Admin User',
          parameters: { date_range: '2024-01-15_2024-01-21', segment: 'all' },
          created_at: '2024-01-21T09:45:00Z'
        },
        {
          id: 3,
          title: 'KYC Compliance Report',
          description: 'KYC verification status and compliance metrics',
          type: 'compliance',
          category: 'Compliance',
          status: 'completed',
          format: 'pdf',
          generated_by: 'Compliance Officer',
          generated_at: '2024-01-20T16:20:00Z',
          file_url: '/reports/kyc-compliance-w3-2024.pdf',
          file_size: 1892000,
          parameters: { week: '2024-W3', include_details: true },
          auto_schedule: 'weekly',
          recipients: ['compliance@company.com'],
          created_at: '2024-01-20T16:00:00Z'
        },
        {
          id: 4,
          title: 'Risk Assessment Report',
          description: 'Credit risk analysis and default predictions',
          type: 'risk',
          category: 'Risk Management',
          status: 'failed',
          format: 'excel',
          generated_by: 'Risk Manager',
          parameters: { risk_level: 'high', period: '2024-01' },
          created_at: '2024-01-20T14:30:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportTemplates = async () => {
    try {
      const response = await fetch('/api/reports/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Failed to fetch report templates:', error);
      // Mock templates for demo
      setTemplates([
        {
          id: 'financial-monthly',
          name: 'Monthly Financial Report',
          description: 'Comprehensive financial performance and metrics',
          category: 'Finance',
          icon: '💰',
          parameters: [
            { name: 'month', type: 'month', label: 'Report Month', required: true },
            { name: 'include_charts', type: 'boolean', label: 'Include Charts', required: false },
            { name: 'format', type: 'select', label: 'Format', required: true, options: ['PDF', 'Excel'] }
          ]
        },
        {
          id: 'user-analytics',
          name: 'User Analytics Report',
          description: 'User behavior, retention, and engagement analytics',
          category: 'Analytics',
          icon: '📊',
          parameters: [
            { name: 'date_range', type: 'daterange', label: 'Date Range', required: true },
            { name: 'segment', type: 'select', label: 'User Segment', required: false, options: ['All', 'Premium', 'Standard', 'Basic'] },
            { name: 'metrics', type: 'multiselect', label: 'Metrics to Include', required: true, options: ['DAU', 'MAU', 'Retention', 'Churn'] }
          ]
        },
        {
          id: 'kyc-compliance',
          name: 'KYC Compliance Report',
          description: 'KYC verification status and regulatory compliance',
          category: 'Compliance',
          icon: '🛡️',
          parameters: [
            { name: 'period', type: 'select', label: 'Period', required: true, options: ['Weekly', 'Monthly', 'Quarterly'] },
            { name: 'include_details', type: 'boolean', label: 'Include User Details', required: false },
            { name: 'status_filter', type: 'select', label: 'Status Filter', required: false, options: ['All', 'Pending', 'Verified', 'Rejected'] }
          ]
        },
        {
          id: 'transaction-summary',
          name: 'Transaction Summary',
          description: 'Transaction volumes, values, and performance metrics',
          category: 'Operations',
          icon: '💳',
          parameters: [
            { name: 'date_range', type: 'daterange', label: 'Date Range', required: true },
            { name: 'transaction_type', type: 'select', label: 'Transaction Type', required: false, options: ['All', 'Loans', 'Repayments', 'Purchases'] },
            { name: 'groupby', type: 'select', label: 'Group By', required: true, options: ['Day', 'Week', 'Month'] }
          ]
        }
      ]);
    }
  };

  const generateReport = async (templateId: string, parameters: Record<string, any>) => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template_id: templateId, parameters })
      });

      if (response.ok) {
        setShowCreateModal(false);
        setSelectedTemplate(null);
        setReportParameters({});
        fetchReports();
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  const downloadReport = (report: Report) => {
    if (report.file_url) {
      // In a real app, this would download the file
      window.open(report.file_url, '_blank');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <ClockIcon className="w-5 h-5 text-yellow-500 animate-pulse" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      processing: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const categories = ['Finance', 'Analytics', 'Compliance', 'Risk Management', 'Operations'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate, schedule, and manage business reports</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Schedule Report
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          title="Total Reports"
          value="1,247"
          change={{ value: '23', type: 'increase' }}
          icon={<DocumentTextIcon />}
          color="blue"
        />
        <StatsCard
          title="Completed Today"
          value="18"
          change={{ value: '5', type: 'increase' }}
          icon={<CheckCircleIcon />}
          color="green"
        />
        <StatsCard
          title="Scheduled"
          value="45"
          change={{ value: '8', type: 'increase' }}
          icon={<CalendarIcon />}
          color="purple"
        />
        <StatsCard
          title="Processing"
          value="3"
          change={{ value: '2', type: 'decrease' }}
          icon={<ClockIcon />}
          color="yellow"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Sort by</option>
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="title_asc">Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <DocumentTextIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{report.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{report.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(report.status)}
                        <span className={clsx(
                          'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          getStatusColor(report.status)
                        )}>
                          {report.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {report.generated_at ? formatDate(report.generated_at) : '-'}
                      </div>
                      <div className="text-sm text-gray-500">{report.generated_by}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.file_size ? formatFileSize(report.file_size) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.auto_schedule ? (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          {report.auto_schedule}
                        </span>
                      ) : (
                        <span className="text-gray-400">One-time</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {report.status === 'completed' && (
                          <button
                            onClick={() => downloadReport(report)}
                            className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          >
                            <ArrowDownTrayIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-50 transition-colors">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={() => setShowCreateModal(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Generate New Report</h3>
              
              {!selectedTemplate ? (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Choose a Report Template</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center mb-2">
                          <span className="text-2xl mr-3">{template.icon}</span>
                          <h5 className="font-medium text-gray-900">{template.name}</h5>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {template.category}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-medium text-gray-900">Configure: {selectedTemplate.name}</h4>
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Back to Templates
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {selectedTemplate.parameters.map((param) => (
                      <div key={param.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {param.label} {param.required && <span className="text-red-500">*</span>}
                        </label>
                        {param.type === 'select' && param.options ? (
                          <select
                            value={reportParameters[param.name] || ''}
                            onChange={(e) => setReportParameters(prev => ({ ...prev, [param.name]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="">Select {param.label}</option>
                            {param.options.map(option => (
                              <option key={option} value={option.toLowerCase()}>{option}</option>
                            ))}
                          </select>
                        ) : param.type === 'boolean' ? (
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={reportParameters[param.name] || false}
                              onChange={(e) => setReportParameters(prev => ({ ...prev, [param.name]: e.target.checked }))}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">Include this option</span>
                          </div>
                        ) : param.type === 'daterange' ? (
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                              type="date"
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        ) : (
                          <input
                            type={param.type === 'month' ? 'month' : 'text'}
                            value={reportParameters[param.name] || ''}
                            onChange={(e) => setReportParameters(prev => ({ ...prev, [param.name]: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                {selectedTemplate && (
                  <button 
                    onClick={() => generateReport(selectedTemplate.id, reportParameters)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    Generate Report
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
