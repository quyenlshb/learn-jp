import React, {useState} from 'react';
import { auth } from '../firebaseClient.js';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const nav = useNavigate();

  const submit=async(e)=>{
    e.preventDefault();
    setErr('');
    try{
      await signInWithEmailAndPassword(auth,email,password);
      nav('/', {replace:true});
    }catch(err){
      setErr(err.message);
    }
  };

  return (<div style={{maxWidth:420,margin:'2rem auto'}}>
    <h2>Đăng nhập</h2>
    <form onSubmit={submit}>
      <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} type='email' required/>
      <input placeholder='Mật khẩu' value={password} onChange={e=>setPassword(e.target.value)} type='password' required/>
      <button type='submit'>Đăng nhập</button>
    </form>
    <p><Link to='/reset'>Quên mật khẩu?</Link></p>
    {err && <p style={{color:'red'}}>{err}</p>}
  </div>);
}
