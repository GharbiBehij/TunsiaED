// src/components/Footer/Footer.jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-background-dark border-t border-neutral-light/10 dark:border-neutral-dark/10">
      <div className="container mx-auto px-4 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-primary">
                <svg className="size-7" fill="currentColor" viewBox="0 0 48 48">
                  <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-text-light dark:text-text-dark">TunisiaED</h2>
            </div>
            <p className="text-sm text-text-light/70 dark:text-text-dark/70">
              Empowering the next generation of tech leaders in Tunisia and beyond.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4 text-text-light dark:text-text-dark">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary transition">Courses</Link></li>
              <li><Link to="/subscription" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary transition">Subscription</Link></li>
              <li><Link to="/instructors" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary transition">Instructors</Link></li>
              <li><Link to="/roadmaps" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary transition">Roadmaps</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-text-light dark:text-text-dark">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary transition">About Us</Link></li>
              <li><Link to="/careers" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary transition">Careers</Link></li>
              <li><Link to="/contact" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary transition">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-text-light dark:text-text-dark">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary transition">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-text-light/70 dark:text-text-dark/70 hover:text-primary dark:hover:text-primary transition">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-neutral-light/10 dark:border-neutral-dark/10 flex flex-col sm:flex-row justify-between items-center text-sm text-text-light/70 dark:text-text-dark/70">
          <p>© 2025 TunisiaED. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a
              svg="https://pixelbag.net/wp-content/uploads/2022/02/facebook-logo-700x700.jpg"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary dark:hover:text-primary transition font-medium"
              aria-label="Follow us on Facebook"
            >
              FB
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary dark:hover:text-primary transition font-medium"
              aria-label="Follow us on Twitter"
            >
              TW
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary dark:hover:text-primary transition font-medium"
              aria-label="Follow us on LinkedIn"
            >
              LN
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}