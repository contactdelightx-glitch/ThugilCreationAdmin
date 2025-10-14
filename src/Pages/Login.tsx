import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "flowbite-react";
import {
  HiExclamation,
  HiLockClosed,
  HiMail,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { login } from "../Api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [gridBoxes, setGridBoxes] = useState<
    Array<{ id: number; x: number; y: number; size: number; delay: number }>
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const boxes = [];
    const boxCount = 12;

    for (let i = 0; i < boxCount; i++) {
      boxes.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 30,
        delay: Math.random() * 3000,
      });
    }
    setGridBoxes(boxes);
  }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic client-side validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await login(email, password);

      // Check if response is JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server responded with non-JSON content");
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        // Store token, permissions, and emails in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "permissions",
          JSON.stringify(data.permissions || []),
        );
        localStorage.setItem(
          "emails",
          JSON.stringify(data.emails || []),
        );

        // If remember me is checked, also store in a more persistent way
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("userEmail", email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("userEmail");
        }

        navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="flex min-h-screen"
        style={{ fontFamily: "var(--font-family-enterprise)" }}
      >
        {/* Left Side with Animated Grid */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[var(--color-primary-dark)] to-[var(--color-primary)] lg:flex lg:w-1/2 lg:items-center lg:justify-center">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 z-0 opacity-10">
            {gridBoxes.map((box) => (
              <div
                key={box.id}
                className="absolute animate-pulse bg-[var(--color-primary-light)]"
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.size}px`,
                  height: `${box.size}px`,
                  animationDelay: `${box.delay}ms`,
                  animationDuration: "4s",
                  animationIterationCount: "infinite",
                }}
              />
            ))}
          </div>

          {/* Floating Security Elements */}
          <div className="animate-float absolute top-10 left-10 z-10">
            <div className="border-opacity-30 h-16 w-16 rotate-12 transform border-2 border-[var(--color-primary-light)]"></div>
          </div>
          <div
            className="animate-float absolute right-16 bottom-20 z-10"
            style={{ animationDelay: "1s" }}
          >
            <div className="border-opacity-20 h-12 w-12 -rotate-6 transform border-2 border-[var(--color-primary-light)]"></div>
          </div>
          <div
            className="animate-float absolute top-1/3 right-20 z-10"
            style={{ animationDelay: "2s" }}
          >
            <div className="border-opacity-25 h-8 w-8 border-2 border-[var(--color-primary-light)]"></div>
          </div>

          <div className="relative z-20 p-8 text-center text-[var(--color-primary-light)]">
            <h1 className="mb-4 text-5xl font-bold tracking-tight opacity-100">
              Thugil Creation
            </h1>
            <p className="mb-6 text-2xl font-light opacity-90">
              Enterprise Admin Portal
            </p>
            <div className="bg-opacity-50 mx-auto mb-6 h-1 w-24 bg-[var(--color-primary-light)]"></div>
            <p className="text-lg leading-relaxed opacity-80">
              Secure access to your enterprise solutions and administrative
              tools
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex w-full flex-col justify-center bg-white px-6 py-12 sm:px-8 lg:w-1/2 lg:px-24 xl:px-32">
          <div className="mx-auto w-full max-w-md">
            {/* Header */}
            <div className="mb-12 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center bg-[var(--color-primary-dark)]">
                  <HiLockClosed className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="mb-3 text-4xl font-bold text-[var(--color-primary-dark)]">
                Welcome Back
              </h2>
              <p className="text-lg text-gray-600">
                Sign in to your enterprise account
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-3 block text-xs font-semibold tracking-wide text-[var(--color-primary-dark)] uppercase"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <HiMail className="h-5 w-5 text-[var(--color-primary)] opacity-70" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full border border-gray-300 bg-white py-4 pr-4 pl-10 text-[var(--color-primary-dark)] placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                      placeholder="enterprise@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-3 block text-xs font-semibold tracking-wide text-[var(--color-primary-dark)] uppercase"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <HiLockClosed className="h-5 w-5 text-[var(--color-primary)] opacity-70" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="block w-full border border-gray-300 bg-white py-4 pr-12 pl-10 text-[var(--color-primary-dark)] placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-dark)]"
                    >
                      {showPassword ? (
                        <HiEyeOff className="h-5 w-5" />
                      ) : (
                        <HiEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full transform bg-gradient-to-r from-[var(--color-primary-dark)] to-[var(--color-primary)] px-4 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:translate-y-[-1px] hover:shadow-xl focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-5 w-5 animate-spin border-2 border-white border-t-transparent"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-600">
                © 2025 Thugil Creation. All rights reserved.
              </p>
              <p className="mt-2 text-xs text-gray-500">
                Secure Enterprise Access v2.4
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modernized Theme-Colored Error Toast */}
      {error && (
        <div className="animate-fade-in fixed top-5 right-5 z-50">
          <Toast className="flex transform items-center overflow-visible border-l-4 border-l-[var(--color-primary-light)] bg-white p-[5px] shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="z-10 inline-flex h-6 w-6 shrink-0 items-center justify-center bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
              <HiExclamation className="h-4 w-4" />
            </div>
            <div className="mr-4 ml-2 max-w-xs text-sm font-semibold text-[var(--color-primary-light)]">
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-4 inline-flex h-6 w-6 bg-[var(--color-primary-light)] p-1 text-[var(--color-primary-dark)] transition-colors hover:bg-[var(--color-primary)] hover:text-white"
            >
              <span className="sr-only">Close</span>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Toast>
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}