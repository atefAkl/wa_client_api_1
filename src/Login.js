import React, { useState } from "react";

const Login = () => {
  const [userNameOrEmailAddress, setUserNameOrEmailAddress] = useState("web");
  const [password, setPassword] = useState("W3b_Te$t");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // 1. Login Request
      const loginRes = await fetch("https://neosending.com/api/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/plain",
        },
        body: JSON.stringify({
          userNameOrEmailAddress,
          password,
          rememberMe: false,
        }),
      });
      if (!loginRes.ok) {
        throw new Error("Invalid username or password");
      }
      // 2. Token Request
      const tokenRes = await fetch("https://neosending.com/connect/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: new URLSearchParams({
          client_id: "Whatsapp_App",
          // client_secret: "" // أضف هذا السطر إذا كان لديك client_secret
          username: userNameOrEmailAddress,
          password,
          grant_type: "password",
          scope: "openid",
        }),
      });
      if (!tokenRes.ok) {
        let errorMsg = "Failed to get token";
        try {
          const errData = await tokenRes.json();
          errorMsg = errData.error_description || errData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }
      const tokenData = await tokenRes.json();
      localStorage.setItem("access_token", tokenData.access_token);
      // Redirect or show success
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "100px auto",
        padding: 24,
        border: "1px solid #ddd",
        borderRadius: 8,
        boxShadow: "0 2px 8px #eee",
      }}
    >
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Username or Email
          </label>
          <input
            type="text"
            value={userNameOrEmailAddress}
            onChange={(e) => setUserNameOrEmailAddress(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
