import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

function LoginPage() {
  async function handleGoogleLogin() {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 font-['DM_Sans','Inter',sans-serif]">
      <div className="w-full max-w-[400px] px-6">
        <div className="rounded-[20px] border border-slate-800 bg-slate-900 px-9 py-10 text-center">
          <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-gradient-to-br from-orange-400 to-rose-500">
            <svg width="26" height="26" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2L3 6v6l6 4 6-4V6L9 2Z"
                stroke="white"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="9" r="2" fill="white" />
            </svg>
          </div>

          <h1 className="mb-2 text-[1.5rem] font-bold tracking-[-0.03em] text-slate-50">
            SubTracker
          </h1>

          <p className="mb-8 text-[0.85rem] leading-[1.5] text-slate-600">
            Sign in to manage and track all your subscriptions in one place.
          </p>

          <div className="mb-7 h-px bg-slate-800" />

          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-[10px] border-0 bg-white px-5 py-3 text-[0.9rem] font-semibold text-slate-800 transition-opacity duration-150 hover:opacity-90"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
              />
              <path
                fill="#FBBC05"
                d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Continue with Google
          </button>

          <p className="mt-5 text-[0.72rem] leading-[1.6] text-slate-700">
            Your data is saved securely to your Google account and syncs across all your devices.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;