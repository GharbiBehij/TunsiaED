// src/components/home/SubscriptionCTA/SubscriptionCTA.jsx
import { Link } from 'react-router-dom';

export default function SubscriptionCTA() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-blue-600">
      <div className="container mx-auto px-4 lg:px-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6">
            Unlock Unlimited Learning
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get access to our entire course library with a subscription plan. Learn at your own pace, 
            master new skills, and advance your career.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/subscription"
              className="flex min-w-[200px] items-center justify-center rounded-lg h-12 px-8 bg-white text-primary text-base font-bold hover:bg-white/90 transition-colors shadow-lg"
            >
              View Plans
            </Link>
            <Link
              to="/courses"
              className="flex min-w-[200px] items-center justify-center rounded-lg h-12 px-8 bg-transparent border-2 border-white text-white text-base font-bold hover:bg-white/10 transition-colors"
            >
              Browse Courses
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-black mb-2">100+</div>
              <div className="text-white/80">Expert-Led Courses</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">10K+</div>
              <div className="text-white/80">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">4.8★</div>
              <div className="text-white/80">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
