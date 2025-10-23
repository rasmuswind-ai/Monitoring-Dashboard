import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DevTools from "./DevTools";

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const handleResize = () => {
      if (mediaQuery.matches) {
        setIsOpen(false);
      }
    };

    handleResize();
    mediaQuery.addEventListener("change", handleResize);

    return () => mediaQuery.removeEventListener("change", handleResize);
  }, [setIsOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    if (mediaQuery.matches) {
      setIsOpen(false);
    }
  }, [location.pathname, setIsOpen]);

  return (
    <div>
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-61 h-full transition-transform bg-gray-50 dark:bg-gray-950 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <h5 className="text-base font-semibold text-gray-500 uppercase dark:text-gray-400 ml-6 mt-4">
          Menu
        </h5>
        <button
          onClick={toggleSidebar}
          className="mt-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            aria-hidden="true"
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <ul className="space-y-4 pr-3 font-medium">
            <li className="hidden">
              <div
                className={`p-[2px] hover:bg-gradient-to-r hover:from-indigo-500 hover:to-transparent hover:rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-transform transition-colors ease-in-out duration-300 ${
                  isActive("/Home")
                    ? "translate-x-[0.5rem] bg-gradient-to-r from-indigo-500 to-transparent rounded-lg shadow-md hover:shadow-lg shadow-indigo-500/20"
                    : ""
                }`}
              >
                <Link
                  to="/Home"
                  className={`flex items-center p-2 rounded-lg w-full h-full group transition-colors relative ${
                    isActive("/Home")
                      ? "text-white bg-gray-950"
                      : "text-gray-900 dark:text-white bg-white dark:bg-gray-950"
                  }`}
                >
                  <span
                    className={`w-1 h-6 mr-2 rounded bg-transparent rounded-lg border-transparent border-indigo-500/30 group-hover:border-indigo-400 group-hover:bg-indigo-500/30 transition.all duration-300 ${
                      isActive("/Home") ? "bg-indigo-500/30" : ""
                    }`}
                  ></span>{" "}
                  <svg
                    className="w-7 h-5 transition duration-300 ease-in-out group-hover:text-indigo-400 text-indigo-500/60"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M3 11L12 2l9 9v9a2 2 0 0 1-2 2h-3v-6H8v6H5a2 2 0 0 1-2-2v-9z" />
                    <path d="M12 3l9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V11l9-8z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">Home</span>
                </Link>
              </div>
            </li>
            <li>
              <div
                className={`p-[2px] hover:bg-gradient-to-r hover:from-indigo-500 hover:to-transparent hover:rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-transform transition-colors ease-in-out duration-300 ${
                  isActive("/RDP")
                    ? "translate-x-[0.5rem] bg-gradient-to-r from-indigo-500 to-transparent rounded-lg shadow-md hover:shadow-lg shadow-indigo-500/20"
                    : ""
                }`}
              >
                <Link
                  to="/RDP"
                  className={`flex items-center p-2 rounded-lg w-full h-full group transition-colors relative ${
                    isActive("/RDP")
                      ? "text-white bg-gray-950"
                      : "text-gray-900 dark:text-white bg-white dark:bg-gray-950"
                  }`}
                >
                  <span
                    className={`w-1 h-6 mr-2 rounded bg-transparent rounded-lg border-transparent border-indigo-500/30 group-hover:border-indigo-400 group-hover:bg-indigo-500/60 transition.all duration-300 ${
                      isActive("/RDP") ? "bg-indigo-500/50" : ""
                    }`}
                  ></span>
                  <svg
                    className="w-7 h-5 transition duration-300 ease-in-out group-hover:text-indigo-400 text-indigo-500/60"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    RDP Sessions
                  </span>
                </Link>
              </div>
            </li>
            <li>
              <div
                className={`p-[2px] hover:bg-gradient-to-r hover:from-indigo-500 hover:to-transparent hover:rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-transform transition-colors ease-in-out duration-300 ${
                  isActive("/DockerMonitoring")
                    ? "translate-x-[0.5rem] bg-gradient-to-r from-indigo-500 to-transparent rounded-lg shadow-md hover:shadow-lg shadow-indigo-500/20"
                    : ""
                }`}
              >
                <Link
                  to="/DockerMonitoring"
                  className={`flex items-center p-2 rounded-lg w-full h-full group transition-colors relative ${
                    isActive("/DockerMonitoring")
                      ? "text-white bg-gray-950"
                      : "text-gray-900 dark:text-white bg-white dark:bg-gray-950"
                  }`}
                >
                  <span
                    className={`w-1 h-6 mr-2 rounded bg-transparent rounded-lg border-transparent border-indigo-500/30 group-hover:border-indigo-400 group-hover:bg-indigo-500/30 transition.all duration-300 ${
                      isActive("/DockerMonitoring") ? "bg-indigo-500/50" : ""
                    }`}
                  ></span>
                  <svg
                    className="w-7 h-5 transition duration-300 ease-in-out group-hover:text-indigo-400 text-indigo-500/60"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 21"
                  >
                    <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.376 11.376 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 003.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z" />
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    Docker Monitoring
                  </span>
                  <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                    IIS
                  </span>
                </Link>
              </div>
            </li>
            <li>
              <div
                className={`p-[2px] hover:bg-gradient-to-r hover:from-indigo-500 hover:to-transparent hover:rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-transform transition-colors ease-in-out duration-300 ${
                  isActive("/SQLInjections")
                    ? "translate-x-[0.5rem] bg-gradient-to-r from-indigo-500 to-transparent rounded-lg shadow-md hover:shadow-lg shadow-indigo-500/20"
                    : ""
                }`}
              >
                <Link
                  to="/SQLInjections"
                  className={`flex items-center p-2 rounded-lg w-full h-full group transition-colors relative ${
                    isActive("/SQLInjections")
                      ? "text-white bg-gray-950"
                      : "text-gray-900 dark:text-white bg-white dark:bg-gray-950"
                  }`}
                >
                  <span
                    className={`w-1 h-6 mr-2 rounded bg-transparent rounded-lg border-transparent border-indigo-500/30 group-hover: broder-indigo-400 group-hover:bg-indigo-500/30 transition.all duration-300 ${
                      isActive("/SQLInjections") ? "bg-indigo-500/50" : ""
                    }`}
                  ></span>
                  <svg 
                    className="w-7 h-5 transition duration-300 ease-in-out group-hover:text-indigo-400 text-indigo-500/60"
                    viewBox="0 0 24 24"   
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 18c0 2.2091 -3.5817 4 -8 4 -4.41828 0 -8 -1.7909 -8 -4v-4.026c0.50221 0.6166 1.21495 1.1289 2.00774 1.5252C7.58004 16.2854 9.69967 16.75 12 16.75c2.3003 0 4.42 -0.4646 5.9923 -1.2508 0.7928 -0.3963 1.5055 -0.9086 2.0077 -1.5252V18Z" stroke-width="1"></path>
                    <path d="M12 10.75c2.3003 0 4.42 -0.4646 5.9923 -1.25075 0.7928 -0.3964 1.5055 -0.90866 2.0077 -1.52528V12c0 0.5 -1.7857 1.5911 -2.6786 2.1576C15.9983 14.8192 14.118 15.25 12 15.25c-2.11795 0 -3.99832 -0.4308 -5.32144 -1.0924C5.5 13.5683 4 12.5 4 12V7.97397c0.50221 0.61662 1.21495 1.12888 2.00774 1.52528C7.58004 10.2854 9.69967 10.75 12 10.75Z" stroke-width="1"></path>
                    <path d="M17.3214 8.15761C15.9983 8.81917 14.118 9.25 12 9.25c-2.11795 0 -3.99832 -0.43083 -5.32144 -1.09239 -0.51472 -0.20165 -1.67219 -0.84269 -2.47706 -1.87826 -0.13696 -0.17622 -0.19574 -0.40082 -0.16162 -0.62137 0.02295 -0.14829 0.05492 -0.30103 0.0959 -0.39572C4.82815 3.40554 8.0858 2 12 2c3.9142 0 7.1718 1.40554 7.8642 3.26226 0.041 0.09469 0.073 0.24743 0.0959 0.39572 0.0341 0.22055 -0.0246 0.44515 -0.1616 0.62137 -0.8049 1.03557 -1.9623 1.67661 -2.4771 1.87826Z" stroke-width="1"></path>
                  </svg>
                  <span className="flex-1 ms-3 whitespace-nowrap">
                    SQL Injections
                  </span>
                </Link>
              </div>
            </li>
            <li className="absolute bottom-0 h-1/4 left-1/2 transform -translate-x-1/2">
              <label className="text-gray-400">
                <div>
                  <DevTools></DevTools>
                </div>
              </label>
            </li>
          </ul>
        </div>
      </aside>
      <button
        onClick={toggleSidebar}
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className={`
        inline-flex items-center p-2 mt-2 ms-3 mr-1 text-sm text-gray-500 rounded-lg 
        hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 
        dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600
        transition-opacity duration-500 ease-in-out
        ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
    </div>
  );
}
