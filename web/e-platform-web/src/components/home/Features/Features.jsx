// src/components/Features/Features.jsx
export default function Features() {
  const items = [
    { icon: "school", title: "Expert-Led Instruction", desc: "Learn from industry professionals with real-world experience." },
    { icon: "code_blocks", title: "Hands-On Projects", desc: "Apply your knowledge with practical, project-based learning." },
    { icon: "timeline", title: "Career-Focused Roadmaps", desc: "Follow structured paths to achieve your career goals." },
    { icon: "groups", title: "Active Community", desc: "Engage with a vibrant community of learners and mentors." },
  ];

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tighter">
              Why TunisiaED?
            </h2>
            <p className="text-text-light/80 dark:text-text-dark/80 text-base font-normal max-w-2xl mx-auto">
              Discover the advantages of learning with us.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-4 rounded-xl border border-neutral-light/20 dark:border-neutral-dark/20 bg-white dark:bg-background-dark p-6 text-center items-center transition-transform hover:scale-[1.02] hover:shadow-lg"
              >
                <span className="material-symbols-outlined text-primary text-4xl">
                  {item.icon}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold leading-tight text-text-light dark:text-text-dark">
                    {item.title}
                  </h3>
                  <p className="text-sm font-normal leading-normal text-text-light/70 dark:text-text-dark/70">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}