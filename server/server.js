const express = require("express")
const  bodyParser  =require("body-parser");
const cors = require("cors")
const axios = require("axios")




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
        Authorization: "Bearer sendchamp_live_$2a$10$cbYEsziD//Xfmkvd/nsxC.hP.GZHkm3uOQB5lDOZoMzjuCNoBd7Qi"
      }
    }
  
    axios.post('https://api.sendchamp.com/api/v1/sms/send', requestBody, config).then(()=>console.log("Thank God"))
    .catch((err)=> console.log(err))
    
  
    res.json()
})

const port =  3001;

app.listen(port,()=>{
    console.log("Server is listening on port ", port);
})