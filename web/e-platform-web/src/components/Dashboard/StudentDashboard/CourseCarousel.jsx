import React from 'react';

const courses = [
  { title: 'Introduction to Web Development', progress: 75, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB12bsQxIFRAyqw2hzoZolUhNULg9gfJu5pAzjMNk1Zkbhx0k2T5t5LBYYkWlQNhGdEIn3un1Vu9FQGwkXVcqvj2cYrIPuB0N-quHkzxw8iYNi-qcZq6XDwHKjawrO6zTD73EFWzqgvXiNxb1aMYnIFZzgIsl72e5pT58cOyVOr9gteZvS_Trr5TmyM2a54vf1jn9Urceby4KDAHVXlRtnx5IkyT8MvEKK3_-3dUzzs_-n2R7K-fxwOiAIqQQWhlq_StAGrAjz4Gg' },
  { title: 'Data Science', progress: 45, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-ltcT5WoZMvaFsVpsJYor1bdjwrX2Ynk0eg2RCVh7ykKPCUTvXiaX5wL41bReDAS6nyWak2kSIb-ig8QU6WNIVhkZNSKCdfnX40sFAGtmIDsNVAXEGUWNym4Ba8ZJh6Cozr5bhTDuWmn7I6pYT5pLKMbqUdZd4e95NKA8ZzFtOfeT3BLseYKV18YhjCk-iwoyDTcWVhz-tinC8n2K134E_PpdjPkQVg7moKAzqfp0DFz3EKvGMnGAWsBZ-1QiLrxXAemlhkFd5w' },
  { title: 'CyberSecurity', progress: 20, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDD2G8LGJnbuK6RkvLUNx4HB3-Ad73iUBLhoUWRW05eymhBkNaMn-Xu054dXUPt80wLs2wSS9o6ptyCSRnL375Mi5VbclnCF7yzWvdZAz3om2HDbHJwla1vFRtJnuULmjJnkAtDdR6IMx9nSDIv3Job6on6J-6pQwZdw9HQVu0DKoSKtmDsbFgjadiUe7LlSH9ejxPSo4pLbKgUdIWKESJ0sMtx7VyayFJzPpwg21AfqlOgGWZUj3LgjNFfUcrF6pF5Lz8sAz7zQ' },
];

const CoursesCarousel = () => {
  return (
    <div className="mb-8">
      <h2 className="text-text-light dark:text-text-dark text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">Continue Learning</h2>
      <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-4 px-4">
        <div className="flex items-stretch p-4 gap-6">
          {courses.map((course) => (
            <div key={course.title} className="flex h-full flex-1 flex-col gap-4 rounded-xl min-w-72 bg-white dark:bg-gray-800 p-4 shadow">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                style={{ backgroundImage: `url(${course.imageUrl})` }}
              />
              <p className="text-text-light dark:text-text-dark text-lg font-semibold leading-normal">{course.title}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${course.progress}%` }} />
              </div>
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">{course.progress}% Complete</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesCarousel;
