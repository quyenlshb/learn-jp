// src/Login.js
import React, { useState } from "react";
import { auth, googleProvider } from "./firebaseClient";
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Đăng nhập bằng email
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  // Đăng ký bằng email
  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  // Đăng nhập Google
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Đăng nhập / Đăng ký</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleLogin}>Đăng nhập</button>
      <button onClick={handleRegister}>Đăng ký</button>
      <br /><br />

      <button onClick={handleGoogleLogin}>Đăng nhập với Google</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Login;
