// Header.jsx 
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useCartContext as useCart } from '../../../context/CartContext';
import { getDashboardTitle } from '../../../lib/dashboardRouter';
import UserDropdown from './UserDropdown';

// Logo Component
const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="text-primary">
      <svg className="size-7" fill="currentColor" viewBox="0 0 48 48">
        <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
      </svg>
    </div>
    <h2 className="text-lg font-bold text-slate-900 dark:text-white">TunisiaED</h2>
  </div>
);


// This component combines the logic of the main Header and the DashboardHeader
// using a 'type' prop to switch between layouts.
export default function Header({ type = 'main' }) {
  const { isAuthenticated, isLoading, isAdmin, isInstructor,isStudent } = useAuth();
  const { getCartItemCount } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const cartItemCount = getCartItemCount();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  // Role-based dashboard title using centralized utility
  const dashboardTitle = getDashboardTitle({ isAdmin, isInstructor, isStudent });

  // Loading skeleton
  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-background-light/80 dark:border-slate-800/80 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <div className="w-24 h-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="hidden md:flex gap-8">
              <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              <div className="w-16 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-20 h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-background-light/80 dark:border-slate-800/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side: Logo + Nav / Title */}
        <div className="flex items-center gap-8">
          {/* Logo is always present */}
          <Link to="/">
            <Logo />
          </Link>

          {/* Main Nav (for homepage) */}
          {type === 'main' && (
            <nav className="hidden items-center gap-8 md:flex">
              <Link
                to="/"
                className="text-sm font-medium text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition"
              >
                Home
              </Link>
              <Link
                to="/courses"
                className="text-sm font-medium text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition"
              >
                Courses
              </Link>
              <Link
                to="/subscription"
                className="text-sm font-medium text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition"
              >
                Subscription
              </Link>
            </nav>
          )}

          {/* Dashboard title (for dashboard) */}
          {type === 'dashboard' && (
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {dashboardTitle}
            </h2>
          )}
        </div>

        {/* Right side: Auth actions / User menu */}
        <div className="flex items-center gap-4">
          {/* Shopping Cart Icon */}
          {type === 'main' && (
            <Link to="/cart" className="relative p-2 text-slate-900 dark:text-white hover:text-primary dark:hover:text-primary transition">
              <span className="material-symbols-outlined text-2xl">shopping_cart</span>
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>
          )}
          
          {/* New Course Button (Instructor only, Dashboard only) */}
          {type === 'dashboard' && isInstructor && (
            <Link 
              to="/instructor/new-course"
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span className="truncate">New Course</span>
            </Link>
          )}

          {isAuthenticated ? (
            <>
              {/* User dropdown */}
              <div ref={dropdownRef}>
                <UserDropdown
                  isOpen={isDropdownOpen}
                  onToggle={() => setIsDropdownOpen(!isDropdownOpen)}
                  onClose={() => setIsDropdownOpen(false)}
                />
              </div>
            </>
          ) : (
            // Not logged in (Main only)
            type === 'main' && (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex min-w-[84px] items-center justify-center rounded-lg h-9 px-4 bg-transparent text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex min-w-[84px] items-center justify-center rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </div>
            )
          )}
        </div>
      </div>

      {/* Mobile Menu (if needed in future) */}
      {/* For now, mobile users can click logo to go home, then access courses from home page */}
    </header>
  );
}
