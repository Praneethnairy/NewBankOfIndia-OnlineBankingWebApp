import React from 'react'
import Analytics from './Analytics';
// import Skeleton from '@mui/material/Skeleton';
import Navbar from './Navbar';
import { useEffect } from 'react';

export default function Dashboard() {
  useEffect(()=>{},[]);
  return (
    <div className='mainDashDiv'>
      <div className='navComponent'>
        <Navbar bank_name = "New Bank Of India"/>
      </div>
      {/* <div>
        <h2>Dashboard</h2>
      </div> */}
      <Analytics/>
    </div>
  )
}
