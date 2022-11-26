import React from 'react'
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';
import { red } from '@mui/material/colors';
// import Badge from '@mui/material/Badge';
// import MailIcon from '@mui/icons-material/Mail';

const cookie = new Cookies();

export default function Navbar(props) {
  const token = cookie.get('userAuthToken');
  const [anchorEl, setAnchorEl] = useState(null);
  const [name,setName] = useState('');
  const [state,setState] = useState(false);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  useEffect(()=>{
    axios.post(`${process.env.REACT_APP_SERVER_URL}/getFname`,{tok:token}).then((res)=>{
      setName(res.data.Fname);
    })
  },[state]);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    setAnchorEl(null);
    // e.preventDefault();

  };

  const clickedDash = () =>{
    navigate("/Dashboard")
  }

  const clickedAcc = () =>{
    navigate("/Transactions")
  }

  const clickedOB = () =>{
    navigate("/onlinePayment")
  }


  const logOutClicked = () =>{
    axios.post(`${process.env.REACT_APP_SERVER_URL}/logOut`,{tok:token}).then((res)=>{
      if(res.data.flag === true){
        cookie.remove('userAuthToken',{path:'/',domain:'localhost'});
        navigate('/');
      }
    });
  };

  return (
    <div>
        <div className='navbarHomeDiv' >
            <div className='navBarHead'>
              <h1>{props.bank_name} |</h1>
              <h2 style={{fontFamily: "'Roboto Mono', monospace"}}>{window.location.pathname === '/Dashboard'?' Dashboard': ''}</h2>
              <h2 style={{fontFamily: "'Roboto Mono', monospace"}}>{window.location.pathname === '/onlinePayment'?' Online Payments': ''}</h2>
              <h2 style={{fontFamily: "'Roboto Mono', monospace"}}>{window.location.pathname === '/Transactions'?' Transactions': ''}</h2>
            </div>
            <div className='buttonHomeDiv'>
              <Avatar className = 'avatar' sx={{"marginRight":"2vw",bgcolor: red[500] }} aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}>
                {name.slice(0,1)}
              </Avatar>

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
                sx={{"marginTop": "1vh"}}
              >
                <MenuItem onClick={clickedDash} value = "Dash">Dashboard</MenuItem>
                <MenuItem onClick={clickedOB} value = "transact"> Online Banking </MenuItem>
                <MenuItem onClick={clickedAcc} value = "acc">Transactions</MenuItem>
              </Menu>
                {/* <Badge badgeContent={4} color="success" sx = {{margin:"0 3vw 0 0"}}>
                  <MailIcon color="action" />
                </Badge> */}
              <button type="button" className="lineButton button btn btn-light btn-outline-dark" onClick={logOutClicked}>Log Out</button>
            </div>
        </div>
    </div>
  )
}
