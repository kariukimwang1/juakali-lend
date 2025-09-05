import { useState, useEffect } from 'react';
import { 
  MapPin, Truck, Clock, CheckCircle, AlertTriangle, Phone, 
  Navigation, Star, MessageSquare, Camera, FileText, RefreshCw
} from 'lucide-react';
import AdvancedSpinner from './AdvancedSpinner';
import toast from 'react-hot-toast';

interface DeliveryTrackerProps {
  deliveryId: number;
  onStatusUpdate?: (deliveryId: number, status: string) => void;
  className?: string;
}

interface DeliveryStatus {
  id: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  timestamp: string;
  location?: string;
  note?: string;
  driver?: string;
}

interface DeliveryInfo {
  id: number;
  deliveryNumber: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  estimatedTime: number;
  actualTime?: number;
  distance: number;
  status: string;
  driver: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
  };
  timeline: DeliveryStatus[];
  deliveryProof?: {
    type: 'signature' | 'photo' | 'both';
    data: string;
    timestamp: string;
  };
  customerFeedback?: {
    rating: number;
    comment: string;
    timestamp: string;
  };
}

const sampleDelivery: DeliveryInfo = {
  id: 1,
  deliveryNumber: 'DEL-2024-001',
  orderNumber: 'ORD-2024-001',
  customerName: 'John Doe',
  customerPhone: '+254712345678',
  pickupAddress: '123 Warehouse St, Industrial Area, Nairobi',
  deliveryAddress: '456 Customer Ave, Westlands, Nairobi',
  estimatedTime: 45,
  actualTime: 52,
  distance: 15.5,
  status: 'in_transit',
  driver: {
    name: 'Samuel Kiprotich',
    phone: '+254723456789',
    vehicle: 'KCA 123X - Toyota Hilux',
    rating: 4.8
  },
  timeline: [
    {
      id: '1',
      status: 'pending',
      timestamp: '2024-01-16T08:00:00Z',
      note: 'Delivery scheduled'
    },
    {
      id: '2',
      status: 'picked_up',
      timestamp: '2024-01-16T08:30:00Z',
      location: 'Warehouse - Industrial Area',
      note: 'Package picked up from warehouse',
      driver: 'Samuel Kiprotich'
    },
    {
      id: '3',
      status: 'in_transit',
      timestamp: '2024-01-16T09:15:00Z',
      location: 'Uhuru Highway',
      note: 'En route to destination',
      driver: 'Samuel Kiprotich'
    }
  ]
};

export default function DeliveryTracker({
  deliveryId,
  onStatusUpdate,
  className = ""
}: DeliveryTrackerProps) {
  const [delivery, setDelivery] = useState<DeliveryInfo>(sampleDelivery);
  const [loading, setLoading] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [proofType, setProofType] = useState<'signature' | 'photo'>('photo');
  const [proofData, setProofData] = useState('');
  const [customerRating, setCustomerRating] = useState(5);
  const [customerComment, setCustomerComment] = useState('');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Randomly update location or add new status
      if (Math.random() > 0.7 && delivery.status === 'in_transit') {
        const locations = [
          'Kenyatta Avenue',
          'Haile Selassie Avenue',
          'Waiyaki Way',
          'Westlands Roundabout'
        ];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        
        setDelivery(prev => ({
          ...prev,
          timeline: [
            ...prev.timeline,
            {
              id: `update-${Date.now()}`,
              status: 'in_transit',
              timestamp: new Date().toISOString(),
              location: randomLocation,
              note: `Passing through ${randomLocation}`,
              driver: prev.driver.name
            }
          ]
        }));
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [delivery.status]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5" />;
      case 'picked_up': return <Truck className="w-5 h-5" />;
      case 'in_transit': return <Navigation className="w-5 h-5" />;
      case 'out_for_delivery': return <MapPin className="w-5 h-5" />;
      case 'delivered': return <CheckCircle className="w-5 h-5" />;
      case 'failed': return <AlertTriangle className="w-5 h-5" />;
      case 'returned': return <AlertTriangle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'picked_up': return 'text-blue-600 bg-blue-100';
      case 'in_transit': return 'text-purple-600 bg-purple-100';
      case 'out_for_delivery': return 'text-orange-600 bg-orange-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'returned': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStatusUpdate: DeliveryStatus = {
        id: `status-${Date.now()}`,
        status: newStatus as any,
        timestamp: new Date().toISOString(),
        location: newStatus === 'delivered' ? delivery.deliveryAddress : undefined,
        note: getStatusNote(newStatus),
        driver: delivery.driver.name
      };

      setDelivery(prev => ({
        ...prev,
        status: newStatus,
        timeline: [...prev.timeline, newStatusUpdate]
      }));

      onStatusUpdate?.(deliveryId, newStatus);
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusNote = (status: string) => {
    switch (status) {
      case 'out_for_delivery': return 'Out for delivery - arriving soon';
      case 'delivered': return 'Package delivered successfully';
      case 'failed': return 'Delivery attempt failed';
      case 'returned': return 'Package returned to sender';
      default: return '';
    }
  };

  const submitDeliveryProof = async () => {
    if (!proofData.trim()) {
      toast.error('Please provide delivery proof');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDelivery(prev => ({
        ...prev,
        deliveryProof: {
          type: proofType,
          data: proofData,
          timestamp: new Date().toISOString()
        }
      }));

      toast.success('Delivery proof submitted successfully');
      setShowProofModal(false);
      setProofData('');
    } catch (error) {
      toast.error('Failed to submit delivery proof');
    } finally {
      setLoading(false);
    }
  };

  const submitCustomerFeedback = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDelivery(prev => ({
        ...prev,
        customerFeedback: {
          rating: customerRating,
          comment: customerComment,
          timestamp: new Date().toISOString()
        }
      }));

      toast.success('Feedback submitted successfully');
      setShowFeedbackModal(false);
      setCustomerComment('');
    } catch (error) {
      toast.error('Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const refreshTracking = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Tracking information refreshed');
    } catch (error) {
      toast.error('Failed to refresh tracking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Delivery Tracking</h3>
            <p className="text-slate-600">Track your delivery in real-time</p>
          </div>
          <button
            onClick={refreshTracking}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Delivery Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Delivery Information</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-slate-600">Delivery Number</p>
                <p className="font-medium text-slate-900">{delivery.deliveryNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Order Number</p>
                <p className="font-medium text-slate-900">{delivery.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Customer</p>
                <p className="font-medium text-slate-900">{delivery.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-medium text-slate-900">{delivery.customerPhone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pickup Address</p>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-900">{delivery.pickupAddress}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Delivery Address</p>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-900">{delivery.deliveryAddress}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200">
              <div className="text-center">
                <p className="text-sm text-slate-600">Distance</p>
                <p className="text-lg font-semibold text-slate-900">{delivery.distance} km</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600">Est. Time</p>
                <p className="text-lg font-semibold text-slate-900">{delivery.estimatedTime} min</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-600">Actual Time</p>
                <p className="text-lg font-semibold text-slate-900">
                  {delivery.actualTime ? `${delivery.actualTime} min` : 'In progress'}
                </p>
              </div>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-6">Delivery Timeline</h4>
            
            <div className="space-y-4">
              {delivery.timeline.map((status, index) => (
                <div key={status.id} className="flex items-start space-x-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${getStatusColor(status.status)}`}>
                    {getStatusIcon(status.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900 capitalize">
                        {status.status.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(status.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {status.location && (
                      <p className="text-sm text-slate-600">📍 {status.location}</p>
                    )}
                    {status.note && (
                      <p className="text-sm text-slate-600">{status.note}</p>
                    )}
                    {status.driver && (
                      <p className="text-xs text-slate-500">Driver: {status.driver}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Driver & Actions */}
        <div className="space-y-6">
          {/* Driver Information */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Driver Information</h4>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {delivery.driver.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{delivery.driver.name}</p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(delivery.driver.rating)
                            ? 'text-yellow-500 fill-current'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-slate-500 ml-1">
                      {delivery.driver.rating}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <p className="font-medium text-slate-900">{delivery.driver.phone}</p>
              </div>
              
              <div>
                <p className="text-sm text-slate-600">Vehicle</p>
                <p className="font-medium text-slate-900">{delivery.driver.vehicle}</p>
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  onClick={() => window.open(`tel:${delivery.driver.phone}`)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => window.open(`sms:${delivery.driver.phone}`)}
                  className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>SMS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Current Status</h4>
            
            <div className={`flex items-center space-x-3 p-4 rounded-lg ${getStatusColor(delivery.status)}`}>
              {getStatusIcon(delivery.status)}
              <div>
                <p className="font-medium capitalize">
                  {delivery.status.replace('_', ' ')}
                </p>
                <p className="text-sm opacity-75">
                  Last updated: {new Date(delivery.timeline[delivery.timeline.length - 1].timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
            <h4 className="text-lg font-semibold text-slate-900 mb-4">Actions</h4>
            
            <div className="space-y-3">
              {delivery.status === 'in_transit' && (
                <button
                  onClick={() => updateStatus('out_for_delivery')}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50"
                >
                  {loading ? <AdvancedSpinner size="sm" /> : <MapPin className="w-4 h-4" />}
                  <span>Mark Out for Delivery</span>
                </button>
              )}
              
              {delivery.status === 'out_for_delivery' && (
                <>
                  <button
                    onClick={() => setShowProofModal(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Add Delivery Proof</span>
                  </button>
                  <button
                    onClick={() => updateStatus('delivered')}
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                  >
                    {loading ? <AdvancedSpinner size="sm" /> : <CheckCircle className="w-4 h-4" />}
                    <span>Mark as Delivered</span>
                  </button>
                </>
              )}
              
              {delivery.status === 'delivered' && !delivery.customerFeedback && (
                <button
                  onClick={() => setShowFeedbackModal(true)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Star className="w-4 h-4" />
                  <span>Add Customer Feedback</span>
                </button>
              )}
              
              {delivery.status !== 'delivered' && delivery.status !== 'failed' && (
                <button
                  onClick={() => updateStatus('failed')}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {loading ? <AdvancedSpinner size="sm" /> : <AlertTriangle className="w-4 h-4" />}
                  <span>Mark as Failed</span>
                </button>
              )}
            </div>
          </div>

          {/* Delivery Proof */}
          {delivery.deliveryProof && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Delivery Proof</h4>
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Type: {delivery.deliveryProof.type}</p>
                <p className="text-sm text-slate-600">
                  Submitted: {new Date(delivery.deliveryProof.timestamp).toLocaleString()}
                </p>
                <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-900">{delivery.deliveryProof.data}</p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Feedback */}
          {delivery.customerFeedback && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
              <h4 className="text-lg font-semibold text-slate-900 mb-4">Customer Feedback</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < delivery.customerFeedback!.rating
                          ? 'text-yellow-500 fill-current'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-slate-600 ml-2">
                    {delivery.customerFeedback.rating}/5
                  </span>
                </div>
                <p className="text-sm text-slate-900">{delivery.customerFeedback.comment}</p>
                <p className="text-xs text-slate-500">
                  {new Date(delivery.customerFeedback.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="max-w-md w-full bg-white rounded-xl shadow-2xl">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">Add Delivery Proof</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Proof Type
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="photo"
                      checked={proofType === 'photo'}
                      onChange={(e) => setProofType(e.target.value as 'photo')}
                      className="mr-2"
                    />
                    Photo
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="signature"
                      checked={proofType === 'signature'}
                      onChange={(e) => setProofType(e.target.value as 'signature')}
                      className="mr-2"
                    />
                    Signature
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {proofType === 'photo' ? 'Photo Description' : 'Signature Details'}
                </label>
                <textarea
                  value={proofData}
                  onChange={(e) => setProofData(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={proofType === 'photo' ? 'Describe the photo taken...' : 'Signature details...'}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowProofModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitDeliveryProof}
                  disabled={loading || !proofData.trim()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? <AdvancedSpinner size="sm" /> : <FileText className="w-4 h-4" />}
                  <span>Submit Proof</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="max-w-md w-full bg-white rounded-xl shadow-2xl">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-xl font-bold text-slate-900">Customer Feedback</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setCustomerRating(rating)}
                      className={`w-8 h-8 ${
                        rating <= customerRating
                          ? 'text-yellow-500'
                          : 'text-slate-300'
                      }`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={customerComment}
                  onChange={(e) => setCustomerComment(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Customer feedback about the delivery..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitCustomerFeedback}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? <AdvancedSpinner size="sm" /> : <Star className="w-4 h-4" />}
                  <span>Submit Feedback</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
