/**QuickSchedule Logo*/
function Logo() {
  const brandStyle = {
    marginBottom: "30px",
    fontWeight: "bold",
    fontSize: "1.5em",
    textAlign: "center",
    fontFamily: "'Montserrat', sans-serif",
  };

  const scheduleStyle = {
    color: "#007BFF", // Green
  };

  const quickStyle = {
    color: "#28A745", // Blue
  };

  return (
    <div style={brandStyle}>
      <span style={quickStyle}>Quick</span>
      <span style={scheduleStyle}>Schedule</span>
    </div>
  );
}

export default Logo;
