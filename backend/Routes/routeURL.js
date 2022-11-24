const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const {createServer} = require('http')
const {Server} = require('socket.io');


function generateAccessToken(username){
    return jwt.sign(username,process.env.TOKEN_SECRET); //If time constraint should be added - {expiresIn - 1600s}
    
}

const connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '9880055926',
    database : 'newBankOfIndia'
})
connection.connect((err)=>{
    if (err) throw err;
    else
    console.log('Connected to database');
})
const httpServer = createServer();
const io = new Server(httpServer,{
    cors:{
        origin:"http://localhost:3000",
        methods:["GET","POST"]
    }
});

io.on('connection', (socket) => {
    console.log(`a user connected : ${socket.id}`);
    socket.on('reloaded',(data)=>{
        connection.query(`update user_sessions set socket_id = '${socket.id}' where uToken = '${data}';`)
        // console.log('Success')
    })
    socket.on('disconnect', ()=>{
        socket.leave(socket.room)
    })
});

httpServer.listen(4451,()=>{
    console.log('listening on port 4451');
})

router.post('/signIn',(req,res)=>{
    connection.query(`select u_id from user_credentials where uName = '${req.body.uName}' and password = '${req.body.passwd}';`,(err,result)=>{
        if(err) throw err;
        // console.log(result);
        if(result.length === 0){
            res.status(500);
        }
        else{
            const token = generateAccessToken(result[0].u_id);
            connection.query(`insert into user_sessions values('${token}',${result[0].u_id},'${req.body.socket_id}');`)
            res.status(200).json({"authTok":token});
        }
    })
})

router.post('/validToken',(req,res)=>{
    connection.query(`select * from user_sessions where uToken = '${req.body.token}';`,(err,result)=>{
        if(err) throw err;
        if(result.length === 0){
            res.status(500);
        }
        else{
            let userInfo = connection.query(`select * from user_credentials where u_id in (select u_id from user_sessions where uToken = '${req.body.token}');`);
            res.status(200).json({"user":userInfo[0]});
        }
    })
})

router.post('/registerUser',(req,res)=>{
    connection.query(`select * from user_credentials where uName = '${req.body.uName}' and accountNumber not in (select accountNo from account_details where accountNo = '${req.body.acno}' and email = '${req.body.email}');`,(err,result)=>{
        if(err) throw err;
        if(result.length === 0){
            connection.query(`insert into user_credentials(uName, Password,accountNumber) values('${req.body.uName}','${req.body.uPass}', '${req.body.acno}')`,(err1,result1)=>{
                if(err1) res.status(200).json({"flag":false,"msg":"Invalid account number"});
                else
                    res.status(200).json({"flag":true});
            });
        }
        else{
            res.status(200).json({"flag":false,"msg":"Invalid user credentials"});
        }
    })
})

router.post('/expenditureGraphcredit',(req,res)=>{
    connection.query(`select accountNumber from user_credentials where u_id in (select u_id from user_sessions where uToken = '${req.body.tok}')`,async (err,result)=>{
        // let j = 0;
        if(result.length === 0){
            res.status(404);
        }
        else{
            if(req.body.val === 'weekly'){
                let creditWeek = [];
                let creditVal = [];
                let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                connection.query(`select dayname(t_date) as day,sum(amount) as amount from transaction_details where ac_no = '${result[0].accountNumber}' and week(t_date) = week(now()) and T_type = 'credit' group by dayname(t_date);`,(err1,res1)=>{
                    if(err1) throw err1;
                    for(let j = 0;j<7;++j){
                        let flag = false;
                        for(let i = 0;i<res1.length && !flag;++i){
                            if(week[j] == res1[i].day){
                                creditWeek.push(res1[i].day);
                                creditVal.push(res1[i].amount);
                                flag = true;
                            }
                            
                            // console.log(creditVal[i]);
                        }
                        if(flag === false){
                            creditWeek.push(week[j]);
                            creditVal.push(0);
                        }
                    }
                    
                    // console.log(j)
                    // console.log(creditVal)
                    res.status(200).json({"message":"OK",creditWeek:creditWeek,creditVal:creditVal});
                });
            }
            if(req.body.val === 'monthly'){
                let creditMonth = [];
                let creditVal = [];
                let month = ["January","February","March","April","May","June","July","August","September","November","December"];
                connection.query(`select monthname(t_date) as month,sum(amount) as amount from transaction_details where ac_no = '${result[0].accountNumber}' and year(t_date) = year(now()) and T_type = 'credit' group by monthname(t_date);`,(err1,res1)=>{
                    if(err1) throw err1;
                    
                    for(let j = 0;j<=11;++j){
                        let flag = false;
                        for(let i = 0;i<res1.length && !flag;++i){

                            if(month[j] == res1[i].month){
                                creditMonth.push(res1[i].month);
                                creditVal.push(res1[i].amount);
                                flag = true;
                            }
                            
                            
                            // console.log(creditVal[i]);
                        }
                        if(flag === false){
                            creditMonth.push(month[j]);
                            creditVal.push(0);
                        }
                    }
                    
                    // console.log(j)
                    // console.log(creditVal)
                    res.status(200).json({"message":"OK",creditMonth:creditMonth,creditVal:creditVal});
                });
            }
            if(req.body.val === 'yearly'){
                let creditYear = [];
                let creditVal = [];
                var d = new Date();
                let year = d.getFullYear();
                // console.log(year)
                connection.query(`select year(t_date) as year,sum(amount) as amount from transaction_details where ac_no = '${result[0].accountNumber}' and T_type = 'credit' group by year(t_date) order by year(t_date) desc limit 10;`,(err1,res1)=>{
                    if(err1) throw err1;
                    for(let i = year-10;i<=year;++i){
                        let flag = false;
                        // console.log(res1[0]);
                        for(let j = res1.length-1;j>=0 && !flag;--j){
                            if(i === parseInt(res1[j].year)){
                                creditYear.push(res1[j].year);
                                creditVal.push(res1[j].amount);
                                flag = true;
                            }
                            
                    //         // console.log(creditVal[i]);
                        }
                        if(flag === false){
                            creditYear.push(i);
                            creditVal.push(0);
                        }
                    }
                    
                    res.status(200).json({"message":"OK",creditYear:creditYear,creditVal:creditVal});
                });
            }
        }
    })
})

router.post('/expenditureGraphdebit',(req,res)=>{
    connection.query(`select accountNumber from user_credentials where u_id in (select u_id from user_sessions where uToken = '${req.body.tok}')`,async (err,result)=>{
        // let j = 0;
        if(result.length === 0){
            res.status(404);
        }
        else{
            if(req.body.val === 'weekly'){
                let debitVal = [];
                let debitWeek = [];
                let week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                connection.query(`select dayname(t_date) as day,sum(amount) as amount from transaction_details where ac_no = '${result[0].accountNumber}' and week(t_date) = week(now()) and T_type = 'debit' group by dayname(t_date)`,(err1,res1)=>{
                    if(err1) throw err1;
                    for(let j = 0;j<7;++j){
                        let flag = false;
                        for(let i = 0;i<res1.length && !flag;++i){
                            if(week[j] == res1[i].day){
                                debitWeek.push(res1[i].day);
                                debitVal.push(res1[i].amount);
                                flag = true;
                            }
                            // console.log(creditVal[i]);
                        }
                        if(flag === false){
                            debitWeek.push(week[j]);
                            debitVal.push(0);
                        }
                    }
                    // console.log(debitWeek);
                    // console.log(debitVal);
                    // console.log(j)
                    res.status(200).json({"message":"OK",debitVal:debitVal,debitWeek:debitWeek});
                });
            }

            if(req.body.val === 'monthly'){
                let debitVal = [];
                let debitMonth = [];
                let month = ["January","February","March","April","May","June","July","August","September","November","December"];
                connection.query(`select monthname(t_date) as month,sum(amount) as amount from transaction_details where ac_no = '${result[0].accountNumber}' and year(t_date) = year(now()) and T_type = 'debit' group by monthname(t_date);`,(err1,res1)=>{
                    if(err1) throw err1;
                    for(let j = 0;j<12;++j){
                        let flag = false;
                        for(let i = 0;i<res1.length && !flag;++i){
                            if(month[j] === res1[i].month){
                                debitMonth.push(res1[i].month);
                                debitVal.push(res1[i].amount);
                                flag = true;
                            }
                            // console.log(creditVal[i]);
                        }
                        if(flag === false){
                            debitMonth.push(month[j]);
                            debitVal.push(0);
                        }
                    }
                    // console.log(debitMonth);
                    // console.log(debitVal);
                    // console.log(j)
                    res.status(200).json({"message":"OK",debitVal:debitVal,debitMonth:debitMonth});
                });
            }
            if(req.body.val === 'yearly'){
                let debitVal = [];
                let debitYear = [];
                connection.query(`select year(t_date) as year,sum(amount) as amount from transaction_details where ac_no = '${result[0].accountNumber}' and T_type = 'debit' group by year(t_date) order by year(t_date) desc limit 10;`,(err1,res1)=>{
                    if(err1) throw err1;
                    var d = new Date();
                    let year = d.getFullYear();

                    for(let j = year-10;j<=year;++j){
                        let flag = false;
                        for(let i = res1.length-1;i>=0 && !flag;--i){
                            if(j === parseInt(res1[i].year)){
                                debitYear.push(j);
                                debitVal.push(res1[i].amount);
                                flag = true;
                            }
                            // console.log(creditVal[i]);
                        }
                        if(flag === false){
                            debitYear.push(j);
                            debitVal.push(0);
                        }
                    }
                    // console.log(debitVal);
                    // console.log(j)
                    res.status(200).json({"message":"OK",debitVal:debitVal,debitYear:debitYear});
                });
            }
        }
    })
})

router.post('/logOut',(req,res) => {
    connection.query(`call LogOut('${req.body.tok}');`,(err,result)=>{
        if(err) throw err;
        else{
            res.status(200).json({flag : true});
        }
    });
});

router.post('/portfolio',(req,res)=>{
    connection.query(`select Fname,Mname,Lname,accountNo,ISFC_code,user_balance(accountNo) as balance, fd_amt(accountNo) as fd_amt , loan_amt(accountNo) as loan_amt, credit_score(accountNo) as credit_score ,count_transac(accountNo) as transac_cnt, cnt_debit_transac(accountNo) as debit_transac, cnt_credit_transac(accountNo) as credit_transac from account_details where accountNo = account_id('${req.body.tok}');`,(err,result)=>{
        if(err) throw err;
        else{
            // console.log(result[0].Fname)
            res.status(200).json({'portfolio':result[0]});
        }
    });
})

router.post('/getBenificiaryDetails',(req,res)=>{
    connection.query(`select nickName,benificiaryACNo,addDate from benificiary_details where uAccountNo = account_id('${req.body.tok}') order by addDate desc;`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({details:result});
    })
})

router.post('/fetchACNo',(req,res)=>{
    connection.query(`select account_id(uToken) as ac from user_sessions where uToken = '${req.body.tok}';`,(err,result)=>{
        if(err) throw err;
        // console.log(result[0].ac);
        res.status(200).json({"account" : result[0].ac})
    })
})

router.post('/fetchPIN',(req,res)=>{
    connection.query(`select uPIN from account_details where accountNo = '${req.body.acno}'`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({pin:result[0].uPIN});
    })
})

router.post('/transactionUpdate',(req,res)=>{
    connection.query(`insert into transaction_details(T_type,Ac_no,amount,t_date,status_id,Ben_Ac_no) values ('debit','${req.body.acno}','${req.body.amount}',curdate(),1,'${req.body.bacno}'),('credit','${req.body.bacno}','${req.body.amount}',curdate(),1,'${req.body.acno}');`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({"message":"Success"});
    })
})

router.post('/deleteBenificiary',(req,res)=>{
    connection.query(`delete from benificiary_details where benificiaryACNo = '${req.body.acno}';`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({"message":"Success"});
    })
});

router.get('/fetchISFC',(req,res)=>{
    connection.query(`select ISFC as label from bank_branch;`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({ISFC:result});
    })
});

router.post('/fetchAcHolderName',(req,res)=>{
    connection.query(`select Fname,Mname,Lname from account_details where accountNo = '${req.body.acno}' and ISFC_code = '${req.body.isfc}';`,(err,result) =>{
        if(err) throw err;
        res.status(200).json({details:result});
    })
});

router.post('/checkAlreadyExist',(req,res)=>{
    connection.query(`select count(*) as cnt from benificiary_details where uAccountNo = '${req.body.acno}' and benificiaryACNo='${req.body.bacno}' and BISFC = '${req.body.isfc}';`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({count:result[0].cnt});
    })
});

router.post('/addBenificiary',(req,res)=>{
    connection.query(`insert into benificiary_details(uAccountNo,benificiaryACNo,BISFC,nickName,addDate) values('${req.body.acno}','${req.body.bacno}','${req.body.isfc}','${req.body.name}',curdate());`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({"message":"Success"});
    })
});

router.post('/getPassbook',(req,res)=>{
    connection.query(`select Ben_Ac_no, t_date,T_type,amount,BalancePerTransac from transaction_details where Ac_no = account_id('${req.body.tok}');`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({details:result});
    })
})

router.post('/TransactionDetails',(req,res)=>{
    connection.query(`select a.Fname,a.Mname,a.Lname,t.t_date,t.amount,t.T_type from account_details as a join transaction_details as t on a.accountNo = t.Ben_Ac_no where t.Ac_no = account_id('${req.body.tok}') order by t.t_date desc;`,(err,result)=>{
        if(err) throw err;
        res.status(200).json({details:result});
    });
});

module.exports = router;