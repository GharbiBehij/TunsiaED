// src/components/Hero/HeroSection.jsx
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4 lg:px-10">
        <div
          className="flex min-h-[480px] flex-col items-center justify-center gap-8 rounded-xl bg-cover bg-center p-8 text-center"
          style={{
            backgroundImage: `
              linear-gradient(rgba(13, 71, 161, 0.7), rgba(13, 71, 161, 0.9)),
              url('https://lh3.googleusercontent.com/aida-public/AB6AXuDP4O39S4ySAky1hZNAgfkvsvIBCt4B090qeuSbBz3vkzkNQzaoX2V7TOubSQB1wti1QXrprVHtctuy3jjhSBA1IE4mTZqXnnenIpO1RZEhsSWJJCpS9lcoes2yU6CY0-f4igHEqh4p4OYuldYVkNdMpE9ih3SVpMweo5nJoNYjqAXZM3xCq59Lvqbfmgh9rMpyjbWg5VEZcbKL8VvvKllBhQ-RYj7K64f20mH5ml9DW-wTE1t8XHTjVYnEugQ5UPY5IQ9YOSEYRQ')
            `,
          }}
        >
          <div className="flex max-w-4xl flex-col gap-6">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] sm:text-5xl md:text-6xl">
              Unlock Your Potential. Learn the Skills of Tomorrow.
            </h1>
            <p className="text-white/90 text-base font-normal leading-normal sm:text-lg">
              Join Tunisia's leading platform for tech education and build your future.
            </p>
          </div>

          <Link
            to="/courses"
            className="flex min-w-[200px] max-w-[480px] items-center justify-center rounded-lg h-12 px-8 bg-accent text-primary text-base font-bold hover:bg-accent/90 transition-colors shadow-lg"
          >
            Browse Courses
          </Link>
        </div>
      </div>
    </section>
  );
}