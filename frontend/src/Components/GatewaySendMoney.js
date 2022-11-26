import React from 'react'
import PaymentNavbar from './PaymentNavbar'
import TextField from '@mui/material/TextField';
import Cookies from 'universal-cookie';
import { useState,useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Reciept from './Reciept';
import PaymentDialog from './PaymentDialog';
const cookie = new Cookies();


export default function GatewaySendMoney() {
    const [checkACNO,setCheckACNO] = useState(false);
    const [checkAmt,setCheckAmt] = useState(false);
    const [accountNo,setAccountNo] = useState('');
    const [proceeded,setProceeded] = useState(false);
    const [state,setState] = useState('');
    const [amountToBePaid,setAmountToBePaid] = useState('');
    const [pincheck,setPincheck] = useState(false);
    const [moneySentStatus,setMoneySentStatus] = useState(false);
    const [open,setOpen] = useState(false);
    const benificiaryACNo = localStorage.getItem('acNo');
    const benificiaryName = localStorage.getItem('name');
    useEffect(() =>{
      if(checkACNO === false){
        axios.post(`${process.env.REACT_APP_SERVER_URL}/fetchACNo`,{tok:cookie.get('userAuthToken')}).then((res)=>{
          setAccountNo(res.data.account);
          setCheckACNO(true);
        })
      }
      setTimeout(()=>{
        setCheckAmt(false);
      },5000)
      setTimeout(()=>{
        setPincheck(false);
      },5000)
    },[accountNo,checkAmt,proceeded,pincheck,moneySentStatus])

    const proceedClicked = (e) =>{
      e.preventDefault();
      if(e.target.amount.value <500){
        setCheckAmt(true);
      }
      else{
        setAmountToBePaid(e.target.amount.value);
        setProceeded(true);
      }

    }

    const PayClicked = (e) =>{
      e.preventDefault();
      setOpen(true);
      axios.post(`${process.env.REACT_APP_SERVER_URL}/fetchPIN`,{acno:accountNo}).then((res)=>{
        if(e.target.pin.value === res.data.pin){
          axios.post(`${process.env.REACT_APP_SERVER_URL}/transactionUpdate`,{acno:accountNo,bacno:benificiaryACNo,amount:parseInt(amountToBePaid)}).then((res)=>{
            console.log(res.data.message);
            setTimeout(()=>{
              setMoneySentStatus(true);
              setOpen(false);
            },3000);
          })
        }
        else{
          setPincheck(true);
        }
      })
    };

    const BackClicked = () =>{
      setProceeded(false);
    };

    const PINChange = (e) =>{
      setState(e.target.value.slice(0,4));
      
    };

  return (
    <div>
        <PaymentNavbar bank_name = "New Bank Of India"/>
        {moneySentStatus === true? 
        <div>
          <Reciept acno = {accountNo} bacno = {benificiaryACNo} amount = {amountToBePaid}/>
        </div>:proceeded === true ? <div>
          <h3 style = {{margin:"1vh 2vw",fontFamily: "'Lato', sans-serif",textAlign:"center"}}>Enter PIN</h3>
          <div style={{textAlign:"center",margin:"3vh 30vw"}} className="gatewayDiv">
          <form onSubmit={PayClicked}>
            <TextField label="Enter PIN" variant="filled" name = "pin" color="success"  value = {state} sx = {{margin:"0 0 4vh 0" ,width:"25vw"}} onChange = {PINChange}/><br/>
            <Button variant="contained" onClick={BackClicked} sx= {{margin:"0 2vw"}}>Back</Button>
            <Button variant="contained" color="success" type = "submit">Pay</Button>
          </form>
        </div>
        <PaymentDialog open = {open}/>
        </div>
        :
        <div>
        <h3 style = {{margin:"1vh 2vw",fontFamily: "'Lato', sans-serif",textAlign:"center"}}>Enter the details</h3>
        <div style={{textAlign:"center",margin:"3vh 30vw"}} className="gatewayDiv">
            <form onSubmit={proceedClicked}>
            <TextField id="standard-basic" label="Benificiary Account Number" variant="standard" value = {benificiaryACNo} required sx = {{margin:"0 0 4vh 0" ,width:"25vw"}}/> <br/>
            <TextField id="standard-basic" label="Account Number" variant="standard" value = {accountNo} required sx = {{margin:"0 0 4vh 0",width:"25vw"}}/><br/>
            <TextField id="standard-basic" label="Benificiary Name" variant="standard" value = {benificiaryName} required sx = {{margin:"0 0 4vh 0",width:"25vw"}}/><br/>
            <TextField id="standard-basic" name = "amount" type="number" label="Amount" variant="standard" required sx = {{margin:"0 0 4vh 0",width:"25vw"}}/><br/>
            <Button variant="contained" sx = {{margin:"4vh 0 2vh 0"}} type = "submit">Proceed to Pay</Button>
            </form>
          </div>
          </div>}
        {pincheck === true ? <Alert severity="error" sx={{width:"30vw",borderRadius:"10px",margin:"2vh 2vw",position:"absolute",bottom:0,left:0}}>You have Entered Wrong PIN!!</Alert>:<></>}
        {checkAmt === true ? <Alert severity="error" sx={{width:"30vw",borderRadius:"10px",margin:"2vh 2vw",position:"absolute",bottom:0,left:0}}>Entered Amount should be greater than 500!!</Alert>:<></>}
    </div>
  )
}
