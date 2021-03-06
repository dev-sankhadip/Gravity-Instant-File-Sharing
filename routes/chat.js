const express=require('express');
const router=express.Router();
const connection=require('../db/chatdb');
const infoConnection=require('../db/db');
const checkCookies=require('../jwt/jwt').checkToken;


router.post('/getAllMsg',checkCookies, function(request, response)
{
    // const email=request.body.email;
    const { email }=request.body.email;
    var sql1="select * from message_box where sid = ?";
    var sql2="select * from message_box where rid = ?";
    var sql3="select friendid, friendname from friends where ownid = ?";
    connection.query(sql1,[email], function(err, result1)
    {
        if(err)
        {
            console.log(err);
            response.send({
                code:500,
                message:"Internal error"
            })
        }
        else
        {
            connection.query(sql2,[email], function(err, result2)
            {
                if(err)
                {
                    console.log(err);
                    response.statusCode(500);
                    response.send({
                        code:500,
                        message:"Internal error"
                    })
                }
                else
                {
                    infoConnection.query(sql3,[email], function(err2, result3)
                    {
                        if(err2)
                        {
                            console.log(err2);
                        }
                        else
                        {
                            response.send({
                                code:200,
                                result1,
                                result2,
                                result3
                            })
                        }
                    })
                }
            })
        }
    })
})

router.post('/chat',checkCookies, function(request, response)
{
    // const userid=request.body.userid;
    // const s_id=request.body.s_id;
    const { userid,s_id }=request.body;
    var odd="select * from message_box where (sid = ? and rid = ?) or (sid = ? and rid = ?)";
    connection.query(odd,[userid, s_id, s_id, userid], function(err, result)
    {
        if(err)
        {
            console.log(err);
            response.statusCode(500);
        }
        response.send({
            code:200,
            chat1:result
        })
    })
})

router.get("/details/:userid",checkCookies, function(request, response)
{
    const { userid }=request.params;
    var sql="select name, email, number, university, img from info where userid = ?";
    infoConnection.query(sql,[userid], function(err, result)
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
            response.status(200).send({
                result,
                code:200
            })
        }
    })
})


router.get('/user/:name', checkCookies, function(request, response)
{
    const { email }=request.decoded;
    const { name }=request.params;
    const { id }=request.cookies;
    const getAllUserSqlQuery=`select * from info where name like '${name}%'`;
    const getAllFriendSqlQuery="select friendid from friends where ownid = ?";
    infoConnection.query(getAllUserSqlQuery,[name],(err1, users)=>
    {
        if(err1)
        {
            console.log(err1);
            response.status(500).send({ code:500 });
        }
        infoConnection.query(getAllFriendSqlQuery,[id, id],(err2, friend)=>
        {
            if(err2)
            {
                console.log(err2);
                response.status(500).send({ code:500 });
            }
            response.status(200).send({ users, friend });
        })
    })
})


module.exports=router;