// src/components/Course/CourseFilters.jsx
export default function CourseFilters({ filters, onChange }) {
    return (
      <div className="space-y-6">
        {/* Search Bar */}
        <div>
          <h4 className="font-semibold mb-3">Search</h4>
          <input
            type="text"
            placeholder="Search courses..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <h4 className="font-semibold mb-3">Category</h4>
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <option value="all">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Business">Business</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>
  
        <div>
          <h4 className="font-semibold mb-3">Level</h4>
          <div className="space-y-2">
            {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
              <label key={level} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="level"
                  value={level}
                  checked={filters.level === level}
                  onChange={(e) => onChange({ ...filters, level: e.target.value })}
                />
                <span className="capitalize">{level}</span>
              </label>
            ))}
          </div>
        </div>
  
        <div>
          <h4 className="font-semibold mb-3">Price</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="price" value="all" checked={filters.price === 'all'} onChange={(e) => onChange({ ...filters, price: e.target.value })} />
              All
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="price" value="free" checked={filters.price === 'free'} onChange={(e) => onChange({ ...filters, price: e.target.value })} />
              Free
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="price" value="paid" checked={filters.price === 'paid'} onChange={(e) => onChange({ ...filters, price: e.target.value })} />
              Paid
            </label>
          </div>
        </div>
      </div>
    );
  }