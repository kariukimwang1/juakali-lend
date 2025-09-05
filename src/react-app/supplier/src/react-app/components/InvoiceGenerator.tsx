import { useState } from 'react';
import { FileText, Download, Send, Eye, Printer, Calendar, DollarSign } from 'lucide-react';
import AdvancedSpinner from './AdvancedSpinner';
import EmailModal from './EmailModal';
import toast from 'react-hot-toast';

interface InvoiceGeneratorProps {
  orderId?: number;
  customerId?: number;
  onInvoiceGenerated?: (invoice: Invoice) => void;
  className?: string;
}

interface InvoiceItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface Invoice {
  id?: number;
  invoiceNumber: string;
  orderId?: number;
  customerId: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
}

export default function InvoiceGenerator({
  orderId,
  customerId,
  onInvoiceGenerated,
  className = ""
}: InvoiceGeneratorProps) {
  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: `INV-${Date.now()}`,
    customerId: customerId || 0,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    subtotal: 0,
    taxRate: 16,
    taxAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    notes: '',
    status: 'draft'
  });

  const [loading, setLoading] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      productName: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      total: 0
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          // Recalculate total
          const subtotal = updatedItem.quantity * updatedItem.unitPrice;
          const discountAmount = (subtotal * updatedItem.discount) / 100;
          updatedItem.total = subtotal - discountAmount;
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const removeItem = (itemId: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const calculateTotals = () => {
    const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal * invoice.taxRate) / 100;
    const totalAmount = subtotal + taxAmount - invoice.discountAmount;

    setInvoice(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      totalAmount
    }));
  };

  // Recalculate totals when items change
  React.useEffect(() => {
    calculateTotals();
  }, [invoice.items, invoice.taxRate, invoice.discountAmount]);

  const generateInvoice = async () => {
    if (!invoice.customerName.trim()) {
      toast.error('Please enter customer name');
      return;
    }

    if (invoice.items.length === 0) {
      toast.error('Please add at least one item');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedInvoice = {
        ...invoice,
        id: Math.floor(Math.random() * 1000),
        status: 'draft' as const
      };

      onInvoiceGenerated?.(generatedInvoice);
      toast.success('Invoice generated successfully');
    } catch (error) {
      toast.error('Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async () => {
    setLoading(true);
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    } finally {
      setLoading(false);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const sendInvoiceEmail = async (emailData: any) => {
    setLoading(true);
    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Invoice sent successfully');
      setShowEmailModal(false);
    } catch (error) {
      toast.error('Failed to send invoice');
    } finally {
      setLoading(false);
    }
  };

  const InvoicePreview = () => (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">INVOICE</h1>
          <p className="text-slate-600">#{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-blue-600 mb-2">SupplyFlow Pro</h2>
          <p className="text-slate-600">Your Business Address</p>
          <p className="text-slate-600">Phone: +254 XXX XXX XXX</p>
          <p className="text-slate-600">Email: info@supplyflow.com</p>
        </div>
      </div>

      {/* Customer & Invoice Details */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-slate-900 mb-2">Bill To:</h3>
          <p className="text-slate-700 font-medium">{invoice.customerName}</p>
          {invoice.customerEmail && <p className="text-slate-600">{invoice.customerEmail}</p>}
          {invoice.customerPhone && <p className="text-slate-600">{invoice.customerPhone}</p>}
          {invoice.customerAddress && <p className="text-slate-600">{invoice.customerAddress}</p>}
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-600">Issue Date:</p>
              <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-slate-600">Due Date:</p>
              <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-4 py-2 text-left">Item</th>
              <th className="border border-slate-300 px-4 py-2 text-right">Qty</th>
              <th className="border border-slate-300 px-4 py-2 text-right">Unit Price</th>
              <th className="border border-slate-300 px-4 py-2 text-right">Discount</th>
              <th className="border border-slate-300 px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="border border-slate-300 px-4 py-2">{item.productName}</td>
                <td className="border border-slate-300 px-4 py-2 text-right">{item.quantity}</td>
                <td className="border border-slate-300 px-4 py-2 text-right">KSh {item.unitPrice.toLocaleString()}</td>
                <td className="border border-slate-300 px-4 py-2 text-right">{item.discount}%</td>
                <td className="border border-slate-300 px-4 py-2 text-right">KSh {item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>KSh {invoice.subtotal.toLocaleString()}</span>
          </div>
          {invoice.discountAmount > 0 && (
            <div className="flex justify-between py-2">
              <span>Discount:</span>
              <span>-KSh {invoice.discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between py-2">
            <span>Tax ({invoice.taxRate}%):</span>
            <span>KSh {invoice.taxAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-slate-300 font-bold text-lg">
            <span>Total:</span>
            <span>KSh {invoice.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mb-8">
          <h3 className="font-semibold text-slate-900 mb-2">Notes:</h3>
          <p className="text-slate-700">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-slate-300 pt-4 text-center text-slate-600">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );

  if (previewMode) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="flex items-center justify-between">
          <button
            onClick={() => setPreviewMode(false)}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Edit
          </button>
          <div className="flex items-center space-x-3">
            <button
              onClick={printInvoice}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={downloadInvoice}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              {loading ? <AdvancedSpinner size="sm" /> : <Download className="w-4 h-4" />}
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => setShowEmailModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Send className="w-4 h-4" />
              <span>Send Email</span>
            </button>
          </div>
        </div>
        <InvoicePreview />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Invoice Generator</h2>
              <p className="text-slate-600">Create and manage invoices</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setPreviewMode(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={generateInvoice}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? <AdvancedSpinner size="sm" /> : <FileText className="w-4 h-4" />}
              <span>Generate Invoice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Customer Name *</label>
              <input
                type="text"
                value={invoice.customerName}
                onChange={(e) => setInvoice(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={invoice.customerEmail}
                onChange={(e) => setInvoice(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="customer@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                value={invoice.customerPhone}
                onChange={(e) => setInvoice(prev => ({ ...prev, customerPhone: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+254 XXX XXX XXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
              <textarea
                value={invoice.customerAddress}
                onChange={(e) => setInvoice(prev => ({ ...prev, customerAddress: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Customer address"
              />
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Invoice Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Invoice Number</label>
              <input
                type="text"
                value={invoice.invoiceNumber}
                onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Issue Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="date"
                    value={invoice.issueDate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, issueDate: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="date"
                    value={invoice.dueDate}
                    onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={invoice.taxRate}
                  onChange={(e) => setInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Discount Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={invoice.discountAmount}
                    onChange={(e) => setInvoice(prev => ({ ...prev, discountAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
              <textarea
                value={invoice.notes}
                onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Additional notes or payment terms"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Invoice Items</h3>
          <button
            onClick={addItem}
            className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>

        {invoice.items.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No items added yet. Click "Add Item" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-4">Product</th>
                  <th className="text-right py-2 px-4">Qty</th>
                  <th className="text-right py-2 px-4">Unit Price</th>
                  <th className="text-right py-2 px-4">Discount %</th>
                  <th className="text-right py-2 px-4">Total</th>
                  <th className="text-right py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={item.productName}
                        onChange={(e) => updateItem(item.id, 'productName', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Product name"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-20 px-2 py-1 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={item.discount}
                        onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-slate-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-right"
                      />
                    </td>
                    <td className="py-2 px-4 text-right font-medium">
                      KSh {item.total.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totals */}
        {invoice.items.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>KSh {invoice.subtotal.toLocaleString()}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-KSh {invoice.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax ({invoice.taxRate}%):</span>
                  <span>KSh {invoice.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>KSh {invoice.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        to={invoice.customerEmail}
        subject={`Invoice ${invoice.invoiceNumber} - SupplyFlow Pro`}
        content={`Dear ${invoice.customerName},

Please find attached invoice ${invoice.invoiceNumber} for KSh ${invoice.totalAmount.toLocaleString()}.

Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}

Thank you for your business!

Best regards,
SupplyFlow Pro`}
        onSend={sendInvoiceEmail}
      />
    </div>
  );
}
