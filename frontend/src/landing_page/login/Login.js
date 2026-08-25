import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3002/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");

        // Store user information
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        // Send JWT token to dashboard
        window.location.href =
          `http://localhost:3000?token=${encodeURIComponent(
            data.token
          )}`;
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="container text-center p-5">
      <h1>Login to Zerodha</h1>

      <p className="text-muted">
        Login to continue investing and trading.
      </p>

      <input
        type="email"
        placeholder="Email"
        className="form-control mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="form-control mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="btn btn-primary"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
}

export default Login;