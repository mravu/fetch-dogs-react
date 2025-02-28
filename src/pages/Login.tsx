// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAPI } from "../utils/api";
import './Login.css';

const Login = ({ onLogin }: { onLogin: () => void }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetchAPI("/auth/login", {
        method: "POST",
        body: JSON.stringify({ name, email }),
      });
console.log(res);

      onLogin()
        navigate('/dogs');
    
    } catch (error) {
        console.log(error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">

      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="login-form" onSubmit={handleLogin}>
      <h2>Login</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;