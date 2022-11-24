import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

export default function SignIn(props) {
  const [varAlert, setVarAlert] = useState(false);
  const cookie = new Cookies();
  const navigate = useNavigate();
  const signInFormSubmitted = (e) =>{
    e.preventDefault();
    const requested = {
      uName : e.target.uName.value,
      passwd : e.target.uPass.value,
      socket_id : props.socket.id
    };
    // console.log(requested);
    axios.post(`${process.env.REACT_APP_SERVER_URL}/signIn`,requested).then((res)=>{
      cookie.set('userAuthToken',res.data.authTok);
      navigate('/Dashboard');
    }).catch((err)=>{
      setVarAlert(true);
      setTimeout(()=>{
        setVarAlert(false);
      },3000);
    })
  }

  const gotToRegister = () => {
    window.localStorage.setItem('register', true);
    props.setSignin(false);
    props.setRegister("true");
  };

  const closeFunction = () =>{
    props.setSignin(false);
  }

  return (
    <div className='mainSignInComponent' style={{"position":"fixed","left":0,"top":0,"zIndex":1}}>
        <div className='subSignInBox'>
            {varAlert === true?<Alert severity="error" >Invalid Username or Password!!!</Alert>:<></>}
            <h1>Sign In</h1>
            <form onSubmit={signInFormSubmitted}>

                <TextField fullWidth label="Username" id="uName" name="uName"  sx={{"margin":"1vh 0"}} required/>

                <TextField fullWidth type = "password" label="Password" id="uPassword" name="uPass" sx={{"margin":"1vh 0"}} required/>
                <Button type="submit" variant="outlined" sx={{"margin":"1vh 0"}} >Sign In</Button>
                <div>
                  <Button variant="text" onClick={gotToRegister}>Register</Button>
                  <Button variant="text" onClick={closeFunction}>Close</Button>
                </div>
            </form>
        </div>
    </div>
  )
}
