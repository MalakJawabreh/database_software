const express = require('express');
const cors = require('cors');
const body_parser = require('body-parser');
const userRouter  = require ('./routers/user.routers');


const app=express();
app.use(body_parser.json());
app.use(cors());
app.use('/',userRouter);
//aya awwad test new!
module.exports=app;