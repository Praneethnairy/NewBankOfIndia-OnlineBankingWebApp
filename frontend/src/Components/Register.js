import React from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function Register(props) {

    const registerFormSubmitted = (e) =>{
        e.preventDefault();
        if(e.target.uPass.value !== e.target.retype.value){
            console.log("Error");
        }
        else{
            const required = {
                acno : e.target.acno.value,
                uName: e.target.uName.value,
                uPass: e.target.uPass.value,
                email: e.target.email.value
            };
            axios.post(`${process.env.REACT_APP_SERVER_URL}/registerUser`, required).then((res)=>{
                if(res.data.flag === true){
                    window.localStorage.setItem('register', false);
                    props.setSignin(true);
                    props.setRegister("false");
                }
                else{
                    console.log(res.data.msg);
                }
                
            }).catch((err)=>{
                // if(err) throw err;
                console.log("User already registered");
            });
        }
    };

    const gotToSignIn = () =>{
        window.localStorage.setItem('register', false);
        props.setSignin(true);
        props.setRegister("false");
    };

    const closeFunction = () =>{
        window.localStorage.setItem('register', false);
        // props.setSignin(true);
        props.setRegister("false");
      }
  return (
    <div className='mainSignInComponent' style={{"position":"fixed","left":0,"top":0,"zIndex":1}}>
        <div className='subSignInBox'>
            <h1>Register</h1>
            <form onSubmit={registerFormSubmitted}>
                <TextField fullWidth label="Bank Account Number" id="acno" name='acno' sx={{"margin":"1vh 0"}} required/>

                <TextField fullWidth label="Username" id="uName" name = "uName" sx={{"margin":"1vh 0"}} required/>

                <TextField fullWidth type="password" label="Password" id="uPassword" name="uPass" sx={{"margin":"1vh 0"}} required/>

                <TextField fullWidth label="Retype Password" id="retypePassword" name="retype" sx={{"margin":"1vh 0"}} required/>

                <TextField fullWidth type="email" label="Email" id="email" name="email" sx={{"margin":"1vh 0"}} required/>

                <Button type="submit" variant="outlined" sx={{"margin":"1vh 0"}} >Register</Button>
                <div>
                    <Button variant="text" onClick={gotToSignIn}>Sign In</Button>
                    <Button variant="text" onClick={closeFunction}>Close</Button>
                </div>
            </form>
        </div>
    </div>
  )
}
