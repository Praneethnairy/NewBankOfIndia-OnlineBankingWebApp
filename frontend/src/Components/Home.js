import React from 'react';
import homeImage from '../Images/home.jpg';
import gmail from '../Images/gmail.png';
import instagram from '../Images/instagram.png';
import twitter from '../Images/twitter.png';
import { useState,useEffect } from 'react';
import SignIn from './SignIn';
import Register from './Register';

export default function Home(props) {
  const [signIn,setSignIn] = useState(false);
  const [register,setRegister] = useState(window.localStorage.getItem("register") != null?window.localStorage.getItem("register"):"false");
  const [loading,setLoading] = useState(false);
  useEffect(()=>{},[signIn,register,loading]);

  const signInClicked = () =>{
    setSignIn(true);
  };

  const registerClicked = () =>{
    setRegister("true");
    window.localStorage.setItem("register",true);
    
  };

  return (<>
  {loading?
    <div className='div' id="container">
      <svg viewBox="0 0 50 50">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="0" stdDeviation="1.5" 
              floodColor="#fc6767"/>
          </filter>
        </defs>
        <circle id="spinner" style={{fill:'transparent',stroke:'#dd2476',strokeWidth: '3px',strokeLinecap: 'round'}} cx="25" cy="25" r="10"/>
    </svg>
    </div>
    :
  
    <div className='mainHomeDiv' style={{"position":"relative"}}>
      {/* Navbar */}
        <div className='navbarHomeDiv' >

            <h1>{props.bank_name}</h1>
            <div className='buttonHomeDiv'>
                <button type="button" className="button btn btn-light btn-outline-dark" onClick={signInClicked}>Sign In</button>
                <button type="button" className="button btn btn-light btn-outline-dark" onClick={registerClicked}>Register</button>
            </div>
        </div>
        <div className='line'></div>
        {signIn === true ? <SignIn setLoading = {setLoading} socket = {props.socket} setSignin = {setSignIn} setRegister = {setRegister}/> : <></>}
        {register === "true" ? <Register setRegister ={setRegister} setSignin = {setSignIn}/> : <></>}
      <div className='middleHomeDiv container text-center' >
        <div className='row'>
          <div className='col-6'>
            <h4>Welcome to {props.bank_name}</h4>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda, totam! Et consectetur sit repudiandae quas</p>
          </div>
          <div className='col-4'>
            <img id='homeImage' src={homeImage} alt="Home"/>
          </div>
        </div>
        
      </div>
      <div className='line'></div>
      {/* Contact */}
      <div className='LowerHomeDiv ' style={{"zIndex":-1}}>
        <h3>Contact Us</h3>
          <div className='contactFlex'>
            <div className="Card1 card" style={{"width": "20vw" ,"padding":"0 1vw"}}>
              <img src={gmail} style= {{"padding" :"0 2vw"}}className="card-img-top" alt="Gmail" width="10vw" height="auto"/>
              <div className="card-body">
                <p className="card-text">newbankofindia@nbi.com</p>
              </div>
            </div>
            <div className="Card1 card" style={{"width": "20vw" ,"padding":"0 1vw"}}>
              <img src={instagram} style= {{"padding" :"2vh 2vw"}}className="card-img-top" alt="Gmail" width="2vw" height="auto"/>
              <div className="card-body">
                <p className="card-text">new_bank_of_india</p>
              </div>
            </div>
            <div className="Card1 card" style={{"width": "20vw" ,"padding":"0 1vw"}}>
              <img src={twitter} style= {{"padding" :"0 2vw"}}className="card-img-top" alt="Gmail" width="10vw" height="auto"/>
              <div className="card-body">
                <p className="card-text">@newbankofindia</p>
              </div>
            </div>
          </div>
      </div>

      
        
    </div>
  }
  </>
  )
}
