import React from 'react'
import Navbar from './Navbar'
import { useState,useEffect } from 'react'
import axios from 'axios';
import Cookie from 'universal-cookie';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

const cookie = new Cookie();

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

export default function Transactions() {
  const [transacData,setTransacData] = useState([]);
  const [checkEmpty,setCheckEmpty] = useState(false);
  const [switchCheck,setSwitchCheck] = useState(false);
  const [debit,setDebit] = useState([]);
  const [credit,setCredit] = useState([]);

  useEffect(()=>{
    if(switchCheck === false){
      axios.post(`${process.env.REACT_APP_SERVER_URL}/TransactionDetails`,{tok:cookie.get('userAuthToken')}).then((res)=>{
        if(res.data.details.length === 0){
          setCheckEmpty(true);
        }
        else{
          setTransacData(res.data.details);
          setCheckEmpty(false);
        }
      })
    }
    else{
      axios.post(`${process.env.REACT_APP_SERVER_URL}/TransactionDetailsSplit`,{tok:cookie.get('userAuthToken')}).then((res)=>{
        setCredit(res.data.credit);
        setDebit(res.data.debit);
      })
    }
  },[transacData,checkEmpty,switchCheck])

  const changeSwitch = (e) =>{
    e.preventDefault();
    setSwitchCheck(e.target.checked);
  }

  let myDate = (date) =>{
    // let month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date(date);
    let da = d.getDate();
    let mon = d.getMonth()+1;
    let year = d.getFullYear();
    let res = da + '-' + mon + '-' + year;
    return res;
  }
  return (
    <div>
        <Navbar bank_name = "New Bank Of India"/>
        <div style={{display:"flex",justifyContent:"space-between"}}>
        <h3 style = {{margin:"1vh 2vw",fontFamily: "'Lato', sans-serif"}}>My Transactions</h3>
        <Stack direction="row" spacing={1} alignItems="center" sx = {{margin:"0 2vw"}}>
          <Typography sx = {{fontFamily: "'Lato', sans-serif"}}>Combined</Typography>
          <IOSSwitch checked = {switchCheck} sx={{ m: 1 }} onChange = {changeSwitch} inputProps={{ 'aria-label': 'controlled' }}/>
          <Typography sx = {{fontFamily: "'Lato', sans-serif"}}>Separate</Typography>
        </Stack>
        </div>
        {switchCheck === true?
        <div style={{padding:"3vh 2vw",fontFamily: "'Lato', sans-serif"}}>
          <h5 style = {{margin:"1vh 1vw",fontFamily: "'Lato', sans-serif"}}>Credits</h5>
          <table className="table">
            <thead className='table-dark'>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Money Sent To</th>
                <th scope="col">On</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {credit.map((transac,id)=>{
                return (
                  
                  <tr key = {id} className = 'table-success'>
                    <th scope="row">{id+1}</th>
                    <td><b>{transac.Fname} {transac.Mname?transac.Mname:''} {transac.Lname?transac.Lname:''}</b></td>
                    <td>{myDate(transac.t_date)}</td>
                    <td>INR {transac.amount} </td>
                  </tr>
                )
              })}
              
              
            </tbody>
          </table>
          <h5 style = {{margin:"1vh 1vw",fontFamily: "'Lato', sans-serif"}}>Debits</h5>
          <table className="table">
            <thead className='table-dark'>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Money Sent To</th>
                <th scope="col">On</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {debit.map((transac,id)=>{
                return (
                  
                  <tr key = {id} className = 'table-danger'>
                    <th scope="row">{id+1}</th>
                    <td><b>{transac.Fname} {transac.Mname?transac.Mname:''} {transac.Lname?transac.Lname:''}</b></td>
                    <td>{myDate(transac.t_date)}</td>
                    <td>INR {transac.amount} </td>
                  </tr>
                  
                )
              })}
              
              
            </tbody>
          </table>
        </div>
        
        :
        
        <div style={{padding:"3vh 2vw",height:"80vh",fontFamily: "'Lato', sans-serif"}}>
          <table className="table">
            <thead className='table-dark'>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Money Sent To</th>
                <th scope="col">On</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transacData.map((transac,id)=>{
                return (
                  transac.T_type === "debit"?
                  <tr key = {id} className = 'table-danger'>
                    <th scope="row">{id+1}</th>
                    <td><b>{transac.Fname} {transac.Mname?transac.Mname:''} {transac.Lname?transac.Lname:''}</b></td>
                    <td>{myDate(transac.t_date)}</td>
                    <td>INR {transac.amount} </td>
                  </tr>
                  :
                  <tr key = {id} className = 'table-success'>
                    <th scope="row">{id+1}</th>
                    <td><b>{transac.Fname} {transac.Mname?transac.Mname:''} {transac.Lname?transac.Lname:''}</b></td>
                    <td>{myDate(transac.t_date)}</td>
                    <td>INR {transac.amount} </td>
                  </tr>
                )
              })}
              
              
            </tbody>
          </table>
        </div>}
    </div>
  )
}
