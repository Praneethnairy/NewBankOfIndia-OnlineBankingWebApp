import React from 'react';
import PaymentNavbar from './PaymentNavbar';
import BenificiarySub from './BenificiarySub';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { useState,useEffect } from 'react';
const cookie = new Cookies();

export default function Benificiary() {
  const [uAccountNo,setUAccountNo] = useState('');
  const [ISFC_code,setISFC_code] = useState([]);
  const [addBenificiary, setAddBenificiary] = useState(false);
  const [benificiaryACNo,setBenificiaryACNo] = useState('');
  const [errorState,setErrorState] = useState(false);
  const [Name,setName] = useState('');
  const [enteredISFC,setEnteredISFC] = useState('');
  const [verified,setVerified] = useState(false);
  const [sameBenificiary,setSameBenificiary] = useState(false);
  const [benAlreadyExist,setBenAlreadyExist] = useState(false);
  const [activateButton,setActivateButton] = useState(false);
  useEffect(()=>{
    if(uAccountNo===''){
      axios.post(`${process.env.REACT_APP_SERVER_URL}/fetchACNo`,{tok:cookie.get('userAuthToken')}).then((res)=>{
        setUAccountNo(res.data.account);
      })
      axios.get(`${process.env.REACT_APP_SERVER_URL}/fetchISFC`).then((res)=>{
        setISFC_code(res.data.ISFC);
      });
    }
    setTimeout(()=>{
      setErrorState(false);
    },5000);
    setTimeout(()=>{
      setVerified(false);
    },7000);
    setTimeout(()=>{
      setSameBenificiary(false);
    },5000);
    setTimeout(()=>{
      setBenAlreadyExist(false);
    },5000);
  },[errorState,verified,sameBenificiary,benAlreadyExist,activateButton,addBenificiary])

  const verifyClicked = () =>{
    if(benificiaryACNo === uAccountNo){
      setSameBenificiary(true);
    }
    else{
      axios.post(`${process.env.REACT_APP_SERVER_URL}/checkAlreadyExist`,{acno:uAccountNo,bacno:benificiaryACNo,isfc:enteredISFC}).then((res)=>{
        if(res.data.count === 0){
          axios.post(`${process.env.REACT_APP_SERVER_URL}/fetchAcHolderName`,{acno:benificiaryACNo,isfc:enteredISFC}).then((res)=>{
            if(res.data.details.length === 0){
              setErrorState(true);
            }
            else{
              var name = ''
              if(res.data.details[0].Fname)
                name = name + res.data.details[0].Fname
              if(res.data.details[0].Mname)
                name = name + ' ' + res.data.details[0].Mname;
              if(res.data.details[0].Lname)
                name = name + ' ' + res.data.details[0].Lname;
              setName(name);
              setVerified(true);
              setActivateButton(true);
            }
          })
        }
        else{
          setBenAlreadyExist(true);
        }
      })
    }
  }
  const addBenClicked = () =>{
    if(addBenificiary === false)
      setAddBenificiary(true);
    else
      setAddBenificiary(false);
  }
  const changeBenCalled = (e) =>{
    e.preventDefault();
    // console.log(e.target.value)
    setBenificiaryACNo(e.target.value);
  }
  const ISFCChanged = (e,value) =>{
    e.preventDefault();
    // console.log(value);
    setEnteredISFC(value.label);
  };

  const formSubmitted = (e) =>{
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_SERVER_URL}/addBenificiary`,{acno:uAccountNo,bacno:benificiaryACNo,isfc:enteredISFC,name:e.target.name.value}).then((res)=>{
      setAddBenificiary(false);
    })
  };

  return (
    <div>
        <PaymentNavbar bank_name = "New Bank Of India"/>
        {addBenificiary === true?<div>
          <h3 style = {{margin:"1vh 2vw",fontFamily: "'Lato', sans-serif",textAlign:"center"}}>Add Benificiary</h3>
          <div style={{margin:"3vh 23vw",display:"flex",justifyContent:"center",alignItems:"center", backgroundColor:"white"}} className="gatewayDiv">
            <form onSubmit={formSubmitted}>
              <TextField id="outlined-basic" label="Benificiary Account Number" variant="outlined" sx={{width:"31vw" ,margin:"0 0 3vh 0"}} value = {benificiaryACNo} onChange = {changeBenCalled}/><br/>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={ISFC_code}
                onChange={ISFCChanged}
                sx={{ width:"31vw" }}
                renderInput={(params) => <TextField {...params} label="ISFC Code" />}
              /><br/>
              <TextField id="outlined-basic" label="Nick Name" name = "name" variant="outlined" sx={{width:"31vw" ,margin:"0 0 3vh 0"}}/><br/>
              <Button variant="contained" sx = {{margin:"0 2vw 0 0",padding:"10px 20px"}} onClick = {addBenClicked}>Back</Button>
              <Button variant="contained" sx = {{margin:"0 2vw 0 0",padding:"10px 20px"}} onClick = {verifyClicked}>Verify Benificiary</Button>
              {activateButton === true?
              <Button variant="contained" color="success" sx = {{padding:"10px 20px"}} type = "submit">
                Add Benificiary
              </Button>
              :
              <Button variant="contained" color="success" sx = {{padding:"10px 20px"}} type = "submit" disabled>
                Add Benificiary
              </Button>
              }
            </form>
          </div>
        </div>
        :
        <div>
          <h3 style = {{margin:"1vh 2vw",fontFamily: "'Lato', sans-serif"}}>Manage Benificiaries</h3>
          <div style={{padding:"3vh 2vw",height:"80vh"}}>
            <BenificiarySub />
          </div>
          <div style={{position:"fixed",bottom:0,width:"100vw",textAlign:"center",padding:"4vh 0"}}>
            <Button variant="contained" sx = {{padding:"2vh 4vw"}} onClick={addBenClicked}>Add Benificiary</Button>
          </div>
        </div>}
        {errorState === true ? <Alert severity="error" sx={{width:"30vw",borderRadius:"10px",margin:"2vh 2vw",position:"absolute",bottom:0,left:0}}>You have Entered Benificiary Details Wrong !!</Alert>:<></>}
        {verified === true ? <Alert severity="success" sx={{width:"30vw",borderRadius:"10px",margin:"2vh 2vw",position:"absolute",bottom:0,left:0}}>Your Benificiary's Banking Name is {Name}.</Alert>:<></>}
        {sameBenificiary === true ? <Alert severity="error" sx={{width:"30vw",borderRadius:"10px",margin:"2vh 2vw",position:"absolute",bottom:0,left:0}}>You can't add yourself as Benificiary !!</Alert>:<></>}
        {benAlreadyExist === true ? <Alert severity="error" sx={{width:"30vw",borderRadius:"10px",margin:"2vh 2vw",position:"absolute",bottom:0,left:0}}>Benificiary Already Exist !!</Alert>:<></>}
    </div>
  )
}
