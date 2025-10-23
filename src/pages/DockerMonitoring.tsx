import { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import DevTools from "./Widgets/DevTools";

interface DockerMonitoringProps {
  isSidebarOpen: boolean;
}

export default function DockerMonitoring({
  isSidebarOpen,
}: DockerMonitoringProps) {
  const [isEmpty, setIsEmpty] = useState(true);
  const [fileContent, setFileContent] = useState("");
  const [dockerPausedUntil, setDockerPausedUntil] = useState<Date | null>(
    () => {
      const stored = localStorage.getItem("dockerPausedUntil");
      return stored ? new Date(stored) : null;
    }
  );
  const intervalRef = useRef<number | null>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    function fetchData() {
      const now = new Date();
      if (dockerPausedUntil && now < dockerPausedUntil) {
        console.log("Fetch paused until:", dockerPausedUntil);
        return;
      }

      fetch(`/ContainerAlert.txt?${Date.now()}`)
        .then((res) => res.text())
        .then((text) => {
          const trimmed = text.trim();
          setIsEmpty(text.trim().length === 0);
          setFileContent(trimmed);
        })
        .catch((err) => {
          console.error("Error reading file:", err);
          setIsEmpty(true);
          setFileContent("");
        });
    }

    fetchData();

    intervalRef.current = setInterval(fetchData, 30000); // fetch data every 30 seconds

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dockerPausedUntil]);

  function handlePauseClick() {
    const pauseUntilDate = new Date();
    pauseUntilDate.setHours(pauseUntilDate.getHours() + 24);
    setDockerPausedUntil(pauseUntilDate);
    localStorage.setItem("dockerPausedUntil", pauseUntilDate.toISOString());

    setIsEmpty(true);
    setFileContent("");
  }

  function handleResetClick() {
    setDockerPausedUntil(null);
    localStorage.removeItem("dockerPausedUntil");
  }

  return (
    <div
      className={`bg-white dark:bg-primary h-screen overflow-hidden transition-all duration-300 ${
        isSidebarOpen ? "px-0" : "px-5"
      }`}
    >
      <div className="flex flex-col items-center justify-start w-full max-w-screen-lg mx-auto mt-10">
        <h1
          className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mt-8 mb-4"
          style={{ height: "4rem", marginBottom: "2rem" }}
        >
          IIS{" "}
          <span className="text-indigo-500 dark:text-indigo-500">Docker</span>{" "}
          Monitoring
        </h1>

        <div className="h-1 w-[70%] rounded-2xl bg-indigo-500 border-2 border-indigo-500 dark:border-indigo-500 mb-8"></div>

        {isEmpty && (
          <Box display="flex" justifyContent="center" marginTop={"-2rem"}>
            <Alert
              severity="success"
              sx={{
                mb: 2,
                mt: 4,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                backgroundColor: isDark
                  ? "#0D130E"
                  : "rgba(167, 253, 174, 0.3)",
                color: isDark ? "#BFE9C5" : "rgb(44, 75, 46)",
              }}
            >
              No Container Alerts
            </Alert>
          </Box>
        )}
        {!isEmpty && (
          <div className="p-4 w-full">
            <div className="p-4 -mt-5 bg-gray-950 rounded-xl border-2 border-indigo-500/30 shadow-md shadow-indigo-500/20">
              <pre className="whitespace-pre-wrap break-words text-black dark:text-white">
                {fileContent}
              </pre>
            </div>
          </div>
        )}
        {!isEmpty && (
          <div>
            <button
              onClick={handlePauseClick}
              className="relative inline-flex items-center justify-center mt-4 px-8 py-2 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-red-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-500"></span>
              <span className="relative text-base font-semibold">Clear</span>
            </button>
          </div>
        )}
        {!isEmpty && (
          <div className="hidden">
            <button
              onClick={handleResetClick}
              className="relative inline-flex items-center justify-center mt-4 px-8 py-2 overflow-hidden tracking-tighter text-white bg-gray-800 rounded-md group"
            >
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-red-600 rounded-full group-hover:w-56 group-hover:h-56"></span>
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-500"></span>
              <span className="relative text-base font-semibold">
                Reset Timer
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
