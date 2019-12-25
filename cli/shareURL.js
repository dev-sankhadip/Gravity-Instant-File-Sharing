const express=require('express');
const router=express.Router();
const connection=require('../db/db');
const cors=require('cors');
const sgMail=require('@sendgrid/mail');
const sendGridKey=require('../config/key').sendGridKey;
sgMail.setApiKey(sendGridKey);


router.post('/url',cors(), function(request, response)
{
  console.log(request.body);
  const { recieverEmail, shareURL, senderEmail }=request.body;
  var time=new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString();
  var sql="insert into share_history(sender, reciever, link, date) values(?,?,?,?)";
  connection.query(sql,[senderEmail,recieverEmail , shareURL, time], function(err, result)
  {
    if(err)
    {
      console.log(err);
      response.status(500).send({
        message:"Internal error"
      })
    }
    else
    {
      sgMail.send({
        to:recieverEmail,
        from:'sankhadip.2000@gmail.com',
        subject:'Video URL',
        text:shareURL,
      })
      response.status(200).send({
        message:"Successfully sent"
      })
    }
  })
})


module.exports=router;