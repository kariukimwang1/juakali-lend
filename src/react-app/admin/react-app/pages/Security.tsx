import { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  EyeIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  UserGroupIcon,
  BugAntIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import StatsCard from '@/react-app/components/StatsCard';
import clsx from 'clsx';

interface SecurityEvent {
  id: number;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  user_id?: number;
  user_name?: string;
  ip_address: string;
  user_agent: string;
  location?: string;
  status: 'active' | 'resolved' | 'investigating';
  created_at: string;
  resolved_at?: string;
}

interface LoginAttempt {
  id: number;
  user_id?: number;
  email: string;
  ip_address: string;
  success: boolean;
  failure_reason?: string;
  device_type: string;
  browser: string;
  location?: string;
  created_at: string;
}

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  failedLogins: number;
  suspiciousActivity: number;
  eventTrends: Array<{ date: string; low: number; medium: number; high: number; critical: number }>;
  loginTrends: Array<{ date: string; successful: number; failed: number }>;
  threatTypes: Array<{ type: string; count: number; color: string }>;
  deviceTypes: Array<{ device: string; count: number; percentage: number }>;
}

export default function Security() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeverity, setSelectedSeverity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'events' | 'logins' | 'settings'>('events');

  useEffect(() => {
    fetchSecurityData();
  }, [selectedSeverity, selectedStatus]);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const [eventsResponse, loginsResponse, metricsResponse] = await Promise.all([
        fetch(`/api/security/events?severity=${selectedSeverity}&status=${selectedStatus}`),
        fetch('/api/security/login-attempts'),
        fetch('/api/security/metrics')
      ]);

      if (eventsResponse.ok && loginsResponse.ok && metricsResponse.ok) {
        const eventsData = await eventsResponse.json();
        const loginsData = await loginsResponse.json();
        const metricsData = await metricsResponse.json();
        
        setEvents(eventsData.events || []);
        setLoginAttempts(loginsData.attempts || []);
        setMetrics(metricsData);
      }
    } catch (error) {
      console.error('Failed to fetch security data:', error);
      // Mock data for demo
      setEvents([
        {
          id: 1,
          event_type: 'failed_login',
          severity: 'medium',
          title: 'Multiple Failed Login Attempts',
          description: '5 failed login attempts from IP 192.168.1.100 in 10 minutes',
          user_id: 123,
          user_name: 'john.doe@example.com',
          ip_address: '192.168.1.100',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          location: 'Nairobi, Kenya',
          status: 'investigating',
          created_at: '2024-01-21T10:30:00Z'
        },
        {
          id: 2,
          event_type: 'suspicious_transaction',
          severity: 'high',
          title: 'Unusual Transaction Pattern',
          description: 'Large transaction outside normal pattern for user',
          user_id: 456,
          user_name: 'jane.smith@example.com',
          ip_address: '10.0.0.45',
          user_agent: 'Mobile App v2.1.0',
          location: 'Mombasa, Kenya',
          status: 'active',
          created_at: '2024-01-21T09:15:00Z'
        },
        {
          id: 3,
          event_type: 'data_access',
          severity: 'critical',
          title: 'Unauthorized Admin Panel Access',
          description: 'Access attempt to admin panel from unauthorized location',
          ip_address: '203.194.15.22',
          user_agent: 'curl/7.68.0',
          location: 'Unknown',
          status: 'resolved',
          created_at: '2024-01-20T22:45:00Z',
          resolved_at: '2024-01-21T08:00:00Z'
        }
      ]);

      setLoginAttempts([
        {
          id: 1,
          user_id: 123,
          email: 'john.doe@example.com',
          ip_address: '192.168.1.100',
          success: false,
          failure_reason: 'Invalid password',
          device_type: 'Desktop',
          browser: 'Chrome',
          location: 'Nairobi, Kenya',
          created_at: '2024-01-21T10:30:00Z'
        },
        {
          id: 2,
          user_id: 456,
          email: 'jane.smith@example.com',
          ip_address: '10.0.0.45',
          success: true,
          device_type: 'Mobile',
          browser: 'Safari',
          location: 'Mombasa, Kenya',
          created_at: '2024-01-21T09:15:00Z'
        },
        {
          id: 3,
          email: 'unknown@attacker.com',
          ip_address: '203.194.15.22',
          success: false,
          failure_reason: 'Account not found',
          device_type: 'Unknown',
          browser: 'Unknown',
          location: 'Unknown',
          created_at: '2024-01-20T22:45:00Z'
        }
      ]);

      setMetrics({
        totalEvents: 1247,
        criticalEvents: 23,
        failedLogins: 456,
        suspiciousActivity: 89,
        eventTrends: [
          { date: '2024-01-15', low: 45, medium: 23, high: 8, critical: 2 },
          { date: '2024-01-16', low: 52, medium: 28, high: 12, critical: 1 },
          { date: '2024-01-17', low: 38, medium: 19, high: 6, critical: 3 },
          { date: '2024-01-18', low: 61, medium: 31, high: 15, critical: 4 },
          { date: '2024-01-19', low: 43, medium: 22, high: 9, critical: 2 },
          { date: '2024-01-20', low: 57, medium: 26, high: 11, critical: 1 },
          { date: '2024-01-21', low: 49, medium: 24, high: 10, critical: 3 }
        ],
        loginTrends: [
          { date: '2024-01-15', successful: 1250, failed: 45 },
          { date: '2024-01-16', successful: 1340, failed: 52 },
          { date: '2024-01-17', successful: 1180, failed: 38 },
          { date: '2024-01-18', successful: 1420, failed: 61 },
          { date: '2024-01-19', successful: 1290, failed: 43 },
          { date: '2024-01-20', successful: 1380, failed: 57 },
          { date: '2024-01-21', successful: 1310, failed: 49 }
        ],
        threatTypes: [
          { type: 'Failed Login', count: 456, color: '#f59e0b' },
          { type: 'Suspicious Transaction', count: 234, color: '#ef4444' },
          { type: 'Data Access', count: 123, color: '#8b5cf6' },
          { type: 'API Abuse', count: 89, color: '#06b6d4' },
          { type: 'Account Lockout', count: 67, color: '#10b981' }
        ],
        deviceTypes: [
          { device: 'Desktop', count: 8520, percentage: 65.4 },
          { device: 'Mobile', count: 3890, percentage: 29.8 },
          { device: 'Tablet', count: 520, percentage: 4.0 },
          { device: 'Unknown', count: 105, percentage: 0.8 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />;
      case 'high':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />;
      case 'low':
        return <ExclamationTriangleIcon className="w-5 h-5 text-blue-600" />;
      default:
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-red-100 text-red-800',
      investigating: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <DevicePhoneMobileIcon className="w-5 h-5 text-gray-600" />;
      case 'desktop':
        return <ComputerDesktopIcon className="w-5 h-5 text-gray-600" />;
      default:
        return <GlobeAltIcon className="w-5 h-5 text-gray-600" />;
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security Center</h1>
          <p className="text-gray-600">Monitor security events, threats, and system protection</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <ShieldCheckIcon className="w-4 h-4 mr-2" />
            Security Report
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-200 transform hover:scale-105">
            <ShieldCheckIcon className="w-4 h-4 mr-2" />
            Configure Firewall
          </button>
        </div>
      </div>

      {/* Security Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Total Events"
            value={metrics.totalEvents.toString()}
            change={{ value: '23', type: 'increase' }}
            icon={<ShieldCheckIcon />}
            color="blue"
          />
          <StatsCard
            title="Critical Events"
            value={metrics.criticalEvents.toString()}
            change={{ value: '2', type: 'decrease' }}
            icon={<ExclamationTriangleIcon />}
            color="red"
          />
          <StatsCard
            title="Failed Logins"
            value={metrics.failedLogins.toString()}
            change={{ value: '15%', type: 'decrease' }}
            icon={<LockClosedIcon />}
            color="yellow"
          />
          <StatsCard
            title="Suspicious Activity"
            value={metrics.suspiciousActivity.toString()}
            change={{ value: '5', type: 'increase' }}
            icon={<BugAntIcon />}
            color="purple"
          />
        </div>
      )}

      {/* Security Charts */}
      {metrics && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Security Events Trends */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Events Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={metrics.eventTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-KE')}
                />
                <Legend />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Low" />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Medium" />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#ef4444" fill="#ef4444" name="High" />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#7c2d12" fill="#7c2d12" name="Critical" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Login Attempts */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Login Attempts</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics.loginTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  stroke="#666" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString('en-KE')}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="successful" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Successful"
                />
                <Line 
                  type="monotone" 
                  dataKey="failed" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="Failed"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'events', name: 'Security Events', icon: ExclamationTriangleIcon },
            { id: 'logins', name: 'Login Attempts', icon: LockClosedIcon },
            { id: 'settings', name: 'Security Settings', icon: ShieldCheckIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  'flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="w-5 h-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
              </select>

              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Last 24 Hours</option>
                <option value="3d">Last 3 Days</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className={clsx(
                'bg-white rounded-xl shadow-sm border-l-4 p-6 transition-all hover:shadow-md',
                event.severity === 'critical' ? 'border-l-red-500' :
                event.severity === 'high' ? 'border-l-orange-500' :
                event.severity === 'medium' ? 'border-l-yellow-500' : 'border-l-blue-500'
              )}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {getSeverityIcon(event.severity)}
                      <span className={clsx(
                        'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        getSeverityColor(event.severity)
                      )}>
                        {event.severity.toUpperCase()}
                      </span>
                      <span className={clsx(
                        'ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getStatusColor(event.status)
                      )}>
                        {event.status}
                      </span>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h4>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">IP Address:</span> {event.ip_address}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {event.location || 'Unknown'}
                      </div>
                      <div>
                        <span className="font-medium">User:</span> {event.user_name || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Time:</span> {formatDate(event.created_at)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                      <EyeIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'logins' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loginAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserGroupIcon className="w-8 h-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{attempt.email}</div>
                          {attempt.failure_reason && (
                            <div className="text-sm text-red-600">{attempt.failure_reason}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        attempt.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      )}>
                        {attempt.success ? 'Success' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attempt.ip_address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getDeviceIcon(attempt.device_type)}
                        <div className="ml-2">
                          <div className="text-sm text-gray-900">{attempt.device_type}</div>
                          <div className="text-sm text-gray-500">{attempt.browser}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attempt.location || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(attempt.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-600">Require 2FA for all admin accounts</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Session Timeout</p>
                  <p className="text-sm text-gray-600">Automatically log out inactive users</p>
                </div>
                <select className="text-sm border-gray-300 rounded">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Login Rate Limiting</p>
                  <p className="text-sm text-gray-600">Limit failed login attempts</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Monitoring</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Real-time Monitoring</p>
                  <p className="text-sm text-gray-600">Monitor security events in real-time</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Alerts</p>
                  <p className="text-sm text-gray-600">Send alerts for critical events</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto-Block Suspicious IPs</p>
                  <p className="text-sm text-gray-600">Automatically block malicious IP addresses</p>
                </div>
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
