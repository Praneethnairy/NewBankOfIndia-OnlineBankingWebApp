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
    
    return (
        
        <TableRow key={props.row.benificiaryACNo} >
            <TableCell component="th" scope="row">
                {props.row.Ben_Ac_no}
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
                {props.row.t_date.slice(0,10)}
            </TableCell>
            {props.row.T_type === "credit"?<TableCell style={{ width: 160,color:"green" }} align="right">Credit</TableCell>:<TableCell style={{ width: 160,color:"red" }} align="right">Debit</TableCell>}
            
            <TableCell style={{ width: 160 }} align="right">
                {props.row.amount} INR
            </TableCell>
            <TableCell style={{ width: 160 }} align="right">
                {props.row.BalancePerTransac} INR
            </TableCell>
        </TableRow>
    )
}


export default function Passbook() {
    const [rows,setRows] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    
    useEffect(() =>{
        const required = {
            tok:cookie.get('userAuthToken')
        };
        axios.post(`${process.env.REACT_APP_SERVER_URL}/getPassbook`,required).then((res)=>{
            setRows(res.data.details);
        });
    },[rows])
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
      <TableContainer component={Paper} >
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
            <TableRow>
                <TableCell style={{fontWeight:"bolder"}}>Account Number</TableCell>
                <TableCell style={{ width: 160 ,fontWeight:"bolder"}} align="right">Date of Transfer</TableCell>
                <TableCell style={{ width: 160 ,fontWeight:"bolder"}} align="right">Credit/Debit</TableCell>
                <TableCell style={{ width: 160 ,fontWeight:"bolder"}} align="right">Transfer Amount</TableCell>
                <TableCell style={{ width: 160 ,fontWeight:"bolder"}} align="right">Balance</TableCell>
            </TableRow>
        </TableHead>
          <TableBody>
            {rows.length !== 0?(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <Benificiary row = {row}/>
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
                colSpan={5}
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
  );
}
