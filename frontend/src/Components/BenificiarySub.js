import React from 'react'
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import { useEffect } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Button from '@mui/material/Button';


const cookie = new Cookies();


function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }
  
TablePaginationActions.propTypes = {
count: PropTypes.number.isRequired,
onPageChange: PropTypes.func.isRequired,
page: PropTypes.number.isRequired,
rowsPerPage: PropTypes.number.isRequired,
};


function Benificiary(props) {
    const [check,setCheck] = React.useState(false);
    useEffect(()=>{},[check]);
    const deleteClicked = () =>{
      axios.post(`${process.env.REACT_APP_SERVER_URL}/deleteBenificiary`,{acno:props.row.benificiaryACNo}).then((res)=>{
        if(props.change === true)
          props.setChange(false);
        else
          props.setChange(true);
        setCheck(false);
      })
    }

    const noClicked = () =>{
      setCheck(false);
    }

    const checkClicked = () =>{
      setCheck(true);
    }

    let myDate = (date) =>{
      // let month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const d = new Date(date);
      let da = d.getDate();
      let mon = d.getMonth()+1;
      let year = d.getFullYear();
      let res = da + '-' + mon + '-' + year;
      return res;
    }
    return (
       <> 
        <TableRow key={props.row.benificiaryACNo} >
            <TableCell component="th" scope="row">
                {props.row.nickName}
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
                {props.row.benificiaryACNo}
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
                {myDate(props.row.addDate)}
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
              <Button variant="outlined" color="error" onClick = {checkClicked}>
                Delete
              </Button>
            </TableCell>
        </TableRow>
        {check?<TableRow style = {{width:"99%",textAlign:"center"}}>
                <div style={{border:"2px solid grey",padding:"2vh 2vw",borderRadius:"5px"}}>
                <h3 style = {{margin:"1vh 2vw",fontFamily: "'Lato', sans-serif",textAlign:"center"}}>Confirmation</h3>
                <p>Do you really want to delete Beneficiary?</p>
                <Button variant="outlined" color="error" sx = {{"marginRight":"8px"}} onClick = {deleteClicked}>
                Yes
              </Button>
              <Button variant="outlined" color="success" onClick = {noClicked}>
                No
              </Button>
              </div>
                </TableRow>
                :
                <></>}
        </>
    )
}


export default function BenificiaryDetails() {
    const [rows,setRows] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [change,setChange] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    useEffect(() =>{
        const required = {
            tok:cookie.get('userAuthToken')
        };
        axios.post(`${process.env.REACT_APP_SERVER_URL}/getBenificiaryDetails`,required).then((res)=>{
            setRows(res.data.details);
        });
    },[rows,change])
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    return (
      <>
      <TableContainer component={Paper} >
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
            <TableRow>
                <TableCell style={{fontWeight:"bolder"}}>Benificiary Name</TableCell>
                <TableCell style={{ width: 160 ,fontWeight:"bolder"}} align="right">Account Number</TableCell>
                <TableCell style={{ width: 160 ,fontWeight:"bolder"}} align="right">Date Added</TableCell>
                <TableCell style={{ width: 160 ,fontWeight:"bolder",color:"red"}} align="right">Delete</TableCell>
            </TableRow>
        </TableHead>
          <TableBody>
            {rows.length !== 0?(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (<>
              <Benificiary row = {row} change = {change} setChange = {setChange}/>
              
                </>
              )):<p style={{padding:"2vh 2vw"}}>No Benificiary to display</p>}
  
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5,10 ,{ label: 'All', value: -1 }]}
                colSpan={4}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      </>
  );
}
