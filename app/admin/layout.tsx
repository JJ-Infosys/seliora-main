'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  TagIcon, 
  UsersIcon, 
  MoonIcon,
  SunIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    checkMobile();

    const savedTheme = localStorage.getItem('theme');
    const shouldUseDark =
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);

    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleTheme = () => {
    const nextThemeIsDark = !isDark;
    setIsDark(nextThemeIsDark);
    document.documentElement.classList.toggle('dark', nextThemeIsDark);
    localStorage.setItem('theme', nextThemeIsDark ? 'dark' : 'light');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
    { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon },
    { name: 'Orders', href: '/admin/orders', icon: TagIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    sessionStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-20 left-4 z-50 md:hidden p-2 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-gray-200 dark:border-slate-800"
      >
        {isSidebarOpen ? (
          <XMarkIcon className="h-6 w-6 text-gray-700 dark:text-slate-200" />
        ) : (
          <Bars3Icon className="h-6 w-6 text-gray-700 dark:text-slate-200" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:relative z-40 w-64 bg-white dark:bg-slate-900 shadow-lg transition-transform duration-300 ease-in-out flex flex-col h-full border-r border-gray-200 dark:border-slate-800`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-amber-600">Seloria</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">Admin Panel</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <SunIcon className="h-5 w-5 text-amber-400" />
            ) : (
              <MoonIcon className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                    : 'text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className={`h-6 w-6 ${isActive ? 'text-amber-700 dark:text-amber-300' : 'text-gray-500 dark:text-slate-400'}`} />
                <span className="ml-3">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 text-gray-900 dark:text-slate-100">
          {children}
        </div>
      </div>
    </div>
  );
}