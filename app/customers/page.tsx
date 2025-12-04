import { getCustomers } from '@/app/actions/customers';
import CustomersClient from '@/components/CustomersClient';
import Header from '@/components/Header';

export default async function CustomersPage() {
  const result = await getCustomers();
  const customers = result.success && result.data ? result.data : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CustomersClient initialCustomers={customers} />
      </main>
    </div>
  );
}
