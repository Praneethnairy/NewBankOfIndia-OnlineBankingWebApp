import React from 'react';
import Passbook from './Passbook';
import PaymentNavbar from './PaymentNavbar'

export default function EPassbook() {
  return (
    <div>
        <PaymentNavbar bank_name = "New Bank Of India"/>
        <h3 style = {{margin:"1vh 2vw",fontFamily: "'Lato', sans-serif"}}>My ePassbook</h3>
        <div style={{padding:"3vh 2vw",height:"80vh"}}>
          <Passbook/>
        </div>
    </div>
  )
}
