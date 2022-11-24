import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentNavbar(props) {
    const navigate = useNavigate()
    const BackClicked = () =>{
      if(window.location.pathname === '/onlinePaymentpaySendMoney')
        navigate('/onlinePayment/sendMoney');
      else
        navigate('/onlinePayment');
    }
  return (
    <div>
        <div className='navbarHomeDiv' >
            <div className='navBarHead'>
              <h1>{props.bank_name} |</h1>
              <h2 style={{fontFamily: "'Roboto Mono', monospace"}}>{window.location.pathname === '/onlinePayment/sendMoney'?' Send Money': ''}</h2>
              <h2 style={{fontFamily: "'Roboto Mono', monospace"}}>{window.location.pathname === '/onlinePayment/directPay'?' Direct Pay': ''}</h2>
              <h2 style={{fontFamily: "'Roboto Mono', monospace"}}>{window.location.pathname === '/onlinePayment/benificiary'?' My Benificiary': ''}</h2>
              <h2 style={{fontFamily: "'Roboto Mono', monospace"}}>{window.location.pathname === '/onlinePayment/ePassbook'?' ePassbook': ''}</h2>
              <h2 style={{fontFamily: "'Roboto Mono', monospace"}}>{window.location.pathname === '/onlinePayment/paySendMoney'?' Payment Gateway': ''}</h2>
            </div>
            <div className='buttonHomeDiv'>
              <button type="button" className="lineButton button btn btn-light btn-outline-dark" onClick={BackClicked}>Back</button>
            </div>
        </div>
    </div>
  )
}
