// src/components/Categories/Categories.jsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../../hooks/Course/useCourse';

export default function Categories() {
  const containerRef = useRef(null);
  const { data: categoriesData = [], isLoading, error } = useCategories();

  // Map categories to display objects with default images
  const categoryImages = {
    'Web Development': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrtvTxFJd6XPiaJnrG1kA9FYyGYU_kVQ6c6SawPojprWDMg60p6QGj09urSHGtdrUAKjw5V1ZJodCqqnFraLNKoGUXQZ058SSWAajrm7bTk5SUJoWbVEjUu3zSZm7VgXo4qiYw_muTj7-M4IuxBTMVSsGNt1HGwYcVqcW6qvudBAqavkIqXzgSyoOcukfzReYKS3IS13OMPC4oHKrZKzAwHdtrCgYazxVcprG-IVfkV43wOK7Lj3_1uKsLNYGkLgLiwL3CsHcIvg',
    'Data Science': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGRTamqgySW9c6hOEBS99yC8fIXSbYjS4P-3rcPbPafVeA4F8r7jFII2QZ63dgmjdayxvhm70VxPsSCyr5VeUHDx3-0hq30xfdicfpe-UI3uY4gqfOMmL3nJdVr7Tdal4bXeHg7sU-8_F7k-5IkTxkmVVNVWQcz4PV0cu_G0O2OgBu9mCofQGyY1FybHdHqg1fKoJaebN1bllh__n2fO476WM7O37EucGCbT6cwiBF8zB-6lj__uQwdTWPnVDiYAHHM2NHcr7bnQ',
    'Artificial Intelligence': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxpua4AGbWdU0hiw8KsKrG2rYT_0Oqv63YGBp8dx2jpmEwsxzHPVAAhTIVLOcnDokEO4KDjK45fBV3J4vhlNjDbiILmvzYZ_4hxj3KprO5Qv-1_LWqloNejcKGuawW7okNJWx7kbzwu-QVbhcg2bPgETH4qs3e5gRFFjEreUVeE7gkD01RYjlHGWKhbx5tVKkpdy_Sk09m57ClwYXUIjuifQRDEEtqgTiRyXcebn0rGiIueShQWP0SzYCh5zLw5NNYbcQpFtkjWg',
    'UI/UX Design': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNsTbOGTKQrwkPQx2l0BFLQjZLOjXFQ0pM4PY3OXCRO_DojxcsTJJ0u-I1eoOOLWUSnw2OiDba1OYTbxGQ68IWDdB_KPrQnjqsD9fBPKAiEdiXswJ7DiO_593lfC2BleSKHpOhea10GRa3PWUc041nvLXe2Cla5FS-0NlCwcBLo7zShcXgAQmYSKckakPCv8ZbfFFR8CIc1zc-sad66jvXMyHLnPyAZgnOWzvz6-3K74UplaJcyIn6p1TCQccnRR6POewJ67qPSw',
    'Mobile Development': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    'Cybersecurity': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
    'DevOps': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400',
    'Blockchain': 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400',
  };

  const categoryDescriptions = {
    'Web Development': 'Build modern websites and applications.',
    'Data Science': 'Analyze and visualize data to make informed decisions.',
    'Artificial Intelligence': 'Explore the future of technology with AI and machine learning.',
    'UI/UX Design': 'Create beautiful and user-friendly interfaces.',
    'Mobile Development': 'Build native apps for iOS and Android.',
    'Cybersecurity': 'Protect systems and networks from digital attacks.',
    'DevOps': 'Master CI/CD pipelines and cloud infrastructure.',
    'Blockchain': 'Understand decentralized applications and crypto.',
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