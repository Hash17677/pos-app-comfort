'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import InvoiceForm from '@/components/InvoiceForm';
import { addInvoice, cancelInvoice, getInvoices, getInvoiceById } from '@/app/actions/invoices';
import { Customer } from '@/db/schema';
import { toast } from 'sonner';
import { Plus, FileText, X, XCircle, Eye, Download } from 'lucide-react';

interface Invoice {
  invoiceNo: number;
  customerId: string;
  customerName: string | null;
  invoiceAmount: number;
  discountAmount: number;
  netAmount: number;
  status: 'Active' | 'Cancelled';
  remark: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function InvoicesClient({
  initialInvoices,
  customers,
}: {
  initialInvoices: Invoice[];
  customers: Customer[];
}) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cancelingInvoiceNo, setCancelingInvoiceNo] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [viewingInvoice, setViewingInvoice] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const refreshInvoices = async () => {
    const result = await getInvoices();
    if (result.success && result.data) {
      setInvoices(result.data);
    }
  };

  const handleAddInvoice = async (data: {
    customerId: string;
    invoiceAmount: number;
    discountAmount: number;
    netAmount: number;
    items: any[];
  }) => {
    setIsLoading(true);
    const result = await addInvoice(data);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message || 'Invoice created successfully');
      setShowForm(false);
      await refreshInvoices();
    } else {
      toast.error(result.message || 'Failed to create invoice');
    }
  };

  const handleCancelInvoice = async (invoiceNo: number) => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    setIsLoading(true);
    const result = await cancelInvoice(invoiceNo, cancelReason);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message || 'Invoice cancelled successfully');
      setCancelingInvoiceNo(null);
      setCancelReason('');
      await refreshInvoices();
    } else {
      toast.error(result.message || 'Failed to cancel invoice');
    }
  };

  const openCancelDialog = (invoiceNo: number) => {
    setCancelingInvoiceNo(invoiceNo);
    setCancelReason('');
  };

  const closeCancelDialog = () => {
    setCancelingInvoiceNo(null);
    setCancelReason('');
  };

  const handleViewInvoice = async (invoiceNo: number) => {
    setIsLoading(true);
    const result = await getInvoiceById(invoiceNo);
    setIsLoading(false);

    if (result.success && result.data) {
      setViewingInvoice(result.data);
      setIsSheetOpen(true);
    } else {
      toast.error(result.message || 'Failed to load invoice details');
    }
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    setViewingInvoice(null);
  };

  const handleDownloadPDF = async (invoiceNo: number) => {
    try {
      setIsLoading(true);
      
      // Get invoice data
      const result = await getInvoiceById(invoiceNo);
      
      if (!result.success || !result.data) {
        toast.error(result.message || 'Failed to load invoice details');
        setIsLoading(false);
        return;
      }

      // Dynamically import the PDF renderer to avoid SSR issues
      const { pdf } = await import('@react-pdf/renderer');
      const { default: InvoicePDFComponent } = await import('@/components/InvoicePDF');
      
      // Generate PDF
      const blob = await pdf(<InvoicePDFComponent invoice={result.data} />).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `INV-${String(invoiceNo).padStart(6, '0')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded successfully');
      setIsLoading(false);
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoices</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage your sales invoices
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
        )}
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Create New Invoice
          </h3>
          <InvoiceForm
            customers={customers}
            onSubmit={handleAddInvoice}
            onCancel={() => setShowForm(false)}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Cancel Dialog */}
      {cancelingInvoiceNo !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Cancel Invoice #{cancelingInvoiceNo}
              </h3>
              <Button variant="ghost" size="icon" onClick={closeCancelDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cancelReason">Cancellation Reason *</Label>
                <textarea
                  id="cancelReason"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Enter reason for cancellation..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleCancelInvoice(cancelingInvoiceNo)}
                  disabled={isLoading || !cancelReason.trim()}
                  variant="destructive"
                  className="flex-1"
                >
                  {isLoading ? 'Cancelling...' : 'Cancel Invoice'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeCancelDialog}
                  disabled={isLoading}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoices List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first invoice</p>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.invoiceNo} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">#{invoice.invoiceNo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{invoice.customerName || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">Rs. {invoice.invoiceAmount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-600">Rs. {invoice.discountAmount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">
                        Rs. {invoice.netAmount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          invoice.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice.invoiceNo)}
                          disabled={isLoading}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                        {invoice.status === 'Active' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadPDF(invoice.invoiceNo)}
                              disabled={isLoading}
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4 text-green-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openCancelDialog(invoice.invoiceNo)}
                              disabled={showForm || cancelingInvoiceNo !== null}
                              title="Cancel Invoice"
                            >
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invoice Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0 m-0">
          <div className="px-6 py-6 border-b">
            <SheetTitle className="text-2xl">Invoice Details</SheetTitle>
            <SheetDescription className="mt-2">
              Complete information about invoice #{viewingInvoice?.invoiceNo}
            </SheetDescription>
          </div>

          {viewingInvoice && (
            <div className="px-6 p-0 pb-4 space-y-6">
              {/* Invoice Header Info */}
              <div className="bg-gray-50 rounded-lg p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Invoice Number</p>
                    <p className="text-2xl font-bold text-gray-900">#{viewingInvoice.invoiceNo}</p>
                  </div>
                  <span
                    className={`inline-flex px-4 py-2 text-sm font-semibold rounded-full ${
                      viewingInvoice.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {viewingInvoice.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Customer</p>
                    <p className="text-base font-semibold text-gray-900">{viewingInvoice.customerName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date & Time</p>
                    <p className="text-base text-gray-900">
                      {new Date(viewingInvoice.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {new Date(viewingInvoice.createdAt).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>

                {viewingInvoice.status === 'Cancelled' && viewingInvoice.remark && (
                  <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded mt-3">
                    <p className="text-sm font-semibold text-red-800 mb-1">Cancellation Reason</p>
                    <p className="text-sm text-red-700">{viewingInvoice.remark}</p>
                  </div>
                )}
              </div>

              {/* Invoice Items */}
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-gray-900">Items</h4>
                <div className="space-y-3">
                  {viewingInvoice.items?.map((item: any, index: number) => (
                    <div
                      key={item.id}
                      className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <p className="font-semibold text-gray-900 flex-1">{item.itemname}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 rounded px-3 py-2">
                          <p className="text-xs text-gray-500 mb-1">Quantity</p>
                          <p className="text-base font-semibold text-gray-900">{item.qty}</p>
                        </div>
                        <div className="bg-gray-50 rounded px-3 py-2">
                          <p className="text-xs text-gray-500 mb-1">Unit Price</p>
                          <p className="text-base font-semibold text-gray-900">Rs. {item.amount.toFixed(2)}</p>
                        </div>
                        <div className="bg-blue-50 rounded px-3 py-2">
                          <p className="text-xs text-blue-600 mb-1">Total</p>
                          <p className="text-base font-bold text-blue-600">Rs. {(item.qty * item.amount).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="bg-blue-50 rounded-lg p-5 space-y-3 border border-blue-200">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="text-lg font-semibold text-gray-900">Rs. {viewingInvoice.invoiceAmount.toFixed(2)}</span>
                  </div>
                  {viewingInvoice.discountAmount > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Discount</span>
                      <span className="text-lg font-semibold text-red-600">
                        - Rs. {viewingInvoice.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t-2 border-blue-300">
                    <span className="text-lg font-bold text-gray-900">Net Amount</span>
                    <span className="text-2xl font-bold text-blue-600">Rs. {viewingInvoice.netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Download PDF Button */}
              {viewingInvoice.status === 'Active' && (
                <div className="pt-4">
                  <Button
                    onClick={() => handleDownloadPDF(viewingInvoice.invoiceNo)}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? 'Generating PDF...' : 'Download Invoice PDF'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
