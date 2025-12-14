// src/components/Categories/Categories.jsx
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../../hooks';

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

  const renderCategories = (categoriesToRender) => (
    <section className="py-16 lg:py-24 bg-white dark:bg-background-dark relative group/section">
      <div className="container relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Explore Our Course Categories
        </h2>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesToRender.map((category) => (
            <Link
              key={category.title}
              to={`/courses?category=${encodeURIComponent(category.title)}`}
              className="group flex flex-col items-center p-8 bg-white dark:bg-background-dark rounded-xl border border-neutral-light/20 dark:border-neutral-dark/20 cursor-pointer transition-all hover:shadow-xl hover:scale-105"
            >
              <div className="w-full h-40 mb-4 rounded-lg overflow-hidden">
                <img 
                  src={category.img} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-bold text-text-light dark:text-text-dark mb-2">
                {category.title}
              </h3>
              <p className="text-sm text-text-light/70 dark:text-text-dark/70 text-center">
                {category.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );

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

  return renderCategories(categories);
}