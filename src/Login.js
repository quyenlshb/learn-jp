import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmail, signInWithGooglePopup } from './services/authService';
import ErrorToast from './components/ErrorToast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function friendlyMessage(err) {
    const code = err?.code || '';
    if (code.includes('auth/user-not-found')) return 'Tài khoản không tồn tại.';
    if (code.includes('auth/wrong-password')) return 'Mật khẩu sai.';
    if (code.includes('auth/invalid-email')) return 'Email không hợp lệ.';
    if (code.includes('auth/too-many-requests')) return 'Quá nhiều lần đăng nhập thất bại. Thử lại sau.';
    return err?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmail({ email, password });
      navigate('/home');
    } catch (err) {
      setError(friendlyMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError('');
    try {
      await signInWithGooglePopup();
      navigate('/home');
    } catch (err) {
      setError(friendlyMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth: 520, margin: '0 auto', padding: 24}}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label>
          Mật khẩu
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <div style={{marginTop: 12}}>
          <button type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng nhập'}</button>
        </div>
      </form>

      <div style={{marginTop: 18}}>
        <div>Hoặc đăng nhập bằng</div>
        <button onClick={handleGoogle} disabled={loading} style={{marginTop: 8}}>Google</button>
      </div>

      <div style={{marginTop: 14}}>
        <Link to="/register">Bạn chưa có tài khoản? Đăng ký</Link>
      </div>

      <ErrorToast message={error} onClose={() => setError('')} />
    </div>
  );
}
