const express = require("express");
const app = express();

const port= process.env.PORT || 3000;
app.use(express.json());

app.listen(port,()=>{
    console.log(`The application started succesfully at port ${port}`)
});



const userRouter=require('./Router/userRouter');
 


const cookieParser=require('cookie-parser');

app.use("/",userRouter);

app.use(cookieParser());


const userModel=require('./Model/userModel');

const reviewModel=require('./Model/reviewModel');

const hostModel=require('./Model/hostModel');

const registerModel=require('./Model/registerModel');
