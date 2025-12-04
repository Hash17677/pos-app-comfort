import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';
import LogoutButton from '@/components/LogoutButton';

export default async function Header() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Shop Name with Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Comfort Zone Holdings Logo"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <h1 className="text-xl font-bold text-gray-900">
                COMFORT ZONE HOLDINGS
              </h1>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
                  <User className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {session.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{session.role}</p>
                </div>
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Links */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 py-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 pb-1"
            >
              Dashboard
            </Link>
            <Link
              href="/customers"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 pb-1"
            >
              Customers
            </Link>
            <Link
              href="/invoices"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 pb-1"
            >
              Invoices
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
