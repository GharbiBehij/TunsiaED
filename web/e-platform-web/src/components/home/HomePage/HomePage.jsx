// src/components/home/HomePage.jsx

import Header from '../Header/Header'
import HeroSection from '../HeroSection/HeroSection'
import Features from '../Features/Features'
import Categories from '../Categories/Categories'
import FeaturedCourses from '../FeaturedCourses/FeaturedCourses'
import Testimonials from '../Testimonials/Testimonials'
import Pricing from '../Pricing/Pricing'
import Footer from '../Footer/Footer'

export default function Homepage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-display">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <Features />
        <Categories />
        <FeaturedCourses />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
    </div>
  )
}