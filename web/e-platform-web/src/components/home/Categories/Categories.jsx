// src/components/Categories/Categories.jsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../../hooks/Course/useCourse';

export default function Categories() {
  const containerRef = useRef(null);
  const { data: categoriesData = [], isLoading, error } = useCategories();

  const categoryImages = {
       
  
  }

  const categoryDescriptions = {

  };

  const categories = categoriesData.map(cat => ({
    title: cat,
    img: categoryImages[cat] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
    desc: categoryDescriptions[cat] || `Learn ${cat} skills.`
  }));

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-white dark:bg-background-dark">
        <div className="container">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Explore Categories
          </h2>
          <div className="flex justify-center items-center h-64">
            <div className="text-text-light/70 dark:text-text-dark/70">Loading categories...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error || categories.length === 0) {
    // Fallback to minimal hardcoded categories if backend fails
    const fallbackCategories = [
      {
        img: categoryImages['Web Development'],
        title: "Web Development",
        desc: "Build modern websites and applications."
      },
      {
        img: categoryImages['Data Science'],
        title: "Data Science",
        desc: "Analyze and visualize data to make informed decisions."
      },
      {
        img: categoryImages['Artificial Intelligence'],
        title: "Artificial Intelligence",
        desc: "Explore the future of technology with AI and machine learning."
      },
      {
        img: categoryImages['UI/UX Design'],
        title: "UI/UX Design",
        desc: "Create beautiful and user-friendly interfaces."
      },
    ];
    
    return renderCategories(fallbackCategories);
  }

  // Scroll Handler
  const scroll = (direction) => {
    const { current } = containerRef;
    if (current) {
      // Scroll amount is roughly one card width + gap (300px + 24px)
      const scrollAmount = 324; 
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const renderCategories = (categoriesToRender) => (
    <section className="py-16 lg:py-24 bg-white dark:bg-background-dark relative group/section">
      <div className="container relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Explore Our Course Categories
        </h2>

        {/* --- Navigation Buttons --- */}
        
        {/* Left Button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-[60%] -translate-y-1/2 -translate-x-3 lg:-translate-x-12 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:scale-110 transition-all opacity-0 group-hover/section:opacity-100 focus:opacity-100"
          aria-label="Scroll Left"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-[60%] -translate-y-1/2 translate-x-3 lg:translate-x-12 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white hover:scale-110 transition-all opacity-0 group-hover/section:opacity-100 focus:opacity-100"
          aria-label="Scroll Right"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* --- Scrollable Container --- */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto gap-6 pb-4 scroll-smooth no-scrollbar snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoriesToRender.map((cat) => (
            <Link
              key={cat.title}
              to={`/courses?category=${encodeURIComponent(cat.title)}`}
              // Layout: Mobile 85%, Tablet 50%, Desktop 25% width per card
              className="group flex flex-col gap-4 min-w-[85%] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] snap-start"
            >
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl overflow-hidden transition-transform group-hover:scale-105 bg-gray-100 dark:bg-gray-800"
                style={{ backgroundImage: `url(${cat.img})` }}
                aria-hidden="true"
              />
              <div className="text-center">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                  {cat.title}
                </h3>
                <p className="text-sm text-text-light/70 dark:text-text-dark/70 mt-1">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Hide scrollbar for Chrome/Safari/Edge */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );

  return renderCategories(categories);
}