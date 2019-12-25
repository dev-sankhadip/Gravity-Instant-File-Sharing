const express=require('express');
const router=express.Router();
const connection=require('../db/db');
const cors=require('cors');

router.post('/login',cors(), (request, response)=>
{
    const { email, password }=request.body;
    var sql="select * from info where email = ?";
    connection.query(sql,[email],(err, result)=>
    {
        if(result.length>0)
        {
            if(result[0].password==password)
            {
                response.send({
                    code:"200",
                    message:"You are loggedin",
                    id:result[0].userid
                })
            }
            else
            {
                response.send({
                    code:300,
                    message:"Wrong Password"
                })
            }
        }
        else
        {
            response.send({
                code:400,
                message:"Email does not exist"
            })
        }
    })
})



module.exports=router;