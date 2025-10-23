import "./index.css";
import { useState } from "react";
import Sidebar from "./pages/Widgets/Sidebar";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import RDP from "./pages/RDP";
import DockerMonitoring from "./pages/DockerMonitoring";
import SQLInjections from "./pages/SQLInjections";
import { ThemeProvider } from "./ThemeContext";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ThemeProvider>
      <div className="flex gb bg-white dark:bg-primary">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <div
          className={`transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          } flex-1`}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/RDP" replace />} />
            <Route path="/Home" element={<Home />} />
            <Route
              path="/RDP"
              element={<RDP isSidebarOpen={isSidebarOpen} />}
            />
            <Route
              path="/DockerMonitoring"
              element={<DockerMonitoring isSidebarOpen={isSidebarOpen} />}
            />
            <Route
              path="/SQLInjections"
              element={<SQLInjections isSidebarOpen={isSidebarOpen} />}
            />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  );
}
