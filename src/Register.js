import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpWithEmail, signInWithGooglePopup } from './services/authService';
import ErrorToast from './components/ErrorToast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  function friendlyMessage(err) {
    const code = err?.code || '';
    if (code.includes('auth/email-already-in-use')) return 'Email này đã được sử dụng.';
    if (code.includes('auth/invalid-email')) return 'Email không hợp lệ.';
    if (code.includes('auth/weak-password')) return 'Mật khẩu quá yếu (tối thiểu 6 ký tự).';
    if (code.includes('auth/popup-blocked')) return 'Trình duyệt chặn popup đăng nhập Google. Vui lòng cho phép popup.';
    if (code.includes('auth/popup-closed-by-user')) return 'Bạn đã đóng cửa sổ Google. Thử lại.';
    return err?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signUpWithEmail({ email, password, displayName });
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
      <h2>Đăng ký</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tên (hiển thị)
          <input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Tên của bạn" />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label>
          Mật khẩu
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="ít nhất 6 ký tự" />
        </label>
        <div style={{marginTop: 12}}>
          <button type="submit" disabled={loading}>{loading ? 'Đang xử lý...' : 'Đăng ký'}</button>
        </div>
      </form>

      <div style={{marginTop: 18}}>
        <div>Hoặc đăng ký bằng</div>
        <button onClick={handleGoogle} disabled={loading} style={{marginTop: 8}}>Google</button>
      </div>

      <div style={{marginTop: 14}}>
        <small>Bằng việc đăng ký bạn đồng ý với điều khoản của chúng tôi.</small>
      </div>

      <ErrorToast message={error} onClose={() => setError('')} />
    </div>
  );
}
