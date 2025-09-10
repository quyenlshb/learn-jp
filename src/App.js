import React, { useState } from "react";
import { auth, googleProvider } from "./firebaseClient";
import { useAuthState } from "react-firebase-hooks/auth";
import { 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import Dashboard from "./Dashboard";

function App() {
  const [user, loading] = useAuthState(auth);

  // State cho login email
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Đăng nhập Google
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message);
    }
  };

  // Đăng nhập Email/Password
  const loginWithEmail = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  // Đăng ký Email/Password
  const registerWithEmail = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  // Đăng xuất
  const logout = () => {
    signOut(auth);
  };

  if (loading) return <p>Đang tải...</p>;

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Học tiếng Nhật</h1>

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

        <button onClick={loginWithEmail}>Đăng nhập</button>
        <button onClick={registerWithEmail}>Đăng ký</button>
        <br /><br />

        <button onClick={loginWithGoogle}>Đăng nhập bằng Google</button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <button onClick={logout}>Đăng xuất</button>
      <Dashboard user={user} />
    </div>
  );
}

export default App;
