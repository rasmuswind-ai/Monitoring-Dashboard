import { useEffect, useState } from "react";
import BasicLineChart from "./Widgets/RDP_Chart";
import Box from "@mui/material/Box";
import { PieChart } from "@mui/x-charts/PieChart";
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
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch chart data
        const resData = await fetch(`/rdp_data.txt?${Date.now()}`);
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
        const resStatus = await fetch(`/check-rdp-sessions?_=${Date.now()}`);
        const statusText = await resStatus.text();

        const isAbnormal = statusText === "ERROR: Abnormal RDP count detected";
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
      body: JSON.stringify({ pauseHours: 24 }),
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

  useEffect(() => {
    async function fetchCountryData() {
      fetch("/country-data.json")
        .then((res) => res.json())
        .then((data) => {
          const top10 = data
            .sort(
              (a: { count: number }, b: { count: number }) => b.count - a.count
            )
            .slice(0, 10);

          const formattedData = top10.map(
            (item: { count: number; country: string }, index: number) => ({
              id: index,
              value: item.count,
              label: item.country,
            })
          );

          setChartData(formattedData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error loading data:", error);
          setLoading(false);
        });
    }
    fetchCountryData();
    const interval = setInterval(fetchCountryData, 30000);

    return () => clearInterval(interval);
  }, []);

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
          RDP{" "}
          <span className="text-indigo-500 dark:text-indigo-500">Sessions</span>{" "}
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
              Abnormal amount of RDP Sessions detected!
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
              href="https://example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-25 h-10 rounded-lg bg-white text-gray-900 dark:bg-gray-950 dark:text-white px-4 py-2 transition duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/20 text-sm font-medium"
            >
              Elastic
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-start justify-center w-full max-w-screen-lg mx-auto mt-10 gap-4">
        <div className="p-4 w-1/2">
          <div className="p-4 h-80 -mt-5 bg-gray-950 rounded-xl border-2 border-indigo-500/30 shadow-md shadow-indigo-500/20">
            <h1 className="text-1xl font-extrabold text-center text-gray-900 dark:text-white mt-1">
              Top{" "}
              <span className="text-indigo-500 dark:text-indigo-500">
                Origin{" "}
              </span>
              Countries
            </h1>
            <div className="flex justify-center">
              <div className="h-1 mt-2 w-[70%] rounded-2xl bg-indigo-500"></div>
            </div>
            <div className="mt-4 h-56 flex items-center justify-center">
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : chartData.length > 0 ? (
                <PieChart
                  series={[
                    {
                      data: chartData,
                      innerRadius: 20,
                      outerRadius: 90,
                      paddingAngle: 2,
                      cornerRadius: 5,
                      startAngle: -45,
                      endAngle: 225,
                    },
                  ]}
                  width={400}
                  height={220}
                  slotProps={{
                    legend: {
                      sx: { display: "none" }, // hide via sx
                    },
                  }}
                />
              ) : (
                <p className="text-white">No data available</p>
              )}
            </div>
          </div>
        </div>
        <div className="p-4 w-1/2">
          <div className="p-4 h-80 -mt-5 bg-gray-950 rounded-xl border-2 border-indigo-500/30 shadow-md shadow-indigo-500/20">
            <h1 className="text-1xl font-extrabold text-center text-gray-900 dark:text-white mt-1">
              IP{" "}
              <span className="text-indigo-500 dark:text-indigo-500">
                Whitelist
              </span>
            </h1>
            <div className="flex justify-center">
              <div className="h-1 mt-2 w-[70%] rounded-2xl bg-indigo-500"></div>
            </div>
            <h1 className="text-1 mt-5 text-center text-gray-900 dark:text-white mt-1">
              Working on it..
            </h1>
            <div className="flex justify-center">
              <img
                className="w-32 h-32 mt-5 rounded-lg"
                src="/frog-spinning.gif"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
