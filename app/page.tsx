import Header from '@/components/Header';
import { db } from '@/db';
import { customers, invoiceheader } from '@/db/schema';
import { count, sum } from 'drizzle-orm';
import { eq } from 'drizzle-orm';

export default async function DashboardPage() {
  // Get total customers count
  const customerCountResult = await db
    .select({ total: count() })
    .from(customers);
  const totalCustomers = customerCountResult[0]?.total || 0;

  // Get total invoices count (Active only)
  const invoiceCountResult = await db
    .select({ total: count() })
    .from(invoiceheader)
    .where(eq(invoiceheader.status, 'Active'));
  const totalInvoices = invoiceCountResult[0]?.total || 0;

  // Get total revenue (sum of netAmount from ALL invoices)
  const revenueResult = await db
    .select({ total: sum(invoiceheader.netAmount) })
    .from(invoiceheader);
  
  const totalRevenue = revenueResult[0]?.total ? Number(revenueResult[0].total) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Dashboard Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Dashboard Cards */}
          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Customers</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalCustomers}</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Invoices</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{totalInvoices}</p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">Rs. {totalRevenue.toFixed(2)}</p>
          </div>
        </div>

      </main>
    </div>
  );
}
