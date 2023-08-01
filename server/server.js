const express = require("express")
const  bodyParser  =require("body-parser");
const cors = require("cors")
const axios = require("axios")
require("dotenv").config()







const app = express()


app.use(express.json())
app.use(cors())

app.post("/send",(req,res)=>{
    const {content,number} = req.body

    const requestBody = {
      to: number,
      message: content,
      sender_name: 'Sendchamp',
      route: 'dnd'
    }
  
    console.log(requestBody);
    
    const config = {
      headers:{
        Authorization: process.env.SENDCHAMP_AUTH
    }
  }
  
    axios.post('https://api.sendchamp.com/api/v1/sms/send', requestBody, config).then(()=>console.log("Thank God"))
    .catch((err)=> console.log(err))
    
  
    res.json()
})

const port =  process.env.PORT;

app.listen(port,()=>{
  console.log(`Server is listening`);
})