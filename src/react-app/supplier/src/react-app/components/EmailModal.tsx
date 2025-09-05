import { useState } from 'react';
import { Mail, Send, Paperclip, X, Users } from 'lucide-react';
import AdvancedSpinner from './AdvancedSpinner';
import toast from 'react-hot-toast';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  to?: string;
  subject?: string;
  content?: string;
  attachments?: EmailAttachment[];
  onSend?: (emailData: EmailData) => Promise<void>;
}

interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

interface EmailData {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  content: string;
  attachments: EmailAttachment[];
  priority: 'low' | 'normal' | 'high';
  template?: string;
}

const emailTemplates = [
  {
    id: 'invoice',
    name: 'Invoice',
    subject: 'Invoice #{invoiceNumber} - Payment Due',
    content: `Dear {customerName},

Please find attached invoice #{invoiceNumber} for your recent order.

Invoice Details:
- Invoice Number: #{invoiceNumber}
- Amount: KSh {amount}
- Due Date: {dueDate}

You can pay using the following methods:
- M-Pesa: [Paybill Number]
- Bank Transfer: [Account Details]

Thank you for your business.

Best regards,
{companyName}`
  },
  {
    id: 'order_confirmation',
    name: 'Order Confirmation',
    subject: 'Order Confirmation #{orderNumber}',
    content: `Dear {customerName},

Thank you for your order! We have received your order and it is being processed.

Order Details:
- Order Number: #{orderNumber}
- Total Amount: KSh {amount}
- Estimated Delivery: {deliveryDate}

We will notify you once your order has been shipped.

Best regards,
{companyName}`
  },
  {
    id: 'delivery_notification',
    name: 'Delivery Notification',
    subject: 'Your order is out for delivery #{orderNumber}',
    content: `Dear {customerName},

Great news! Your order #{orderNumber} is out for delivery and should arrive today.

Delivery Details:
- Tracking Number: {trackingNumber}
- Estimated Delivery Time: {deliveryTime}
- Driver Contact: {driverPhone}

Please ensure someone is available to receive the delivery.

Best regards,
{companyName}`
  }
];

export default function EmailModal({
  isOpen,
  onClose,
  to = '',
  subject = '',
  content = '',
  attachments = [],
  onSend
}: EmailModalProps) {
  const [emailData, setEmailData] = useState<EmailData>({
    to: to ? [to] : [],
    cc: [],
    bcc: [],
    subject,
    content,
    attachments,
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [showCcBcc, setShowCcBcc] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (emailData.to.length === 0) {
      toast.error('Please enter at least one recipient');
      return;
    }

    if (!emailData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!emailData.content.trim()) {
      toast.error('Please enter email content');
      return;
    }

    setLoading(true);
    try {
      await onSend?.(emailData);
      toast.success('Email sent successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setEmailData(prev => ({
        ...prev,
        subject: template.subject,
        content: template.content
      }));
    }
  };

  const addRecipient = (field: 'to' | 'cc' | 'bcc', email: string) => {
    if (email && !emailData[field].includes(email)) {
      setEmailData(prev => ({
        ...prev,
        [field]: [...prev[field], email]
      }));
    }
  };

  const removeRecipient = (field: 'to' | 'cc' | 'bcc', email: string) => {
    setEmailData(prev => ({
      ...prev,
      [field]: prev[field].filter(e => e !== email)
    }));
  };

  const removeAttachment = (attachmentId: string) => {
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== attachmentId)
    }));
  };

  const EmailInputField = ({ 
    label, 
    field, 
    placeholder 
  }: { 
    label: string; 
    field: 'to' | 'cc' | 'bcc'; 
    placeholder: string 
  }) => {
    const [inputValue, setInputValue] = useState('');

    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
        <div className="space-y-2">
          <input
            type="email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addRecipient(field, inputValue.trim());
                setInputValue('');
              }
            }}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {emailData[field].length > 0 && (
            <div className="flex flex-wrap gap-2">
              {emailData[field].map((email) => (
                <span
                  key={email}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {email}
                  <button
                    onClick={() => removeRecipient(field, email)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="max-w-4xl w-full max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <Mail className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900">Compose Email</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl"
          >
            ×
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Email Template Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Template (optional)
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value);
                  if (e.target.value) applyTemplate(e.target.value);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a template</option>
                {emailTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipients */}
            <EmailInputField 
              label="To *" 
              field="to" 
              placeholder="Enter recipient email and press Enter" 
            />

            {!showCcBcc && (
              <button
                onClick={() => setShowCcBcc(true)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Add Cc/Bcc
              </button>
            )}

            {showCcBcc && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EmailInputField 
                  label="Cc" 
                  field="cc" 
                  placeholder="Enter Cc email and press Enter" 
                />
                <EmailInputField 
                  label="Bcc" 
                  field="bcc" 
                  placeholder="Enter Bcc email and press Enter" 
                />
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email subject"
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Priority
              </label>
              <select
                value={emailData.priority}
                onChange={(e) => setEmailData(prev => ({ ...prev, priority: e.target.value as 'low' | 'normal' | 'high' }))}
                className="w-32 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Attachments */}
            {emailData.attachments.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Attachments
                </label>
                <div className="space-y-2">
                  {emailData.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Paperclip className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">
                          {attachment.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message Content *
              </label>
              <textarea
                value={emailData.content}
                onChange={(e) => setEmailData(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="Enter your message content here..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <Users className="w-4 h-4" />
            <span>{emailData.to.length} recipient(s)</span>
            {emailData.attachments.length > 0 && (
              <>
                <Paperclip className="w-4 h-4 ml-4" />
                <span>{emailData.attachments.length} attachment(s)</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={loading || emailData.to.length === 0 || !emailData.subject.trim() || !emailData.content.trim()}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <AdvancedSpinner size="sm" />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Email</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
