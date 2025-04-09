import React, { ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { User } from '@/types';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  BookOpen, 
  Clock, 
  History, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
}

export default function StudentLayout({ children }: Props) {
  const { auth } = usePage().props as any;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: route('student.dashboard'), icon: LayoutDashboard },
    { name: 'My Profile', href: route('student.profile'), icon: UserIcon },
    { name: 'Browse Books', href: route('student.books'), icon: BookOpen },
    { name: 'Active Loans', href: route('student.loans.active'), icon: Clock },
    { name: 'Loan History', href: route('student.loans.history'), icon: History },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="fixed inset-0 bg-gray-900/80 z-40" 
             onClick={() => setSidebarOpen(false)}
             style={{ display: sidebarOpen ? 'block' : 'none' }} />

        <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <span className="text-xl font-semibold">Bibliotheque</span>
            <button onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-5 px-3">
            <nav className="flex flex-1 flex-col">
              <ul className="space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        route().current(item.href)
                          ? 'bg-gray-100 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50',
                        'group flex gap-x-3 rounded-md p-3 text-sm font-medium'
                      )}
                    >
                      <item.icon 
                        className={cn(
                          route().current(item.href) ? 'text-blue-600' : 'text-gray-500',
                          'h-5 w-5 shrink-0'
                        )} 
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          
          <div className="border-t p-3">
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="flex items-center gap-x-3 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full"
            >
              <LogOut className="h-5 w-5 text-gray-500" />
              Log out
            </Link>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
          <div className="flex h-16 items-center">
            <span className="text-xl font-semibold">Bibliotheque</span>
          </div>
          
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      route().current(item.href)
                        ? 'bg-gray-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50',
                      'group flex gap-x-3 rounded-md p-3 text-sm font-medium'
                    )}
                  >
                    <item.icon 
                      className={cn(
                        route().current(item.href) ? 'text-blue-600' : 'text-gray-500',
                        'h-5 w-5 shrink-0'
                      )} 
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="border-t py-3">
            <div className="flex items-center gap-x-4 py-3 text-sm">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-gray-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{auth.user.name}</span>
                <span className="text-gray-500 text-xs">{auth.user.email}</span>
              </div>
            </div>
            <Link
              href={route('logout')}
              method="post"
              as="button"
              className="mt-1 flex w-full items-center gap-x-3 rounded-md p-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5 text-gray-500" />
              Log out
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
          <button
            type="button"
            className="text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <span className="text-sm font-medium">Student Portal</span>
            </div>
          </div>
        </div>

        <main className="py-2">
          {children}
        </main>
      </div>
    </div>
  );
}
