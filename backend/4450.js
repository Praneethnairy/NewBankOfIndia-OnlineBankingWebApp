const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const routeURLs = require('./Routes/routeURL.js')
const app = express();
const PORT = 4450;
dotenv.config()

app.use(express.json());
app.use(cors());

app.use('/bank',routeURLs);

app.listen(PORT,()=>{
    console.log('listening on port '+PORT);
});
