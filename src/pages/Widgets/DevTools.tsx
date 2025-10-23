import React, { useState, useEffect, useRef, useCallback } from "react";

const DevTools = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginBox, setShowLoginBox] = useState(false);
  const [inputPass, setInputPass] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loginBoxRef = useRef<HTMLDivElement>(null);
  const authenticatedBoxRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const SECRET_PASSWORD = "open-sesame";

  // Memoized callbacks to prevent unnecessary re-renders
  const closeLoginBox = useCallback(() => {
    setShowLoginBox(false);
    timeoutRef.current = setTimeout(() => {
      setShowLogin(false);
      setInputPass("");
      setLoginError("");
    }, 300);
  }, []);

  const openLoginBox = useCallback(() => {
    if (authenticated || isLoggingOut) return;

    if (showLogin) {
      closeLoginBox();
    } else {
      setShowLogin(true);
      timeoutRef.current = setTimeout(() => setShowLoginBox(true), 10);
    }
  }, [authenticated, isLoggingOut, showLogin, closeLoginBox]);

  const handleLogin = useCallback(() => {
    const trimmedPass = inputPass.trim();

    if (!trimmedPass) {
      setLoginError("Password cannot be empty.");
      return;
    }

    if (trimmedPass === SECRET_PASSWORD) {
      closeLoginBox();
      setAuthenticated(true);
    } else {
      setLoginError("Incorrect passphrase.");
    }
  }, [inputPass, closeLoginBox]);

  const handleLogout = useCallback(() => {
    setIsLoggingOut(true);
    setAuthenticated(false);
    setShowLoginBox(false);

    timeoutRef.current = setTimeout(() => {
      setShowLogin(false);
      setInputPass("");
      setLoginError("");
      setIsLoggingOut(false);
    }, 500);
  }, []);

  const handleInputChange = useCallback(
    (e: any) => {
      setInputPass(e.target.value);
      if (loginError) setLoginError("");
    },
    [loginError]
  );

  const handleKeyDown = useCallback(
    (e: any) => {
      if (e.key === "Enter") handleLogin();
    },
    [handleLogin]
  );

  // Optimized event handlers
  const stopPropagation = useCallback((e: any) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  // Click outside handler with better performance
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        showLogin &&
        loginBoxRef.current &&
        !loginBoxRef.current.contains(event.target as Node)
      ) {
        closeLoginBox();
      }
    };

    if (showLogin) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogin, closeLoginBox]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Common styles extracted as objects for better performance
  const gradientBoxStyle =
    "p-[2px] rounded-lg bg-gradient-to-t from-indigo-500 to-transparent transition duration-300 group hover:shadow-lg hover:shadow-indigo-500/20";
  const buttonBaseStyle =
    "flex items-center gap-2 w-25 h-10 rounded-lg bg-white text-gray-900 dark:bg-gray-950 dark:text-white px-4 py-2 transition duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20";
  const modalBaseStyle =
    "relative p-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(79,70,229,0.15)] text-white";

  // Dev tools items as constant to prevent re-creation
  const devToolsItems = [
    "Inspect API Logs",
    "View Raw Data",
    "System Debug Console",
    "Manually Trigger Events",
  ];

  // Jobs list with status
  const jobs = [
    { id: 1, name: "Add Dist Member", status: "complete" },
    { id: 2, name: "Enable Forward", status: "complete" },
    { id: 3, name: "Create Forward", status: "running" },
  ];

  return (
    <>
      {/* Login Button and Modal */}
      {!authenticated && (
        <li className="absolute bottom-0 left-1/2 transform -translate-x-1/2 pb-10">
          <div className="relative inline-block group">
            <div className={gradientBoxStyle}>
              <button
                onClick={openLoginBox}
                className={buttonBaseStyle}
                aria-label="Open developer tools login"
              >
                <span className="whitespace-nowrap font-semibold">
                  Dev Tools
                </span>
              </button>
            </div>

            {showLogin && (
              <div
                ref={loginBoxRef}
                className={`absolute bottom-full translate-x-[-31.5%] p-4 w-72 mb-3 transition-all duration-300 ease-out transform ${
                  showLoginBox
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0 pointer-events-none"
                }`}
                onClick={stopPropagation}
              >
                <div className={modalBaseStyle}>
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={closeLoginBox}
                      className="text-gray-400 hover:text-white text-lg px-2 transition-colors"
                      aria-label="Close login modal"
                    >
                      ✕
                    </button>
                  </div>

                  <h2 className="text-xl mb-4 text-center">Enter Passphrase</h2>

                  <input
                    type="password"
                    className={`w-full px-3 py-2 rounded bg-gray-800 text-white border transition-colors ${
                      loginError ? "border-red-500" : "border-gray-600"
                    } focus:outline-none focus:border-indigo-500`}
                    placeholder="Passphrase"
                    value={inputPass}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                  />

                  {loginError && (
                    <p className="text-red-500 text-sm mt-2" role="alert">
                      {loginError}
                    </p>
                  )}

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleLogin}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors"
                    >
                      Enter
                    </button>
                  </div>

                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 rotate-45 border-r border-b border-white/10"></div>
                </div>
              </div>
            )}
          </div>
        </li>
      )}

      {/* Authenticated Panel */}
      {authenticated && (
        <div
          ref={authenticatedBoxRef}
          className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 p-4 mb-16 w-60 transition-all duration-300 ease-out ${modalBaseStyle}`}
          onClick={stopPropagation}
          onMouseDown={stopPropagation}
        >
          <h2 className="hidden text-xl font-bold mb-4 text-center">
            Exchange TEST
          </h2>

          {/* Jobs Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              Running Jobs
            </h3>
            <div className="space-y-2">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between bg-gray-800/50 rounded px-3 py-2"
                >
                  <span className="text-sm text-white">{job.name}</span>
                  {job.status === "running" ? (
                    <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={handleLogout}
              className="px-2 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DevTools;
