import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {

  const [vehicles, setVehicles] = useState(0);
  const [signal, setSignal] = useState("GREEN");
  const [timer, setTimer] = useState(30);
  const [trafficData, setTrafficData] = useState([]);

  const fetchTrafficData = async () => {

    try {

      const response = await axios.get(
        "https://smart-ai-traffic-system.onrender.com/traffic"
      );

      const count = response.data.vehicles;

      setVehicles(count);

      // Analytics Data
      setTrafficData(prev => [

        ...prev.slice(-9),

        {
          time: new Date().toLocaleTimeString(),
          vehicles: count
        }

      ]);

      // Smart Signal Logic
      if (count > 10) {
        setSignal("GREEN");
        setTimer(45);
      }
      else if (count > 5) {
        setSignal("YELLOW");
        setTimer(30);
      }
      else {
        setSignal("RED");
        setTimer(15);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    fetchTrafficData();

    const interval = setInterval(() => {
      fetchTrafficData();
    }, 1000);

    return () => clearInterval(interval);

  }, []);

  return (

    <div style={mainContainer}>

      {/* Background Glow */}
      <div style={overlay}></div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={contentContainer}
      >

        {/* Header */}
        <h1 style={titleStyle}>
          🚦 Smart AI Traffic Management System
        </h1>

        <p style={subtitleStyle}>
          Real-Time Vehicle Detection & Intelligent Signal Control
        </p>

        {/* Cards */}
        <div style={cardContainer}>

          {/* Vehicle Card */}
          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: 1
            }}
            whileTap={{ scale: 0.95 }}
            style={cardStyle}
          >

            <h2 style={cardTitle}>🚗 Vehicles</h2>

            <p style={numberStyle}>
              {vehicles}
            </p>

          </motion.div>

          {/* Signal Card */}
          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: -1
            }}
            whileTap={{ scale: 0.95 }}
            style={cardStyle}
          >

            <h2 style={cardTitle}>🚦 Signal</h2>

            <p style={{
              ...numberStyle,
              color:
                signal === "GREEN"
                  ? "#22c55e"
                  : signal === "YELLOW"
                    ? "#facc15"
                    : "#ef4444"
            }}>
              {signal}
            </p>

          </motion.div>

          {/* Timer Card */}
          <motion.div
            whileHover={{
              scale: 1.08,
              rotate: 1
            }}
            whileTap={{ scale: 0.95 }}
            style={cardStyle}
          >

            <h2 style={cardTitle}>⏱ Timer</h2>

            <p style={numberStyle}>
              {timer}s
            </p>

          </motion.div>

        </div>

        {/* Analytics Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          style={chartContainer}
        >

          <h2 style={sectionTitle}>
            📊 Live Traffic Analytics
          </h2>

          <ResponsiveContainer width="100%" height={350}>

            <LineChart data={trafficData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
              />

              <XAxis
                dataKey="time"
                stroke="#cbd5e1"
              />

              <YAxis
                stroke="#cbd5e1"
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="vehicles"
                stroke="#38bdf8"
                strokeWidth={4}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </motion.div>

        {/* Live Video Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.6 }}
          style={videoContainer}
        >

          <h2 style={sectionTitle}>
            🎥 Live AI Traffic Feed
          </h2>

          <img
            src="https://smart-ai-traffic-system.onrender.com/video"
            alt="Live Traffic"
            style={videoStyle}
          />

        </motion.div>

      </motion.div>

    </div>
  );
}

/* MAIN BACKGROUND */
const mainContainer = {
  minHeight: "100vh",
  background:
    "linear-gradient(to right, #020617, #0f172a, #020617)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  fontFamily: "Arial",
  padding: "40px 0"
};

/* GLOW EFFECT */
const overlay = {
  position: "absolute",
  width: "100%",
  height: "100%",
  background:
    "radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 40%)"
};

/* CONTENT */
const contentContainer = {
  zIndex: 2,
  textAlign: "center",
  width: "90%"
};

/* TITLE */
const titleStyle = {
  color: "white",
  fontSize: "55px",
  fontWeight: "bold",
  marginBottom: "10px",
  letterSpacing: "1px"
};

/* SUBTITLE */
const subtitleStyle = {
  color: "#cbd5e1",
  fontSize: "20px",
  marginBottom: "50px"
};

/* CARDS */
const cardContainer = {
  display: "flex",
  justifyContent: "center",
  gap: "30px",
  flexWrap: "wrap"
};

/* CARD */
const cardStyle = {
  width: "280px",
  padding: "35px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.08)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 35px rgba(0,0,0,0.4)",
  color: "white",
  cursor: "pointer",
  transition: "0.3s"
};

/* CARD TITLE */
const cardTitle = {
  fontSize: "28px",
  marginBottom: "20px"
};

/* CARD NUMBER */
const numberStyle = {
  fontSize: "52px",
  fontWeight: "bold",
  color: "#38bdf8"
};

/* SECTION TITLE */
const sectionTitle = {
  color: "white",
  fontSize: "34px",
  marginBottom: "25px"
};

/* CHART */
const chartContainer = {
  marginTop: "70px",
  background: "rgba(255,255,255,0.05)",
  padding: "30px",
  borderRadius: "24px",
  backdropFilter: "blur(14px)",
  boxShadow: "0 10px 35px rgba(0,0,0,0.35)"
};

/* VIDEO SECTION */
const videoContainer = {
  marginTop: "70px",
  textAlign: "center"
};

/* VIDEO */
const videoStyle = {
  width: "85%",
  maxWidth: "1000px",
  borderRadius: "24px",
  border: "3px solid rgba(255,255,255,0.12)",
  boxShadow: "0 10px 35px rgba(0,0,0,0.55)"
};

export default App;