import React, {useState} from 'react';
import { auth } from '../firebaseClient';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function Register(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [name,setName]=useState('');
  const [err,setErr]=useState('');
  const nav = useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setErr('');
    try{
      const userCred = await createUserWithEmailAndPassword(auth,email,password);
      if(name) await updateProfile(userCred.user,{displayName:name});
      await sendEmailVerification(userCred.user);
      nav('/login', {replace:true});
    }catch(err){
      setErr(err.message);
    }
  };

  return (<div style={{maxWidth:420,margin:'2rem auto'}}>
    <h2>Đăng ký</h2>
    <form onSubmit={handleSubmit}>
      <input placeholder='Tên' value={name} onChange={e=>setName(e.target.value)} required/>
      <input placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} type='email' required/>
      <input placeholder='Mật khẩu' value={password} onChange={e=>setPassword(e.target.value)} type='password' required/>
      <button type='submit'>Đăng ký</button>
    </form>
    {err && <p style={{color:'red'}}>{err}</p>}
  </div>);
}
