const express = require("express")
const bodyParser = require("body-parser");
const cors = require("cors")
const axios = require("axios")
require("dotenv").config()







const app = express()


app.use(express.json())
app.use(cors())

app.post("/send", async (req, res) => {
  const { content, number } = req.body;

  const requestBody = {
    to: number,
    message: content,
    sender_name: 'Sendchamp',
    route: 'dnd'
  };

  console.log(requestBody);

  const config = {
    headers: {
      Authorization: process.env.SENDCHAMP_AUTH
    }
  };

  try {
    const response = await axios.post('https://api.sendchamp.com/api/v1/sms/send', requestBody, config);
    console.log(response.data);

    return res.status(200).json({ success: true, msg: "Alert Created successfully", content: content });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, msg: "An error occurred" });
  }
});

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
})