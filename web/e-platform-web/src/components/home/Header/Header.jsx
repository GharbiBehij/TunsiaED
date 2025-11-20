// src/components/Header/Header.jsx
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background-light dark:bg-background-dark/80 backdrop-blur-sm border-b border-neutral-light/10 dark:border-neutral-dark/10">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Name */}
          <Link to="/" className="flex items-center gap-3">
            <div className="text-primary">
              <svg className="size-8" fill="currentColor" viewBox="0 0 48 48">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-primary">TunisiaED</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {['Courses', 'Roadmaps', 'Resources', 'Instructors', 'Community Forums', 'Subscriptions'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-sm font-medium text-text-light dark:text-text-dark hover:text-primary transition"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Sign Up Button - Blue */}
            <Link
              to="/signup"
              className="hidden sm:flex items-center justify-center h-10 px-4 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-sm"
            >
              Sign Up
            </Link>
            
            {/* Login Button - Blue (Same style as Sign Up) */}
            <Link
              to="/login"
              className="hidden sm:flex items-center justify-center h-10 px-4 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-sm"
            >
              Login
            </Link>

            <div
              className="size-10 rounded-full bg-cover ring-2 ring-primary/20"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3LJoYx8Gg5EUsSpZQvHuwtf6CCRIQYsCTOGNrQmrBGF9u-apv4HJLMJglJfRXLL_o_rr-hFrzF4z5d17wwZIx8oNiAG7tp0wn0YMoCI8we3RqClZw7QFC50JA2fBvp3aFV5lhPzLX7SLQU1fEgKUaEKUZB2x8r4mOb1a8gpoms3-G3Tz2LChpnh2yVPOhQhKefA8O__TShe9nzOKuM0QhfjJKExsqWb11KeDgDTdgNzTkU2Ja2f36wqSBzpBecuj-GLwU8shfkg')",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </header>
  );
}