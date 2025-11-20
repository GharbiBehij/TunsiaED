import React from 'react';

const assignments = [
  { title: 'Submit Essay 1', course: 'History of Carthage', dueDate: 'Oct 28, 11:59 PM', actionLabel: 'View Assignment', actionLink: '#' },
  { title: 'Complete Quiz 3', course: 'Physics 101', dueDate: 'Oct 30, 5:00 PM', actionLabel: 'Start Quiz', actionLink: '#' },
  { title: 'Final Project Proposal', course: 'Introduction to Web Development', dueDate: 'Nov 5, 11:59 PM', actionLabel: 'View Details', actionLink: '#' },
];

const Assignments = () => {
  return (
    <div className="lg:col-span-2">
      <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
        Upcoming Assignments
      </h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {assignments.map((assignment) => (
            <li key={assignment.title} className="py-4 flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-text-light dark:text-text-dark">{assignment.title}</p>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{assignment.course}</p>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-secondary">Due: {assignment.dueDate}</p>
                <a className="text-sm font-medium text-primary hover:underline" href={assignment.actionLink}>
                  {assignment.actionLabel}
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Assignments;
