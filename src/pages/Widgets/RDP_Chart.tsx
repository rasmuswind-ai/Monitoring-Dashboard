// Chart.tsx
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { useTheme } from "@mui/material/styles";

type DataPoint = {
  x: string;
  y: number;
};

interface BasicLineChartProps {
  dataPoints?: DataPoint[];
  refreshInterval?: number; // Allow customizable refresh interval
  intervalHours?: number; // Allow customizable hour intervals
}

// Constants moved outside component to prevent recreation
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  hour12: true,
} as const;

const DEFAULT_REFRESH_INTERVAL = 30000; // 30 seconds
const DEFAULT_INTERVAL_HOURS = 1;

// Value formatter function moved outside to prevent recreation
const valueFormatter = (value: number): string => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toString();
};

export default function BasicLineChart({
  dataPoints: externalDataPoints,
  refreshInterval = DEFAULT_REFRESH_INTERVAL,
  intervalHours = DEFAULT_INTERVAL_HOURS,
}: BasicLineChartProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // Use ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);

  // Internal state for dataPoints
  const [dataPoints, setDataPoints] = useState<DataPoint[]>(
    externalDataPoints ?? []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized data processing function
  const processRawData = useCallback(
    (text: string): DataPoint[] => {
      const lines = text.trim().split("\n");
      const now = new Date();

      return lines.map((line, index) => {
        const date = new Date(now);
        date.setHours(
          now.getHours() - (lines.length - 1 - index) * intervalHours
        );

        return {
          x: date.toLocaleString("en-US", DATE_FORMAT_OPTIONS),
          y: parseFloat(line) || 0, // Handle NaN values
        };
      });
    },
    [intervalHours]
  );

  // Memoized fetch function
  const fetchData = useCallback(async (): Promise<void> => {
    if (!isMountedRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/rdp_data.txt?${Date.now()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      const points = processRawData(text);

      if (isMountedRef.current) {
        setDataPoints(points);
      }
    } catch (error) {
      console.error("Error fetching RDP data:", error);
      if (isMountedRef.current) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [processRawData]);

  // Effect for data fetching
  useEffect(() => {
    // If external data is provided, use it and don't fetch
    if (externalDataPoints && externalDataPoints.length > 0) {
      setDataPoints(externalDataPoints);
      return;
    }

    // Initial fetch
    fetchData();

    // Set up interval for periodic fetching
    const intervalId = setInterval(fetchData, refreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [externalDataPoints, fetchData, refreshInterval]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Memoized chart data to prevent unnecessary recalculations
  const chartData = useMemo(
    () => ({
      xLabels: dataPoints.map((point) => point.x),
      yValues: dataPoints.map((point) => point.y),
    }),
    [dataPoints]
  );

  // Memoized theme-based styles
  const chartStyles = useMemo(
    () => ({
      "& .MuiChartsAxis-bottom .MuiChartsAxis-line": {
        stroke: "#646466",
        strokeWidth: 1,
      },
      "& .MuiChartsAxis-left .MuiChartsAxis-line": {
        stroke: "#646466",
        strokeWidth: 1,
      },
      "& .MuiChartsGrid-line": {
        stroke: "rgba(255, 255, 255, 0.05)",
      },
    }),
    [isDark]
  );

  // Memoized axis configurations
  const xAxisConfig = useMemo(
    () => [
      {
        data: chartData.xLabels,
        scaleType: "point" as const,
        label: "Date",
        labelStyle: { fill: "#646466" },
        tickLabelStyle: { fill: "#646466" },
      },
    ],
    [chartData.xLabels, isDark]
  );

  const yAxisConfig = useMemo(
    () => [
      {
        label: "Amount of Logs",
        labelStyle: { fill: "#646466" },
        tickLabelStyle: { fill: "#646466" },
        valueFormatter,
      },
    ],
    [isDark]
  );

  const seriesConfig = useMemo(
    () => [
      {
        data: chartData.yValues,
        area: true,
        showMark: false,
      },
    ],
    [chartData.yValues]
  );

  // Show error state if there's an error
  if (error) {
    return (
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#646466",
        }}
      >
        Error loading chart data: {error}
      </div>
    );
  }

  // Show loading state
  if (isLoading && dataPoints.length === 0) {
    return (
      <div
        style={{
          height: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#646466",
        }}
      >
        Loading chart data...
      </div>
    );
  }

  return (
    <LineChart
      sx={chartStyles}
      xAxis={xAxisConfig}
      yAxis={yAxisConfig}
      series={seriesConfig}
      height={300}
      grid={{
        horizontal: true,
        vertical: true,
      }}
    />
  );
}
