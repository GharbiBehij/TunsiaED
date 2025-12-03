// src/components/Pricing/Pricing.jsx
import { Link } from 'react-router-dom';

export default function Pricing() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tighter">
              Choose Your Plan
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80 text-base font-normal max-w-2xl mx-auto">
              Start learning today with a plan that fits your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="border border-neutral-light/20 dark:border-neutral-dark/20 rounded-xl p-8 bg-white dark:bg-background-dark">
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Basic</h3>
              <p className="mt-2 text-text-light/70 dark:text-text-dark/70">For casual learners</p>
              <p className="mt-6 text-4xl font-bold text-text-light dark:text-text-dark">Free</p>

              <ul className="mt-8 space-y-4 text-sm text-text-light/80 dark:text-text-dark/80">
                <li className="flex items-center"><span className="material-symbols-outlined text-green-500 mr-2 text-lg">check_circle</span>Access to select free courses</li>
                <li className="flex items-center"><span className="material-symbols-outlined text-green-500 mr-2 text-lg">check_circle</span>Community forum access</li>
                <li className="flex items-center"><span className="material-symbols-outlined text-red-500 mr-2 text-lg">cancel</span>Downloadable resources</li>
                <li className="flex items-center"><span className="material-symbols-outlined text-red-500 mr-2 text-lg">cancel</span>Instructor Q&A</li>
              </ul>

              <button className="w-full mt-8 flex items-center justify-center rounded-lg h-12 px-6 bg-primary/10 text-primary text-base font-bold hover:bg-primary/20 transition-colors cursor-not-allowed opacity-60">
                Current Plan
              </button>
            </div>

            {/* Pro Plan – Most Popular */}
            <div className="border-2 border-primary rounded-xl p-8 bg-white dark:bg-background-dark relative shadow-2xl scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-red text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>

              <h3 className="text-2xl font-bold text-primary">Pro</h3>
              <p className="mt-2 text-text-light/70 dark:text-text-dark/70">For serious learners & professionals</p>
              <p className="mt-6 text-5xl font-bold text-text-light dark:text-text-dark">
                29<span className="text-xl font-medium text-text-light/70 dark:text-text-dark/70"> TND/mo</span>
              </p>

              <ul className="mt-8 space-y-4 text-sm text-text-light/80 dark:text-text-dark/80">
                <li className="flex items-center"><span className="material-symbols-outlined text-green-500 mr-2 text-lg">check_circle</span>Access to all courses</li>
                <li className="flex items-center"><span className="material-symbols-outlined text-green-500 mr-2 text-lg">check_circle</span>Downloadable resources</li>
                <li className="flex items-center"><span className="material-symbols-outlined text-green-500 mr-2 text-lg">check_circle</span>Instructor Q&A sessions</li>
                <li className="flex items-center"><span className="material-symbols-outlined text-green-500 mr-2 text-lg">check_circle</span>Course completion certificates</li>
              </ul>

              {/* MODIFIED: Changed to="/subscription" to align with header logic */}
              <Link
                to="/subscription"
                className="w-full mt-8 flex items-center justify-center rounded-lg h-12 px-6 bg-primary text-white text-base font-bold hover:bg-primary/90 transition-colors"
              >
                Upgrade to Pro
              </Link>
            </div>

            {/* Teams Plan */}
            <div className="border border-neutral-light/20 dark:border-neutral-dark/20 rounded-xl p-8 bg-white dark:bg-background-dark">
              <h3 className="text-xl font-bold text-text-light dark:text-text-dark">Teams</h3>
              <p className="mt-2 text-text-light/70 dark:text-text-dark/70">For organizations</p>
              <p className="mt-6 text-4xl font-bold text-text-light dark:text-text-dark">Contact Us</p>

              <ul className="mt-8 space-y-4 text-sm text-text-light/80 dark:text-text-dark/80">
                <li className="flex items-center"><span className="material-symbols-outlined text-green-500 mr-2 text-lg">check_circle</span>All Pro features</li>
                <li className="flex items-center"><span className="material-symbols-outlined text-green-500 mr-2 text-lg">check_circle</span>Team management dashboard</li>
                <li className="flex items-center"><span className="material-symbols-outlined text-green-500 mr-2 text-lg">check_circle</span>Usage analytics</li>
                <li className="flex items-center"><span className="material-symbols-outlined text-green-500 mr-2 text-lg">check_circle</span>Dedicated support</li>
              </ul>

              <button className="w-full mt-8 flex items-center justify-center rounded-lg h-12 px-6 bg-primary/10 text-primary text-base font-bold hover:bg-primary/20 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
