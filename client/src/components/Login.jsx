import { useState } from "react";
import { login, register } from "../api";

function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    try {
      const data = isLogin ? await login(formData) : await register(formData);
      localStorage.setItem("token", data.token);
      onLogin(data.user);
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="container">

      <div className="form-box">

        <h1>Bluetooth Attendance System</h1>

        <p>Smart Classroom Attendance Management</p>

        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {isLogin ? "Login" : "Register"}
          </button>

        </form>

        <p className="switch-text">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;
