import React from 'react'
import approved from '../Images/approval.gif';

export default function Reciept(props) {
  return (
    <div>
        <h3 style = {{margin:"1vh 2vw",fontFamily: "'Lato', sans-serif",textAlign:"center"}}>Transaction Details</h3>
        <div style={{margin:"3vh 23vw",display:"flex",justifyContent:"center",alignItems:"center", backgroundColor:"white"}} className="gatewayDiv">
            <div style={{margin : "0 7vw 0 0"}}>
                <div><h6 style={{display:"inline-block"}}>Account Number</h6> <p style={{display:"inline-block"}}>: {props.acno}</p></div>
                <div><h6 style={{display:"inline-block"}}>Reciepient Account Number</h6> <p style={{display:"inline-block"}}>: {props.bacno}</p></div>
                <div><h6 style={{display:"inline-block"}}>Amount Paid</h6> <p style={{display:"inline-block"}}>: {props.amount}</p></div>
                <div><h6 style={{display:"inline-block"}}>Status</h6> <p style={{display:"inline-block"}}>: <b style={{color:"green"}}>Success</b></p></div>
            </div>
            <div style={{borderLeft:"2px",borderRight:"0",borderTop:"0",borderBottom:"0",borderColor:"black",borderStyle:"solid",height:"20vh",width:0,margin:"0 5vw 0 0"}}></div>
            <div><img src={approved} alt="Paid" /></div>
        </div>
    </div>
  )
}
