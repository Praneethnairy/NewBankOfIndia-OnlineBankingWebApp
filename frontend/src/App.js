import './App.css';
import React from 'react';
import {io} from 'socket.io-client';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Components/Home';
import Dashboard from './Components/Dashboard';
import axios from 'axios';
import {useEffect,useState} from 'react';
import Cookies from 'universal-cookie';
import {Navigate} from 'react-router-dom';
import OnlinePayment from './Components/OnlinePayment';
import SendMoney from './Components/SendMoney';
import DirectPay from './Components/DirectPay';
import Benificiary from './Components/Benificiary';
import EPassbook from './Components/EPassbook';
import GatewaySendMoney from './Components/GatewaySendMoney';
import Transactions from './Components/Transactions';
const cookie = new Cookies();

const socket = io.connect('http://localhost:4451');
function App() {
  const [user,setUser] = useState();
  if(performance.navigation.type === performance.navigation.TYPE_RELOAD){
      let token = cookie.get('userAuthToken');
      socket.emit('reloaded',token);
  }
  useEffect(()=>{
    let token = cookie.get('userAuthToken');
    if(token !== undefined)
      axios.post(`${process.env.REACT_APP_SERVER_URL}/validToken`,{"token":token}).then((res)=>{
        setUser(res.data.user);
      }).catch((err)=>{
        cookie.remove('userAuthToken');
      })
      
  },[])

  function PrivateOutlet(props){
    return cookie.get('userAuthToken')?<props.Page user = {user} setUser = {setUser}/>:<Navigate to = {{'pathname':'/'}}/>;
  }

  function PublicOutlet(props){
    return cookie.get('userAuthToken')?<Navigate to = {{'pathname':'/Dashboard'}}/>:<props.Page socket = {socket} bank_name = 'New Bank Of India'/>;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path = "/" element = {<PublicOutlet Page = {Home}/>}/>
          <Route exact path = "/Dashboard" element = {<PrivateOutlet Page = {Dashboard}/>}/>
          <Route exact path = "/onlinePayment" element = {<PrivateOutlet Page = {OnlinePayment}/>}/>
          <Route exact path = "/Transactions" element = {<PrivateOutlet Page = {Transactions}/>}/>
          <Route exact path = "/onlinePayment/sendMoney" element = {<PrivateOutlet Page = {SendMoney}/>}/>
          <Route exact path = "/onlinePayment/directPay" element = {<PrivateOutlet Page = {DirectPay}/>}/>
          <Route exact path = "/onlinePayment/benificiary" element = {<PrivateOutlet Page = {Benificiary}/>}/>
          <Route exact path = "/onlinePayment/ePassbook" element = {<PrivateOutlet Page = {EPassbook}/>}/>
          <Route exact path = "/onlinePayment/paySendMoney" element = {<PrivateOutlet Page = {GatewaySendMoney}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
