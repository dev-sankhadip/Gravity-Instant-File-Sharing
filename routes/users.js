const express=require('express');
const router=express.Router();
const cookieparser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const uuid=require('uuid');
const connection=require('../db/db');
const checkCookies=require('../jwt/jwt').checkToken;
const sgMail=require('@sendgrid/mail');
const sendGridKey=require('../config/key').sendGridKey;
sgMail.setApiKey(sendGridKey);


const config={
    secret:"iamthebest"
}

router.use(cookieparser());


router.get('/login',checkCookies, function(request, response)
{
    const userid=request.cookies.id;
    response.render('welcome',{userid});
})

router.post('/signup',(request, response)=>
{
    const { username, number, email, password, university }=request.body;
    if(password.length<6)
    {
        response.send({
            error:"password shouldn't be less than 6 character",
            status:400
        })
    }
    else
    {
        var sql1="select * from info where email = ?";
        connection.query(sql1,[email],(err,result)=>
        {
            if(result.length>0)
            {
				console.log('here');
                response.send({
                    message:"Email already registered",
                    status:300
                })
            }
            else
            {
                const tokenUUID=uuid();
                var sql="insert into verification(uuid, name, email, number, university, password) values(?,?,?,?,?)";
                connection.query(sql,[tokenUUID, username, email, number, university, password], function(err, result)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        sgMail.send({
                            to:email,
                            from:'samantaraja627@gmail.com',
                            subject:'Verification email',
                            text:`http://localhost:4000/users/verification/${tokenUUID}`,
                        })
                        response.end("email has been sent, please verify");
                    }
                })
            }
        })
    }
})

router.get('/verification/:token', function(request, response)
{
    const uuid=request.params.token;
    var sql="select * from verification where uuid = ?";
    connection.query(sql,[uuid], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            console.log(result);
            const name=result[0].name;
            const email=result[0].email;
            const number=result[0].number;
            const password=result[0].password;
            const uuid=result[0].uuid;
            const university=result[0].university;
            var sqlInsertQuery="insert into info(name, email, number, university, password) values(?,?,?,?)";
            connection.query(sqlInsertQuery,[name, email, number,university, password], function(err, result)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    var sqlDeleteQuery="delete from verification where uuid = ?";
                    connection.query(sqlDeleteQuery,[uuid], function(err, result)
                    {
                        if(err)
                        {
                            console.log(err);
                        }
                        else
                        {
                            response.send({
                                message:"you are registered"
                            })
                        }
                    })
                }
            })
        }
    })
})


router.post('/login',(request, response)=>
{
    const { email, password }=request.body;
    var sql="select * from info where email = ?";
    connection.query(sql,[email],(err, result)=>
    {
        if(result.length>0)
        {
            if(result[0].password==password)
            {
                let token = jwt.sign({email: email},
                    config.secret,
                    { 
                        expiresIn: '1h' //expires in 24 hours
                    }
                );
                const userid=result[0].userid;
                response.cookie('email',token, { maxAge: 9000000, httpOnly: true });
                response.cookie('id',userid, { maxAge: 9000000, httpOnly: true });
                response.render('welcome',{userid});
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