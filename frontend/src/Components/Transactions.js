import React from 'react'
import Navbar from './Navbar'
import { useState,useEffect } from 'react'
import axios from 'axios';
import Cookie from 'universal-cookie';

const cookie = new Cookie();

export default function Transactions() {
  const [transacData,setTransacData] = useState([]);
  const [checkEmpty,setCheckEmpty] = useState(false);
  useEffect(()=>{
    axios.post(`${process.env.REACT_APP_SERVER_URL}/TransactionDetails`,{tok:cookie.get('userAuthToken')}).then((res)=>{
      if(res.data.details.length === 0){
        setCheckEmpty(true);
      }
      else{
        setTransacData(res.data.details);
        setCheckEmpty(false);
      }
    })
  },[transacData,checkEmpty])

  return (
    <div>
        <Navbar bank_name = "New Bank Of India"/>
        <h3 style = {{margin:"1vh 2vw",fontFamily: "'Lato', sans-serif"}}>My Transactions</h3>
        <div style={{padding:"3vh 2vw",height:"80vh"}}>
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
                    <td>{transac.t_date.slice(0,10)}</td>
                    <td>{transac.amount}</td>
                  </tr>
                  :
                  <tr key = {id} className = 'table-success'>
                    <th scope="row">{id+1}</th>
                    <td><b>{transac.Fname} {transac.Mname?transac.Mname:''} {transac.Lname?transac.Lname:''}</b></td>
                    <td>{transac.t_date.slice(0,10)}</td>
                    <td>{transac.amount}</td>
                  </tr>
                )
              })}
              
              
            </tbody>
          </table>
        </div>
    </div>
  )
}
