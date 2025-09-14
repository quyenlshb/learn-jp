import React, {useState} from 'react';
import { auth } from '../firebaseClient';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword(){
  const [email,setEmail]=useState('');
  const [msg,setMsg]=useState('');
  const [err,setErr]=useState('');
  const nav = useNavigate();

  const submit=async(e)=>{
    e.preventDefault();
    setErr(''); setMsg('');
    try{
      await sendPasswordResetEmail(auth, email);
      setMsg('Email khôi phục đã được gửi (nếu tồn tại).');
    }catch(err){
      setErr(err.message);
    }
  };

  return (<div style={{maxWidth:420,margin:'2rem auto'}}>
    <h2>Khôi phục mật khẩu</h2>
    <form onSubmit={submit}>
      <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} type='email' required/>
      <button type='submit'>Gửi</button>
    </form>
    {msg && <p style={{color:'green'}}>{msg}</p>}
    {err && <p style={{color:'red'}}>{err}</p>}
  </div>);
}
