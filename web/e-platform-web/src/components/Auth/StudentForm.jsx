// src/components/Auth/StudentForm.jsx
import { useSignup } from '../../hooks';

export default function StudentForm() {
  const { submit, isLoading, error } = useSignup();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    await submit(data.email, data.password);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Name */}
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

      {/* Email */}
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

      {/* Phone */}
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

      {/* Place of Birth */}
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

      {/* Birthdate */}
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

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-primary h-12 text-white text-base font-semibold leading-normal transition-all duration-300 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Account...' : 'Sign Up as Student'}
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
