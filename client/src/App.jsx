import { useState } from "react";
import Login from "./components/Login";
import Students from "./components/Students";
import Attendance from "./components/Attendance";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("students");

  function handleLogout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="dashboard">

      <header className="topbar">
        <h1>Bluetooth Attendance System</h1>

        <p>Welcome, {user.name}</p>

        <nav>
          <button
            className={page === "students" ? "active" : ""}
            onClick={() => setPage("students")}
          >
            Students
          </button>
          <button
            className={page === "attendance" ? "active" : ""}
            onClick={() => setPage("attendance")}
          >
            Attendance
          </button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      {page === "students" ? <Students /> : <Attendance />}

    </div>
  );
}

export default App;
