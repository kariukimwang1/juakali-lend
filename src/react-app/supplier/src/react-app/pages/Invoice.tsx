import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Send, 
  Eye, 
  Printer, 
  Plus, 
  
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  
  User,
  
} from 'lucide-react';
import { useLanguage } from '@/react-app/hooks/useLanguage';
import AdvancedSpinner from '@/react-app/components/AdvancedSpinner';
import AdvancedSearch from '@/react-app/components/AdvancedSearch';

// Sample invoice data
const invoices = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    orderNumber: 'ORD-2024-001',
    customer: 'John Doe',
    customerEmail: 'john@example.com',
    company: 'Acme Corp',
    status: 'paid',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    subtotal: 45000,
    taxRate: 16,
    taxAmount: 7200,
    totalAmount: 52200,
    paidAmount: 52200,
    balanceAmount: 0,
    items: [
      { name: 'Product A', quantity: 2, unitPrice: 15000, total: 30000 },
      { name: 'Product B', quantity: 1, unitPrice: 15000, total: 15000 }
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    orderNumber: 'ORD-2024-002',
    customer: 'Jane Smith',
    customerEmail: 'jane@company.com',
    company: 'Tech Solutions Ltd',
    status: 'overdue',
    issueDate: '2024-01-10',
    dueDate: '2024-01-25',
    subtotal: 78000,
    taxRate: 16,
    taxAmount: 12480,
    totalAmount: 90480,
    paidAmount: 0,
    balanceAmount: 90480,
    items: [
      { name: 'Service Package', quantity: 1, unitPrice: 78000, total: 78000 }
    ]
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    orderNumber: 'ORD-2024-003',
    customer: 'Mike Johnson',
    customerEmail: 'mike@business.com',
    company: 'Johnson Enterprises',
    status: 'sent',
    issueDate: '2024-01-20',
    dueDate: '2024-02-20',
    subtotal: 125000,
    taxRate: 16,
    taxAmount: 20000,
    totalAmount: 145000,
    paidAmount: 0,
    balanceAmount: 145000,
    items: [
      { name: 'Equipment Set', quantity: 5, unitPrice: 25000, total: 125000 }
    ]
  }
];

const searchFilters = [
  {
    id: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'sent', label: 'Sent' },
      { value: 'paid', label: 'Paid' },
      { value: 'overdue', label: 'Overdue' },
      { value: 'cancelled', label: 'Cancelled' }
    ],
    icon: FileText
  },
  {
    id: 'customer',
    label: 'Customer',
    type: 'text' as const,
    icon: User
  },
  {
    id: 'amount',
    label: 'Amount Range',
    type: 'range' as const,
    icon: DollarSign
  },
  {
    id: 'date',
    label: 'Date Range',
    type: 'date' as const,
    icon: Calendar
  }
];

export default function Invoices() {
  const { t } = useLanguage();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [loading] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'paid': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSearch = (_filters: Record<string, any>) => {
    // Implement search logic here
  };

  const generatePDF = (invoice: any) => {
    // Generate PDF invoice
    console.log('Generating PDF for:', invoice.invoiceNumber);
  };

  const sendInvoice = (invoice: any) => {
    // Send invoice via email
    console.log('Sending invoice:', invoice.invoiceNumber);
  };

  const InvoicePreview = ({ invoice }: { invoice: any }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      {/* Invoice Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">INVOICE</h1>
          <p className="text-slate-600">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">SupplyFlow Pro</h2>
          <p className="text-slate-600">Supplier Dashboard</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Bill To:</h3>
          <div className="space-y-1">
            <p className="font-medium">{invoice.customer}</p>
            <p className="text-slate-600">{invoice.company}</p>
            <p className="text-slate-600">{invoice.customerEmail}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Invoice Details:</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-600">Issue Date:</span>
              <span className="font-medium">{invoice.issueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Due Date:</span>
              <span className="font-medium">{invoice.dueDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Order Number:</span>
              <span className="font-medium">{invoice.orderNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-3 text-slate-900 font-semibold">Item</th>
              <th className="text-right py-3 text-slate-900 font-semibold">Qty</th>
              <th className="text-right py-3 text-slate-900 font-semibold">Unit Price</th>
              <th className="text-right py-3 text-slate-900 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: any, index: number) => (
              <tr key={index} className="border-b border-slate-100">
                <td className="py-3">{item.name}</td>
                <td className="text-right py-3">{item.quantity}</td>
                <td className="text-right py-3">KSh {item.unitPrice.toLocaleString()}</td>
                <td className="text-right py-3">KSh {item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invoice Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-600">Subtotal:</span>
            <span className="font-medium">KSh {invoice.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">VAT ({invoice.taxRate}%):</span>
            <span className="font-medium">KSh {invoice.taxAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold">
            <span>Total:</span>
            <span>KSh {invoice.totalAmount.toLocaleString()}</span>
          </div>
          {invoice.balanceAmount > 0 && (
            <div className="flex justify-between text-red-600 font-semibold">
              <span>Balance Due:</span>
              <span>KSh {invoice.balanceAmount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Information */}
      <div className="mt-8 pt-8 border-t border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-medium mb-2">Bank Details:</p>
            <p>Bank: ABC Bank</p>
            <p>Account: 1234567890</p>
            <p>Branch: Nairobi</p>
          </div>
          <div>
            <p className="font-medium mb-2">Payment Terms:</p>
            <p>Net 30 days</p>
            <p>Late payment charges may apply</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('invoices')}
          </h1>
          <p className="text-slate-600 mt-1">Create and manage invoices</p>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
          <Plus className="w-4 h-4" />
          <span>Create Invoice</span>
        </button>
      </div>

      {/* Search and Filters */}
      <AdvancedSearch
        filters={searchFilters}
        onSearch={handleSearch}
        placeholder="Search invoices by number, customer, or amount..."
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Invoices</p>
              <p className="text-2xl font-bold text-slate-900">{invoices.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Amount</p>
              <p className="text-2xl font-bold text-slate-900">
                KSh {invoices.reduce((sum, inv) => sum + inv.totalAmount, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Paid Amount</p>
              <p className="text-2xl font-bold text-slate-900">
                KSh {invoices.reduce((sum, inv) => sum + inv.paidAmount, 0).toLocaleString()}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Outstanding</p>
              <p className="text-2xl font-bold text-slate-900">
                KSh {invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0).toLocaleString()}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 shadow-lg overflow-hidden">
        {loading ? (
          <AdvancedSpinner size="lg" variant="brand" message="Loading invoices..." className="h-64" />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 divide-y divide-slate-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {invoice.invoiceNumber}
                        </div>
                        <div className="text-sm text-slate-500">
                          {invoice.orderNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {invoice.customer}
                        </div>
                        <div className="text-sm text-slate-500">
                          {invoice.company}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        <span className="ml-1 capitalize">{invoice.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        KSh {invoice.totalAmount.toLocaleString()}
                      </div>
                      {invoice.balanceAmount > 0 && (
                        <div className="text-sm text-red-600">
                          Balance: KSh {invoice.balanceAmount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {invoice.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setShowInvoiceModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => generatePDF(invoice)}
                        className="inline-flex items-center px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors duration-200"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </button>
                      {invoice.status !== 'paid' && (
                        <button
                          onClick={() => sendInvoice(invoice)}
                          className="inline-flex items-center px-3 py-1 bg-orange-50 text-orange-600 text-sm font-medium rounded-lg hover:bg-orange-100 transition-colors duration-200"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Send
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Preview Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="max-w-6xl w-full max-h-screen overflow-y-auto bg-white rounded-xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Invoice Preview</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => generatePDF(selectedInvoice)}
                  className="flex items-center space-x-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => console.log('Print invoice')}
                  className="flex items-center space-x-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <InvoicePreview invoice={selectedInvoice} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
