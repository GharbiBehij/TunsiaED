// src/components/Testimonials/Testimonials.jsx
export default function Testimonials() {
    const testimonials = [
      {
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7BgtZzqUhw4a9PrhXwTRg43HXFyUCnusppAaCHbXRTIN1YDmWjPef56bMpeW7Y_Lcf5bCuxmarrkGQP50GMI7sISv7QC0E0EmWSwcgZpb7rRmChg11ag8UqGeWsHLh541bK4Pi3r-SmKbxtB4VIWsrTGd2JbtK7kNPwddQX7Lms3C-uAqtWq_kUOXzhpOR3v0ZUnl-700oFetKvUHWcXr0Sa9iy7wBrgGw_P4j4S9FAkr8DvD_urRHxFbmaB8u9JsUEu7BHMqpw",
        name: "Karim Bettaieb",
        course: "Full-Stack JavaScript Bootcamp",
        quote: "TunisiaED completely changed my career trajectory. The Full-Stack bootcamp was challenging but incredibly rewarding. I landed my dream job just two months after graduating!"
      },
      {
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAY1__psKvb1WGS0d8ZTLtSst2Ri5PC2PEOTpLCDqCPtOYRwZBKxPz1bmQPzRSFyefMd-sDZaczk5BgXhShMEOV-LxgcaZTYTyJeLsQDnoE17IyT8b0kX2PXI4EFYwGcF01TbDvszr_-psYQBUlJEcuhqM4loVXgRvKZsRbIzpc0UkauCfiLNVEOcHJiYQJHB1F9OgcZJ398cn0_zUNtZzAqaO9Ihd7t3kQ3944BCLRA7ljLacqqbQkYBQUSiSEwgSfSNNfw1nGRg",
        name: "Fatima Hamdi",
        course: "Introduction to Python for Data Analysis",
        quote: "As a beginner, I was intimidated by data science. But the instructors at TunisiaED made complex topics easy to understand. The hands-on projects were the best part!"
      },
      {
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-9Lik5zhBKDR4XxrAc45HMd6oQyt0aFodEyzPr40WNpf9FFg1yoXvXXHkNe8WAUFn7W71aGLN_xf5TgVkD9te28k31lsXb8i3eYCJXofhQEl1VAoHQGPXBVKp320O-KtWH8Le6snPINYKA-T1hOthklk3XrEeoLZO1ELplHqDbFX_xzOJnF4kK7J3Tj6dztj04UtAmlPdNxbK2Uty4SlNGBfHH-lLBe9JAQ8XHxQfc54QDsb7yQ9wNa1Fz0bLJnJ6ElU-D6p2-A",
        name: "Ahmed Cherif",
        course: "Active Community Member",
        quote: "The community is amazing. Whenever I was stuck on a problem, I could always find help from mentors or fellow students on the forums. It feels like a real family."
      },
    ];
  
    return (
      <section className="py-16 lg:py-24 bg-white dark:bg-background-dark">
        <div className="container">
          <div className="flex flex-col gap-12 items-center">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tighter text-center">
              What Our Students Say
            </h2>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-background-light dark:bg-neutral-dark/40 p-8 rounded-xl transition-transform hover:scale-[1.02] hover:shadow-xl"
                >
                  <p className="text-text-light/80 dark:text-text-dark/80 italic text-base leading-relaxed">
                    "{t.quote}"
                  </p>
  
                  <div className="flex items-center mt-6 gap-4">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="size-12 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <p className="font-bold text-text-light dark:text-text-dark">
                        {t.name}
                      </p>
                      <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                        {t.course}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }