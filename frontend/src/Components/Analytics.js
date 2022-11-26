import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import { useState, useEffect } from 'react';
// import faker from 'faker';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
// import p from '@mui/material/p';
// import portfolio from '../Images/proftolio.jpg'
import piggy from '../Images/piggy-bank.png';
import deposit from '../Images/deposit.png';
import credit from '../Images/credit.png';
import loan from '../Images/loan.png';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { CircularProgressbar,buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
// import AnimatedProgressProvider from "./AnimatedProgressProvider.tsx";
import ProgressProvider from "./ProgressProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const cookie = new Cookies();
const token = cookie.get('userAuthToken');
export default function Analytics() {
  const [userDetails,setUserDetails] = useState({
    
  });
  const [graphLabel,setgraphLabel] = useState([]);
  const [graphCreditedData,setgraphCreditedData] = useState([]);
  const [graphDebitedData,setgraphDebitedData] = useState([]);
  const [Weekly,setWeekly] = useState(true);
  const [Monthly,setMonthly] = useState(false);
  const [Yearly,setYearly] = useState(false);
  const [loading,setLoading] = useState(true);
  // useEffect(()=>{},[])
  useEffect(()=>{
    
    const getData = {
      tok: token
    }
    axios.post(`${process.env.REACT_APP_SERVER_URL}/portfolio`,getData).then((res)=>{
      
      if(Weekly === true){
      
        const required = {
          tok : token,
          val : 'weekly'
        }
        axios.post(`${process.env.REACT_APP_SERVER_URL}/expenditureGraphcredit`,required).then((res)=>{
          // console.log(res.data.creditVal);
          setgraphLabel(['Sun','Mon','Tue','Wed','Thu','Fri','Sat']);
          setgraphCreditedData(res.data.creditVal);
        })
        axios.post(`${process.env.REACT_APP_SERVER_URL}/expenditureGraphdebit`,required).then((res)=>{
          // console.log(res.data.debitVal);
          setgraphDebitedData(res.data.debitVal);
        })
        console.log("Weekly clicked");
      }
      if(Monthly === true){
        const required = {
          tok : token,
          val : 'monthly'
        }
        axios.post(`${process.env.REACT_APP_SERVER_URL}/expenditureGraphcredit`,required).then((res)=>{
          // console.log(res.data.creditVal);
          setgraphLabel(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']);
          setgraphCreditedData(res.data.creditVal);
          // console.log(res.data.creditVal);
        })
        axios.post(`${process.env.REACT_APP_SERVER_URL}/expenditureGraphdebit`,required).then((res)=>{
          // console.log(res.data.debitVal);
          setgraphDebitedData(res.data.debitVal);
        })
        console.log("Monthly clicked");
      }
      if(Yearly === true){
        const required = {
          tok : token,
          val : 'yearly'
        }
        axios.post(`${process.env.REACT_APP_SERVER_URL}/expenditureGraphcredit`,required).then((res)=>{
          // console.log(res.data.creditVal);
          setgraphLabel(res.data.creditYear);
          setgraphCreditedData(res.data.creditVal);
        })
        axios.post(`${process.env.REACT_APP_SERVER_URL}/expenditureGraphdebit`,required).then((res)=>{
          // console.log(res.data.debitVal);
          setgraphDebitedData(res.data.debitVal);
        })
        console.log("Yearly clicked");
      }
      setUserDetails(res.data.portfolio);
      console.log(res.data.portfolio);
      setTimeout(()=>{
        setLoading(false);
      },3000)
    })
  },[loading,Weekly,Monthly,Yearly])

  const weeklyClicked = () =>{
    setWeekly(true);
    setMonthly(false);
    setYearly(false);
  };

  const monthlyClicked = () =>{
    setWeekly(false);
    setMonthly(true);
    setYearly(false);
  };

  const yearlyClicked = () =>{
    setWeekly(false);
    setMonthly(false);
    setYearly(true);
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: false,
        // text: 'Chart.js Line Chart - Multi Axis',
      },
      legend:{
        display:false
      },
      tooltips: {
        enabled: false
     }
    },
    scales: {
      y: {
        type: 'linear',
        display: false,
        position: 'left',
        grid:{
          display: false
        }
      },
      x: {
        grid:{
          display : false
        }
      }
    },
    animation: {
      x: {
        duration: 5000,
        from: 0
      },
      y: {
        duration: 3000,
        from: 500
      }
      
    }
    
  };
  
  const labels = graphLabel;
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Amount Credited (in Rupees)',
        data: graphCreditedData,
        backgroundColor: 'rgb(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 3,
        fill:true,
        // pointRadius: 5,
      },
      {
        label: 'Amount Debited (in Rupees)',
        data: graphDebitedData,
        backgroundColor: 'rgb(255, 99, 132, 0.5)',
        borderColor: 'orange',
        borderWidth: 3,
        fill:true,
        // pointRadius: 5,
      }
    ],
  };
  const chartconf =  {
    fill:true,
    backgroundColor: 'rgb(255, 99, 132, 0.5)',
  }
  

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
    <div>
    <div className='analytics'>
      <div style={{"textAlign":"center","height":"60vh","width":"50vw","margin":"4vh 1vw"}} >
          <Line options={options} data={data} chartconfig = {chartconf}/>
          <ButtonGroup style={{"margin":"2vh 0"}} color="secondary" aria-label="medium secondary button group">
          {Weekly === true?<Button variant="contained" color = "secondary" onClick = {weeklyClicked}>Weekly</Button>: <Button onClick = {weeklyClicked}>Weekly</Button>}
          {Monthly === true?<Button variant="contained" color = "secondary" onClick={monthlyClicked}>Monthly</Button>:<Button onClick={monthlyClicked}>Monthly</Button>}
          {Yearly === true ? <Button variant="contained" color = "secondary" onClick = {yearlyClicked}>Yearly</Button>:<Button onClick = {yearlyClicked}>Yearly</Button>}
          </ButtonGroup>
      </div>
      <div >
        <Box
        
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: "50vw",
            height: "50vh",
            padding: "2vh 2vw"
          },
        }}
      >
      <Paper className='paperDiv' elevation={6}>
        <div className='paperFlexDiv'>
          <div>
            <h4>My Portfolio</h4>
          </div>
          <div>
            <h4>New Bank Of India</h4>
          </div>
        </div>
        <div className='nameDiv'>
          <h3>{userDetails?userDetails.Fname:''}  {' '}  {userDetails?userDetails.Mname?userDetails.Mname:'':''} {' '} {userDetails?userDetails.Lname?userDetails.Lname:'':''}</h3>
        </div>
        <div className='nameDiv'>
          <h6>Ac No : {userDetails?userDetails.accountNo:''}</h6>
          <h6>ISFC : {userDetails?userDetails.ISFC_code:''}</h6>
        </div>

        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 18 }} sx = {{margin:"3vh 0 0 7vw"}}>
          <Grid item xs={6}>
          <div className = 'detailsFlex'>
              
              <img src={piggy} alt="piggy" height="40px"/>
              <div className='verticalBar'></div>
              <div className='amountFlexDiv'>
                <h5 style={{fontSize : "30px",color:"white"}}>&#8377; {userDetails?userDetails.balance?userDetails.balance:'0':'0'}</h5>
                <p style={{color:"white"}}>(Savings)</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
          <div className = 'detailsFlex'>
              <img src={deposit} alt="deposit" height="40px"/>
              <div className='verticalBar'></div>
              <div className='amountFlexDiv'>
                <h5 style={{fontSize : "30px",color:"white"}}>&#8377; {userDetails?userDetails.fd_amt?userDetails.fd_amt:'0':'0'}</h5>
                <p style={{color:"white"}}>(Deposit)</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
          <div className = 'detailsFlex'>
              <img src={credit} alt="credit" height="40px"/>
              <div className='verticalBar'></div>
              <div className='amountFlexDiv'>
                <h5 style={{fontSize : "30px",color:"white"}}>{userDetails?userDetails.credit_score?userDetails.credit_score:'0':'0'}</h5>
                <p style={{color:"white"}}>(Credit Score)</p>
              </div>
            </div>
          </Grid>
          <Grid item xs={6}>
          <div className = 'detailsFlex'>
              <img src={loan} alt="loan" height="40px"/>
              <div className='verticalBar'></div>
              <div className='amountFlexDiv'>
                <h5 style={{fontSize : "30px",color:"white"}}>&#8377; {userDetails?userDetails.loan_amt?userDetails.loan_amt:'0':'0'}</h5>
                <p style={{color:"white"}}>(Loan)</p>
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Box>
      </div>
    </div>
    <div style = {{display:"flex",justifyContent:"center",margin:"10vh 2vw"}}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          '& > :not(style)': {
            m: 1,
            width: 300,
            height: 310,
          },
        }}
      >
        <Paper elevation={9} sx= {{display:"flex",justifyContent:"center",alignItems:"center",background:'black'}}>
        <div style={{ width: 200, height: 200 }}>
        <ProgressProvider
          valueStart={0}
          valueEnd={userDetails?userDetails.debit_transac:0}
          duration = {1.5}
        >
          {value => {/* let roundedValue = Math.round(value);*/ 
          return (
                    <CircularProgressbar value={value} minValue={0} maxValue={userDetails?userDetails.debit_transac:0} text={`${value}`} styles={buildStyles({
                      pathColor: `red`,
                      textColor: 'red',
                      // pathTransition: "none"
                      // transition: 'stroke-dashoffset 0.5s ease 0s'
                      // trailColor: '#d6d6d6',
                      // backgroundColor: '#3e98c7',
                    })} />
                  )}}
        </ProgressProvider>
        {/* <ProgressBar width="230" trackWidth="13" percentage={60} /> */}
        <div style = {{textAlign:"center",margin:"2vh 0",color:'white',fontFamily: "'Roboto Condensed', sans-serif"}}><h5>Debit Transactions</h5></div>
        </div>
        </Paper>
        <Paper elevation={9} sx= {{display:"flex",justifyContent:"center",alignItems:"center",background:'black'}}>
        <div style={{ width: 200, height: 200 }}>
        <ProgressProvider
          valueStart={0}
          valueEnd={userDetails?userDetails.transac_cnt:0}
          duration = {1.5}
        >
          {value => {/* let roundedValue = Math.round(value);*/ 
          return (
                    <CircularProgressbar value={value} minValue={0} maxValue={userDetails?userDetails.transac_cnt:0} text={`${value}`} styles={buildStyles({
                      pathColor: `#f7ac34`,
                      textColor: '#f7ac34'
                      // pathTransition: "none"
                      // transition: 'stroke-dashoffset 0.5s ease 0s'
                      // trailColor: '#d6d6d6',
                      // backgroundColor: '#3e98c7',
                    })} />
                  )}}
        </ProgressProvider>
        {/* <ProgressBar width="230" trackWidth="13" percentage={60} /> */}
        <div style = {{textAlign:"center",margin:"2vh 0",color:'white',fontFamily: "'Roboto Condensed', sans-serif"}}><h5>Total Transactions</h5></div>
        </div>
        </Paper>
        <Paper elevation={9} sx= {{display:"flex",justifyContent:"center",alignItems:"center",background:'black'}}>
        <div style={{ width: 200, height: 200 }}>
        <ProgressProvider
          valueStart={0}
          valueEnd={userDetails?userDetails.credit_transac:0}
          duration = {1.5}
        >
          {value => {/* let roundedValue = Math.round(value);*/ 
          return (
                    <CircularProgressbar value={value} minValue={0} maxValue={userDetails?userDetails.credit_transac:0} text={`${value}`} styles={buildStyles({
                      pathColor: `green`,
                      textColor: 'green',
                      // pathTransition: "none"
                      // transition: 'stroke-dashoffset 0.5s ease 0s'
                      // trailColor: '#d6d6d6',
                      // backgroundColor: '#3e98c7',
                    })} />
                  )}}
        </ProgressProvider>
        {/* <ProgressBar width="230" trackWidth="13" percentage={60} /> */}
        <div style = {{textAlign:"center",margin:"2vh 0",color:'white',fontFamily: "'Roboto Condensed', sans-serif"}}><h5>Credit Transactions</h5></div>
        </div>
        </Paper>
      </Box>
    </div>
    </div>}
  </>
  )
}
