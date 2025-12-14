// src/pages/HomePage.jsx

import Header from '../components/home/Header/Header';
import HeroSection from '../components/home/HeroSection/HeroSection';
import Features from '../components/home/Features/Features';
import Categories from '../components/home/Categories/Categories';
import FeaturedCourses from '../components/home/FeaturedCourses/FeaturedCourses';
import SubscriptionCTA from '../components/home/SubscriptionCTA/SubscriptionCTA';
import Testimonials from '../components/home/Testimonials/Testimonials';
import Footer from '../components/home/Footer/Footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <Features />
        <Categories />
        <FeaturedCourses />
        <SubscriptionCTA />
        <Testimonials />
      </main>

      <Footer />
    </div>
  );
}