// src/components/Auth/InstructorForm.jsx
import { useSignup } from '../../hooks';

export default function InstructorForm() {
  const { submit, isLoading, error } = useSignup();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    await submit(data.email, data.password);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Same fields as student */}
      <label className="block">
        <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
          Name
        </p>
        <input
          type="text"
          name="name"
          required
          placeholder="Enter your full name"
          className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
        />
      </label>

      <label className="block">
        <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
          Email Address
        </p>
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
        />
      </label>

      <label className="block">
        <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
          Phone Number
        </p>
        <input
          type="tel"
          name="phone"
          required
          placeholder="Enter your phone number"
          className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
        />
      </label>

      <label className="block">
        <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
          birthPlace
        </p>
        <input
          type="text"
          name="birthPlace"
          required
          placeholder="Enter your place of birth"
          className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
        />
      </label>

      <label className="block">
        <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
          Birthdate
        </p>
        <input
          type="date"
          name="birthDate"
          required
          className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
        />
      </label>

      {/* CV Upload */}
      <label className="block">
        <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal pb-2">
          Upload CV <span className="text-gray-500 dark:text-gray-400">(Required for Approval)</span>
        </p>
        <div className="relative">
          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            required
            className="block w-full text-sm text-gray-900 dark:text-white file:hidden rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => document.querySelector('input[name="cv"]').click()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md transition-colors"
          >
            Browse
          </button>
        </div>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary h-12 text-white text-base font-semibold leading-normal transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Submitting Application...' : 'Apply as Instructor'}
      </button>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm text-center font-medium">
          {error}
        </p>
      )}
    </form>
  );
}