import React from 'react';

const Topbar = () => {
  return (
    <header className="sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10 flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-gray-700 px-10 py-3 ml-64">
      <div className="flex flex-1 items-center gap-8">
        <label className="flex flex-col min-w-40 !h-10 max-w-sm w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-text-secondary-light dark:text-text-secondary-dark flex border-none bg-white dark:bg-gray-800 items-center justify-center pl-4 rounded-l-lg border-r-0">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-0 border-none bg-white dark:bg-gray-800 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
              placeholder="Search courses, assignments..."
            />
          </div>
        </label>
      </div>
      <div className="flex flex-1 justify-end items-center gap-4">
        <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full size-10 bg-white dark:bg-gray-800 text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="relative group">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 cursor-pointer"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuByz0tjnLeo2_0FlkIbMkiv6N9lv0bG7bvci_6wlnFrStm3nImqfHbdHkMk1mlJ-dWzbhe8RF41XrV-wxqwUWeuexRLUTkaTH1ZFTyqoRFDJCeMxaY6eZfp1MuiwsNPofudE8TZFDCH9M9mkOiT6ofACbHpHNOcMq8KHRmhlSupBbu9H9LIp-zuICIPld3rT71HdCusM6kCOIfIh_3z92xRI59aAMdC6pbqRuW3RWL7rnIoVIdn6kddOx7I08ylotXsIc9_wgrUGg")`,
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
