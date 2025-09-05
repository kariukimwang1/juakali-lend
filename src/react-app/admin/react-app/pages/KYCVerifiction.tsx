import { useState, useEffect } from 'react';
import { 
  DocumentCheckIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  CameraIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import clsx from 'clsx';

interface KYCDocument {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone?: string;
  document_type: string;
  document_url: string;
  selfie_url?: string;
  kra_pin?: string;
  verification_status: string;
  verified_by?: number;
  verification_notes?: string;
  similarity_score?: number;
  created_at: string;
  updated_at: string;
}

export default function KYCVerification() {
  const [documents, setDocuments] = useState<KYCDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('pending');
  const [selectedDocument, setSelectedDocument] = useState<KYCDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchKYCDocuments();
  }, [selectedStatus, searchTerm]);

  const fetchKYCDocuments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: selectedStatus,
        search: searchTerm,
      });

      const response = await fetch(`/api/kyc?${params}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.kyc || []);
      }
    } catch (error) {
      console.error('Failed to fetch KYC documents:', error);
      // Mock data for demo
      setDocuments([
        {
          id: 1,
          user_id: 123,
          user_name: 'John Doe',
          user_email: 'john.doe@example.com',
          user_phone: '+254700123456',
          document_type: 'id_card',
          document_url: 'https://example.com/id1.jpg',
          selfie_url: 'https://example.com/selfie1.jpg',
          kra_pin: 'A123456789B',
          verification_status: 'pending',
          similarity_score: 0.95,
          created_at: '2024-01-20T10:30:00Z',
          updated_at: '2024-01-20T10:30:00Z'
        },
        {
          id: 2,
          user_id: 124,
          user_name: 'Jane Smith',
          user_email: 'jane.smith@example.com',
          user_phone: '+254701234567',
          document_type: 'passport',
          document_url: 'https://example.com/passport1.jpg',
          selfie_url: 'https://example.com/selfie2.jpg',
          verification_status: 'verified',
          similarity_score: 0.98,
          created_at: '2024-01-19T14:22:00Z',
          updated_at: '2024-01-19T16:15:00Z'
        },
        {
          id: 3,
          user_id: 125,
          user_name: 'Mike Johnson',
          user_email: 'mike.johnson@business.com',
          user_phone: '+254702345678',
          document_type: 'business_license',
          document_url: 'https://example.com/license1.jpg',
          verification_status: 'rejected',
          verification_notes: 'Document quality too low, please resubmit',
          created_at: '2024-01-18T09:15:00Z',
          updated_at: '2024-01-18T11:30:00Z'
        }
      ].filter(doc => selectedStatus === '' || doc.verification_status === selectedStatus));
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (documentId: number, status: 'verified' | 'rejected', notes?: string) => {
    try {
      const response = await fetch(`/api/kyc/${documentId}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes })
      });

      if (response.ok) {
        fetchKYCDocuments();
        setSelectedDocument(null);
      }
    } catch (error) {
      console.error('Failed to update verification status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'id_card':
        return <DocumentTextIcon className="w-5 h-5" />;
      case 'passport':
        return <DocumentCheckIcon className="w-5 h-5" />;
      case 'business_license':
        return <DocumentTextIcon className="w-5 h-5" />;
      default:
        return <DocumentTextIcon className="w-5 h-5" />;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC Verification</h1>
          <p className="text-gray-600">Review and verify customer identity documents</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <ClockIcon className="w-4 h-4 mr-2" />
            {documents.filter(d => d.verification_status === 'pending').length} Pending Review
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Submissions', value: '1,247', icon: DocumentTextIcon, color: 'blue' },
          { label: 'Pending Review', value: documents.filter(d => d.verification_status === 'pending').length.toString(), icon: ClockIcon, color: 'yellow' },
          { label: 'Verified', value: documents.filter(d => d.verification_status === 'verified').length.toString(), icon: CheckIcon, color: 'green' },
          { label: 'Rejected', value: documents.filter(d => d.verification_status === 'rejected').length.toString(), icon: XMarkIcon, color: 'red' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={clsx(
                  'w-12 h-12 rounded-lg flex items-center justify-center',
                  stat.color === 'blue' && 'bg-blue-100 text-blue-600',
                  stat.color === 'yellow' && 'bg-yellow-100 text-yellow-600',
                  stat.color === 'green' && 'bg-green-100 text-green-600',
                  stat.color === 'red' && 'bg-red-100 text-red-600'
                )}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>

          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">All Document Types</option>
            <option value="id_card">ID Card</option>
            <option value="passport">Passport</option>
            <option value="business_license">Business License</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
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
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Similarity Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <UserIcon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doc.user_name}</div>
                          <div className="text-sm text-gray-500">{doc.user_email}</div>
                          {doc.user_phone && (
                            <div className="text-sm text-gray-500">{doc.user_phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getDocumentTypeIcon(doc.document_type)}
                        <span className="ml-2 text-sm text-gray-900 capitalize">
                          {doc.document_type.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        getStatusColor(doc.verification_status)
                      )}>
                        {doc.verification_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.similarity_score ? (
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={clsx(
                                'h-2 rounded-full transition-all',
                                doc.similarity_score >= 0.9 ? 'bg-green-500' : 
                                doc.similarity_score >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                              )}
                              style={{ width: `${doc.similarity_score * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">
                            {(doc.similarity_score * 100).toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(doc.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedDocument(doc)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Document Review Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-900 opacity-75" onClick={() => setSelectedDocument(null)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Document Verification</h3>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Document Images */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Document Image</h4>
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <CameraIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                  {selectedDocument.selfie_url && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Selfie</h4>
                      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                        <UserIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">User Information</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-gray-600">Name: {selectedDocument.user_name}</p>
                      <p className="text-sm text-gray-600">Email: {selectedDocument.user_email}</p>
                      {selectedDocument.user_phone && (
                        <p className="text-sm text-gray-600">Phone: {selectedDocument.user_phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Document Details</h4>
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-gray-600">Type: {selectedDocument.document_type.replace('_', ' ')}</p>
                      {selectedDocument.kra_pin && (
                        <p className="text-sm text-gray-600">KRA PIN: {selectedDocument.kra_pin}</p>
                      )}
                      {selectedDocument.similarity_score && (
                        <p className="text-sm text-gray-600">
                          Similarity Score: {(selectedDocument.similarity_score * 100).toFixed(1)}%
                        </p>
                      )}
                      <p className="text-sm text-gray-600">
                        Status: <span className={clsx(
                          'font-medium',
                          selectedDocument.verification_status === 'verified' ? 'text-green-600' :
                          selectedDocument.verification_status === 'rejected' ? 'text-red-600' :
                          'text-yellow-600'
                        )}>
                          {selectedDocument.verification_status}
                        </span>
                      </p>
                    </div>
                  </div>

                  {selectedDocument.verification_notes && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Verification Notes</h4>
                      <p className="mt-2 text-sm text-gray-600">{selectedDocument.verification_notes}</p>
                    </div>
                  )}

                  {selectedDocument.verification_status === 'pending' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-1">
                          Verification Notes (optional)
                        </label>
                        <textarea
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add notes about the verification decision..."
                        />
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleVerification(selectedDocument.id, 'verified')}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          <CheckIcon className="w-4 h-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerification(selectedDocument.id, 'rejected')}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
