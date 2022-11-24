import React from 'react'
import Navbar from './Navbar'
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import sendMoney from '../Images/transfer-money.png';
// import directPay from '../Images/direct-money.png';
import benificiary from '../Images/benificiary.png';
import passbook from '../Images/passbook.png';
import { useNavigate } from 'react-router-dom';

export default function OnlinePayment() {
  const [ele1,setEle1] = useState(3)
  // const [ele2,setEle2] = useState(3)
  const [ele3,setEle3] = useState(3)
  const [ele4,setEle4] = useState(3)
  const navigate = useNavigate()

  const sendMoneyFunc = () =>{
    navigate('/onlinePayment/sendMoney')
  }

  // const directPayFunc = () =>{
  //   navigate('/onlinePayment/directPay')
  // }

  const benificiaryFunc = () =>{
    navigate('/onlinePayment/benificiary')
  }

  const passbookFunc = () =>{
    navigate('/onlinePayment/ePassbook')
  }

  return (
    <div>
      <Navbar bank_name = "New Bank Of India"/>
      <div className='paymentTypeBox'>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            '& > :not(style)': {
              m: 1,
              width: 300,
              height: 300,
            },
          }}
        >
          <Paper elevation={ele1} onClick = {sendMoneyFunc} onMouseEnter = {()=>setEle1(9)} onMouseLeave = {()=>setEle1(3)} sx = {{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <div style={{margin:"2vh 2vw",textAlign:"center"}}>
              <div>
                <img src={sendMoney} alt="Send Money" height={150} style = {{margin:"0 0 2vh 0"}}/>
              </div>
              <h3 className = "paymentHeading">Send Money</h3>
            </div>
          </Paper>
          {/* <Paper elevation={ele2} onClick={directPayFunc} onMouseEnter = {()=>setEle2(9)} onMouseLeave = {()=>setEle2(3)} sx = {{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <div style={{margin:"2vh 2vw",textAlign:"center"}}>
              <div>
                <img src={directPay} alt="Send Money" height={150} style = {{margin:"0 0 2vh 0"}}/>
              </div>
              <h3 className = "paymentHeading">Direct Pay</h3>
            </div>
          </Paper> */}
          <Paper elevation={ele3} onClick = {benificiaryFunc} onMouseEnter = {()=>setEle3(9)} onMouseLeave = {()=>setEle3(3)} sx = {{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <div style={{margin:"2vh 2vw",textAlign:"center"}}>
              <div>
                <img src={benificiary} alt="Send Money" height={150} style = {{margin:"0 0 2vh 0"}}/>
              </div>
              <h3 className = "paymentHeading">My Benificiary</h3>
            </div>
          </Paper>
          <Paper elevation={ele4} onClick = {passbookFunc} onMouseEnter = {()=>setEle4(9)} onMouseLeave = {()=>setEle4(3)} sx = {{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <div style={{margin:"2vh 2vw",textAlign:"center"}}>
              <div>
                <img src={passbook} alt="Send Money" height={150} style = {{margin:"0 0 2vh 0"}}/>
              </div>
              <h3 className = "paymentHeading">ePassbook</h3>
            </div>
          </Paper>
        </Box>
      </div>
    </div>
  )
}
