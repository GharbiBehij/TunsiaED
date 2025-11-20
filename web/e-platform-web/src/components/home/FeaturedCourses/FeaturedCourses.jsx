// src/components/FeaturedCourses/FeaturedCourses.jsx
import { Link } from 'react-router-dom';

export default function FeaturedCourses() {
  const courses = [
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm9tsAmR75CITdmShuL9aH1yJfAFxZ09OXrEb803cOdcS4fbZOIrKKdFmP4Qeoe8Nc6UXVT3fmW75SQXHJzLf3waPsoQq9H90HI0EzbkrL0kytuBYN4OoCDqwVB7ksMYavfAkbGESJJjnh9qaJzbxPtsYC6LM5VxEf7rQ_LBWmiso9eovEwKzX0Ejj8mNgMhcCGDdz5xy9G399gFJ63M2LxCtCLDvRB9J_IXOuxKRNmnAQIChz9XylDgHRh0xPZlJt0j-iZeQcKA",
      title: "Full-Stack JavaScript Bootcamp",
      desc: "Master the MERN stack and build real-world applications from scratch."
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBztznslhRGVcusmWQjgiUhvIrrlF5cm_GyMm-kjzuZHZ_LA0-WvwSouWxbLzo32C1NGAOMtEjbvIx36C-SNx51L7_wUPws-Z71fp2XzR_BKP1k21SCmoLzjy72txS9y9S7WueKU85ycreXYNuRHJowQ6MHPWhtuPz1lc_plkW2SqzVfPxm9gu8sITwy8TM_V-U0tnQFeTaip-sOXb0ZdTGYXpxgT9bSOI47J3s3uvraj6MzcbrwMjL6zJvBihJ7WD3Dvr89DhjXA",
      title: "Introduction to Python for Data Analysis",
      desc: "Learn the fundamentals of Python and popular libraries like Pandas and NumPy."
    },
    {
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvhCuigLa7YzQEq0jSb0CwM5vX3SnbtGNMTvi3wrM1yfKxOo4pVVwESQRGOXwsQB1UpOxxHcjJl7Gso6D2f3it5Qsp68mspsMkty_8GdtwgB4XXcXOoG0NVnpepnf6bX6Ju2i3JXB-Qn-HTpkmjkiPYM6p2MmBTDC4_FhxfQGjf3okHJ-layjWoY1sRPBeVLcRh9O36eNh8_RABC-i3Vd1qn-cy6660zsFMPVF4zI6Q4yz9hoQmOIq0blym-EIiANSr9kpseLa2A",
      title: "Advanced UI/UX Design Principles",
      desc: "Dive deep into user research, prototyping, and creating delightful user experiences."
    },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Featured Courses
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link
              key={course.title}
              to="/courses"
              className="group flex flex-col bg-white dark:bg-background-dark rounded-xl overflow-hidden border border-neutral-light/20 dark:border-neutral-dark/20 transition-transform hover:scale-[1.02] hover:shadow-xl"
            >
              <div
                className="w-full h-48 bg-cover bg-center transition-transform group-hover:scale-105"
                style={{ backgroundImage: `url(${course.img})` }}
                aria-hidden="true"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                  {course.title}
                </h3>
                <p className="mt-2 text-sm text-text-light/70 dark:text-text-dark/70 flex-grow">
                  {course.desc}
                </p>
                <button className="mt-4 w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors">
                  View Course
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}