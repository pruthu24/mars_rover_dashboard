import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";
import { Card, CardContent, Typography, Grid, CircularProgress } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";
import Box from "@mui/material/Box";

// Socket connection
const socket = io("http://localhost:3000");

// Mock Mars API (replace with a real Mars data API if available)
const fetchMarsData = async () => {
  // Replace with a real API like NASA or Mars Weather Service
  return {
    temperature: `${Math.random() * 50 - 20}°C`,
    windSpeed: `${Math.random() * 30} m/s`,
    pressure: `${Math.random() * 5 + 5} kPa`,
  };
};

function Dashboard() {
  const [marsData, setMarsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndUpdateData = async () => {
      const data = await fetchMarsData();
      setMarsData(data);
      setIsLoading(false);
    };

    fetchAndUpdateData();
    const interval = setInterval(fetchAndUpdateData, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard">
      <h1>Mars Rover Control Dashboard</h1>
      <div className="mars-data">
        <h2>Mars Atmosphere Details</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            <li>Temperature: {marsData.temperature}</li>
            <li>Wind Speed: {marsData.windSpeed}</li>
            <li>Pressure: {marsData.pressure}</li>
          </ul>
        )}
      </div>
    </div>
  );
}

function Joystick({ onControl }) {
  return (
    <div className="joystick">
      <button onClick={() => onControl("up")} className="joystick-btn up">
        Up
      </button>
      <button onClick={() => onControl("down")} className="joystick-btn down">
        Down
      </button>
    </div>
  );
}

function App() {
  const handleControl = (direction) => {
    socket.emit("move", direction);
  };

  return (
    <div className="app">
      <Dashboard />
      <Joystick onControl={handleControl} />
    </div>
  );
}

export default App;
