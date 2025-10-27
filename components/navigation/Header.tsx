'use client';

import Link from 'next/link';
import { useState } from 'react';

interface NavLink {
  label: string;
  href: string;
  icon: string;
  children?: NavLink[];
}

const navigation: NavLink[] = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'Schema Builder', href: '/builder', icon: '🔨' },
  { label: 'Batch Audit', href: '/audit', icon: '📊' },
  {
    label: 'Article',
    href: '/validate/article',
    icon: '📄',
    children: [
      { label: 'NewsArticle', href: '/validate/article/news', icon: '📰' },
      { label: 'BlogPosting', href: '/validate/article/blog', icon: '✍️' },
    ],
  },
  {
    label: 'Product',
    href: '/validate/product',
    icon: '🛍️',
    children: [
      { label: 'Offer', href: '/validate/product/offer', icon: '💰' },
      { label: 'Reviews', href: '/validate/product/reviews', icon: '⭐' },
    ],
  },
  {
    label: 'Organization',
    href: '/validate/organization',
    icon: '🏢',
    children: [
      { label: 'LocalBusiness', href: '/validate/organization/local-business', icon: '🏪' },
    ],
  },
  { label: 'Breadcrumb', href: '/validate/breadcrumb', icon: '🔗' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            {/* Logo Icon */}
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-800 group-hover:text-slate-600 transition-colors">Schema</span>
            <span className="text-2xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">Validator</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200"
                  onMouseEnter={() => item.children && setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>

                {/* Dropdown Menu */}
                {item.children && openDropdown === item.label && (
                  <div
                    className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <span className="text-base">{child.icon}</span>
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-gray-100">
            {navigation.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
                {item.children && (
                  <div className="pl-6 mt-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="text-base">{child.icon}</span>
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
