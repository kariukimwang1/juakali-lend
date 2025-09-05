import { useState } from 'react';
import { X, Send, Paperclip, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  to?: string[];
  subject?: string;
  onSend: (emailData: EmailData) => Promise<void>;
}

interface EmailData {
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  attachments?: File[];
}

export default function EmailModal({
  isOpen,
  onClose,
  to = [],
  subject = '',
  onSend
}: EmailModalProps) {
  const [emailData, setEmailData] = useState<EmailData>({
    to: to,
    subject: subject,
    body: '',
    cc: [],
    bcc: [],
    attachments: []
  });
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleInputChange = (field: keyof EmailData, value: any) => {
    setEmailData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmailListChange = (field: 'to' | 'cc' | 'bcc', value: string) => {
    const emails = value.split(',').map(email => email.trim()).filter(Boolean);
    handleInputChange(field, emails);
  };

  const handleFileAttachment = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setEmailData(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), ...fileArray]
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSend = async () => {
    if (!emailData.to.length || !emailData.subject || !emailData.body) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSending(true);
    try {
      await onSend(emailData);
      onClose();
    } catch (error) {
      console.error('Failed to send email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Compose Email</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* To Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To *
            </label>
            <input
              type="text"
              value={emailData.to?.join(', ') || ''}
              onChange={(e) => handleEmailListChange('to', e.target.value)}
              placeholder="email@example.com, email2@example.com"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* CC/BCC Controls */}
          <div className="flex space-x-4 text-sm">
            {!showCc && (
              <button
                onClick={() => setShowCc(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Add Cc
              </button>
            )}
            {!showBcc && (
              <button
                onClick={() => setShowBcc(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                Add Bcc
              </button>
            )}
          </div>

          {/* CC Field */}
          {showCc && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cc
              </label>
              <input
                type="text"
                value={emailData.cc?.join(', ') || ''}
                onChange={(e) => handleEmailListChange('cc', e.target.value)}
                placeholder="email@example.com, email2@example.com"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* BCC Field */}
          {showBcc && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bcc
              </label>
              <input
                type="text"
                value={emailData.bcc?.join(', ') || ''}
                onChange={(e) => handleEmailListChange('bcc', e.target.value)}
                placeholder="email@example.com, email2@example.com"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {/* Subject Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="Email subject"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Body Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              value={emailData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              rows={8}
              placeholder="Type your message here..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Attachments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Attachments
              </label>
              <label className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                <Paperclip className="h-4 w-4" />
                <span>Attach Files</span>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileAttachment(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>

            {emailData.attachments && emailData.attachments.length > 0 && (
              <div className="space-y-2">
                {emailData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                  >
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            {emailData.to?.length || 0} recipient(s)
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || !emailData.to?.length || !emailData.subject || !emailData.body}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isSending ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
