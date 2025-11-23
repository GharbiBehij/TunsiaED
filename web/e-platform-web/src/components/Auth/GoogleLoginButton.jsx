// src/components/auth/GoogleLoginButton.jsx
import { useAuth } from "../../context/AuthContext";

function GoogleLoginButton() {
  const { loginWithGoogle, isLoading } = useAuth();

  return (
    <button
      onClick={loginWithGoogle}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className="w-5 h-5"
      />
      Continue with Google
    </button>
  );
}

export default GoogleLoginButton;