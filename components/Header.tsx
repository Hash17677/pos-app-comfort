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
        <div className="mx-auto max-w-7xl px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2">
            {/* Shop Name with Logo */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Image
                src="/logo.jpg"
                alt="Comfort Zone Holdings Logo"
                width={40}
                height={40}
                className="rounded-lg sm:w-[50px] sm:h-[50px] shrink-0"
              />
              <h1 className="text-xs sm:text-sm md:text-lg lg:text-xl font-bold text-gray-900 truncate">
                COMFORT ZONE HOLDINGS
              </h1>
            </div>

            {/* User Info and Logout */}
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="hidden sm:flex items-center gap-3">
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
              {/* Mobile User Avatar */}
              <div className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white">
                <User className="h-4 w-4" />
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Links */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 sm:gap-8 py-3 sm:py-4 overflow-x-auto">
            <Link
              href="/"
              className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 pb-1 whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link
              href="/customers"
              className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 pb-1 whitespace-nowrap"
            >
              Customers
            </Link>
            <Link
              href="/invoices"
              className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 pb-1 whitespace-nowrap"
            >
              Invoices
            </Link>
          </div>
        </div>
      </nav>
    </>
  );
}
