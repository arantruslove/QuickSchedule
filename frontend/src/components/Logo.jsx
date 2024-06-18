import React from "react";

function Logo() {
  const brandStyle = {
    fontWeight: "bold",
    fontSize: "1.5em",
    textAlign: "center",
    fontFamily: "'Montserrat', sans-serif",
    marginBottom: "30px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  const quickStyle = {
    color: "#007BFF", // Blue
  };

  const scheduleStyle = {
    color: "#28A745", // Green
  };

  return (
    <div style={brandStyle}>
      <span style={quickStyle}>Quick</span>
      <span style={scheduleStyle}>Schedule</span>
    </div>
  );
}

export default Logo;
