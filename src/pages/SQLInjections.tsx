import { useEffect, useState } from "react";
import BasicLineChart from "./Widgets/RDP_Chart";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

interface RDPProps {
  isSidebarOpen: boolean;
}

export default function RDP({ isSidebarOpen }: RDPProps) {
  const [open, setOpen] = useState(false);
  const [dataPoints, setDataPoints] = useState<{ x: string; y: number }[]>([]);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch chart data
        const resData = await fetch(`/sql_injections.txt?${Date.now()}`);
        const textData = await resData.text();

        const lines = textData
          .trim()
          .split("\n")
          .map((line) => parseFloat(line.trim()))
          .filter((n) => !isNaN(n));

        const now = new Date();
        const intervalHours = 1;

        const points = lines.map((line, i) => {
          const date = new Date(now);
          date.setHours(
            now.getHours() - (lines.length - 1 - i) * intervalHours
          );
          return {
            x: date.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              hour12: true,
            }),
            y: line,
          };
        });
        setDataPoints(points);

        // Fetch alert status
        const resStatus = await fetch(`/check-sql-injections?_=${Date.now()}`);
        const statusText = await resStatus.text();

        const isAbnormal =
          statusText === "ERROR: Abnormal amount of SQL Injections detected";
        setOpen(isAbnormal);
      } catch (err) {
        console.error("Failed to fetch RDP data/status", err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);

    return () => clearInterval(interval);
  }, []);

  // Pause alert globally for 24 hours
  function handlePauseClick() {
    fetch("/pause-rdp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pauseHours: 1 }),
    })
      .then(() => setOpen(false))
      .catch(console.error);
  }

  // Reset pause globally
  function handleResetClick() {
    fetch("/pause-rdp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pauseHours: 0 }),
    })
      .then(() => setOpen(false))
      .catch(console.error);
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
          SQL{" "}
          <span className="text-indigo-500 dark:text-indigo-500">
            Injections
          </span>{" "}
        </h1>

        <div className="h-1 w-[70%] rounded-2xl bg-indigo-500 border-2 border-indigo-500 dark:border-indigo-500 mb-8"></div>

        <Box sx={{ width: "100%" }} className="px-4">
          <Collapse in={open}>
            <Alert
              severity="warning"
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={handlePauseClick}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{
                mb: 2,
                backgroundColor: isDark ? "#161308" : "#FFFBE6",
                color: isDark ? "#F1E694" : "#5C4400",
                border: isDark ? "1px" : "1px solid",
                borderColor: isDark ? "#F1E694" : "#FFEC99",
              }}
            >
              Abnormal amount of SQL Injections detected!
            </Alert>
          </Collapse>
        </Box>

        <div className="mb-6 hidden text-center">
          <button
            onClick={handleResetClick}
            className="inline-flex items-center px-4 py-2 bg-red-600 transition ease-in-out delay-75 hover:bg-red-700 text-white text-sm font-medium rounded-md hover:-translate-y-1 hover:scale-100"
          >
            Reset Timer
          </button>
        </div>

        <div className="p-4 w-full">
          <div className="p-4 -mt-5 bg-gray-950 rounded-xl border-2 border-indigo-500/30 shadow-md shadow-indigo-500/20">
            <BasicLineChart dataPoints={dataPoints} />
          </div>
        </div>
        <div className="fixed bottom-6 right-6">
          <div className="p-[2px] rounded-lg bg-gradient-to-t from-indigo-500 to-transparent transition duration-300 group hover:shadow-lg hover:shadow-indigo-500/20">
            <a
              href="https://infkibana1.zitcom.dk/s/windows/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:60000),time:(from:now-1h,to:now))&_a=(columns:!(method,host,uri-stem,uri-query,status,x-forwarded-for,source.geo.country_name,source.as.organization.name),filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'830de1d2-c95e-5c09-96a9-6e114619acc9',key:uri-query,negate:!f,params:(query:SELECT),type:phrase),query:(match_phrase:(uri-query:SELECT)))),index:'830de1d2-c95e-5c09-96a9-6e114619acc9',interval:auto,query:(language:kuery,query:''),sort:!(!('@timestamp',desc)))"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-25 h-10 rounded-lg bg-white text-gray-900 dark:bg-gray-950 dark:text-white px-4 py-2 transition duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20 text-sm font-medium"
            >
              Elastic
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
