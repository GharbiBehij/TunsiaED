import React from 'react';

const WelcomeBanner = ({ userName = '' }) => {
  return (
    <div className="flex flex-wrap justify-between gap-4 items-center mb-8">
      <div className="flex flex-col gap-1">
        <p className="text-text-light dark:text-text-dark text-4xl font-black leading-tight tracking-[-0.033em]">
          Welcome back, {userName}!
        </p>
        <p className="text-text-secondary-light dark:text-text-secondary-dark text-lg font-normal leading-normal">
          Let's continue your learning journey and make today productive.
        </p>
      </div>
    </div>
  );
};

export default WelcomeBanner;
