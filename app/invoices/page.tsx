import { getInvoices } from '@/app/actions/invoices';
import { getCustomers } from '@/app/actions/customers';
import InvoicesClient from '@/components/InvoicesClient';
import Header from '@/components/Header';

export default async function InvoicesPage() {
  const [invoicesResult, customersResult] = await Promise.all([
    getInvoices(),
    getCustomers(),
  ]);

  const invoices = invoicesResult.success && invoicesResult.data ? invoicesResult.data : [];
  const customers = customersResult.success && customersResult.data ? customersResult.data : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <InvoicesClient initialInvoices={invoices} customers={customers} />
      </main>
    </div>
  );
}
