import { useState } from "react";
import Login from "./components/Login";
import Students from "./components/Students";
import Attendance from "./components/Attendance";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("students");

  if (!loggedIn) {
    return <Login onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="dashboard">

      <header className="topbar">
        <h1>Bluetooth Attendance System</h1>

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
          <button onClick={() => setLoggedIn(false)}>Logout</button>
        </nav>
      </header>

      {page === "students" ? <Students /> : <Attendance />}

    </div>
  );
}

export default App;
