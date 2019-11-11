const path=require('path');
const express=require('express');
const logger=require('morgan');
const socket=require('socket.io');
const connection=require('./db/chatdb');
const infoConnection=require('./db/db');
const events=require('events');


const app=express();
const event=new events.EventEmitter();

const server=app.listen(4000, function()
{
    console.log('connected to port 4000');
})

const io=socket(server);

//website routes
const userRouter=require('./routes/users');
const pathRouter=require('./routes/path');
const imageRouter=require('./routes/image');
const chatRouter=require('./routes/chat');
const audioRouter=require('./routes/audio');
const videoRouter=require('./routes/video');
const binRouter=require('./routes/bin');
const docRouter=require('./routes/doc');
const compilerRouter=require('./routes/compiler');
const publicRoute=require('./routes/public/public');


//cli routes
const cliLoginRouter=require('./cli/login');
const cliImageRouter=require('./cli/image');
const cliAudioRouter=require('./cli/audio');
const cliVideoRouter=require('./cli/video');
const cliListRouter=require('./cli/list');
const cliURLGenerator=require('./cli/generateURL');
const cliURLShare=require('./cli/shareURL');
const cliDocRouter=require('./cli/doc');
const cliDownloadRouter=require('./cli/download');
const cliPublicRouter=require('./cli/public');


//public api
const publicApiRouter=require('./publicapi/upload');


app.set('view engine','ejs');
app.use(express.urlencoded({extended:true, limit:'50mb'}));
app.use(express.json({ limit:'50mb' }));
app.use(logger('dev'));


//website routes
app.use('/',pathRouter);
app.use('/users',userRouter);
app.use('/image',imageRouter);
app.use('/messenger', chatRouter);
app.use('/audio', audioRouter);
app.use('/video', videoRouter);
app.use('/bin', binRouter);
app.use('/doc', docRouter);
app.use('/compiler', compilerRouter);
app.use('/public', publicRoute);

//publicapi routes
app.use('/publicapi', publicApiRouter);

//cli routes
app.use('/cli', cliLoginRouter);
app.use('/cli/image', cliImageRouter);
app.use('/cli/audio', cliAudioRouter);
app.use('/cli/video', cliVideoRouter);
app.use('/cli/doc', cliDocRouter);
app.use('/cli/list', cliListRouter);
app.use('/cli/url', cliURLGenerator);
app.use('/cli/share', cliURLShare);
app.use('/cli/download',cliDownloadRouter);
app.use('/cli/public', cliPublicRouter);


app.use(express.static('asset'));
app.use(express.static('public'));
app.use(express.static('public3'));
app.use(express.static('clifiles'));
app.use('/:imageid', express.static(path.join(__dirname,'upload')));
app.use('/public/:token',express.static(path.join(__dirname, 'upload')));
app.use('/:videoid', express.static(path.join(__dirname,'videos')));
app.use('/public/:token', express.static(path.join(__dirname,'videos')));

var arrayOfUsers=[];
io.on('connection', function(socket)
{
    socket.on('join', function(data)
    {
        socket.join(data.email);
        if(!arrayOfUsers.includes(parseInt(data.email)))
        {
            arrayOfUsers.push(parseInt(data.email));
        }
        console.log("active user array: ",arrayOfUsers);
    })

    socket.on('user_leave', function(data)
    {
        var index=arrayOfUsers.indexOf(parseInt(data.email));
        if(index>-1)
        {
            arrayOfUsers.splice(index,1);
        }
        console.log("user leave array: ",arrayOfUsers);
    })

    socket.on('new', function(data)
    {
        const rEmail=data.email;
        const sEmail=data.sEmail;
        const message=data.msg;
        const time=data.time;
        function insert_new_msg(new_user_msg)
        {
            var sql="insert into message_box(rid, sid, message,new_msg, time) values(?,?,?,?,?)";
            connection.query(sql,[rEmail, sEmail, message,new_user_msg, time], function(err, result)
            {
                if(err)
                {
                    console.log(err);
                }
                if(arrayOfUsers.includes(parseInt(data.email)))
                {
                    io.sockets.in(data.email).emit('new_msg',{
                        msg:data.msg,
                        sEmail:data.sEmail
                    })
                }
            })
        }
        if(arrayOfUsers.includes(parseInt(data.email)))
        {
            const active_user_message="false";
            insert_new_msg(active_user_message);
        }
        else
        {
            const non_active_user_new_message="true";
            insert_new_msg(non_active_user_new_message);
        }
    })
    socket.on('add_friend', function(data)
    {
        const reciepientId=data.reciepientId;
        const id_cookie_location=socket.request.headers.cookie.search("id");
        const id_cookie=socket.request.headers.cookie.substring(id_cookie_location,id_cookie_location+4);
        const requesterId=id_cookie.split("=")[1];
        var sql="select * from info where userid = ?";
        var sql1="insert into request(requester, recipient, status) values(?,?,?)";
        infoConnection.query(sql1,[requesterId, reciepientId,"1"], function(err, result1)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                infoConnection.query(sql,[requesterId], function(err, result)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        io.sockets.in(reciepientId).emit('friend_request',{
                            result
                        })
                    }
                })
            }
        })
    })

    socket.on('accept_request', function(data)
    {
        const id_cookie_location=socket.request.headers.cookie.search("id");
        const id_cookie=socket.request.headers.cookie.substring(id_cookie_location,id_cookie_location+4);
        const reciepientId=id_cookie.split("=")[1];
        const requesterId=data.requesterId;
        var addToFriendListSqlQuery="insert into friends(ownid, ownemail, friendid, friendname) values(?,?,?,?)";
        var ownerEmailSqlQuery="select userid,name, email from info where userid = ?";
        var friendNameSqlQuery="select userid, name, email from info where userid = ?";
        infoConnection.query(ownerEmailSqlQuery,[reciepientId],(err1, res1)=>
        {
            if(err1)
            {
                console.log(err1);
            }
            else
            {
                infoConnection.query(friendNameSqlQuery,[requesterId],(err2, res2)=>
                {
                    if(err2)
                    {
                        console.log(err2);
                    }
                    else
                    {
                        const ownemail=res1[0].email;
                        const ownid=res1[0].userid;
                        const ownname=res1[0].name;

                        const friendname=res2[0].name;
                        const friendid=res2[0].userid;
                        const friendemail=res2[0].email;

                        infoConnection.query(addToFriendListSqlQuery,[ownid, ownemail, friendid, friendname],(err3, res3)=>
                        {
                            if(err3)
                            {
                                console.log(err3);
                            }
                            else
                            {
                                infoConnection.query(addToFriendListSqlQuery,[friendid, friendemail, ownid, ownname], function(err4, res4)
                                {
                                    if(err4)
                                    {
                                        console.log(err4);
                                    }
                                    else
                                    {
                                        // console.log(res4);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        var sql="update request set status = ? where requester = ? and recipient = ?";
        infoConnection.query(sql,["2", requesterId, reciepientId], function(err, result)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                event.emit('first_message',{ requesterId, reciepientId });
            }
        })
    })

    socket.on('cancel_request', function(data)
    {
        const id_cookie_location=socket.request.headers.cookie.search("id");
        const id_cookie=socket.request.headers.cookie.substring(id_cookie_location,id_cookie_location+4);
        const requesterId=id_cookie.split("=")[1];
        const reciepientId=data.reciepientId;
        console.log(requesterId);
        console.log(reciepientId);
        var sql="delete from request where requester = ? and recipient = ?";
        infoConnection.query(sql,[requesterId, reciepientId], function(err, result)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                // console.log(result);
                socket.emit("remove_request",{ requesterId });
            }
        })
    })

    socket.on('reject_request', function(data)
    {
        console.log(data);
        const id_cookie_location=socket.request.headers.cookie.search("id");
        const id_cookie=socket.request.headers.cookie.substring(id_cookie_location,id_cookie_location+4);
        const reciepientId=id_cookie.split("=")[1];
        const requesterId=data.requesterId;
        var sql="update request set status = 3 where requester=? and recipient=?";
        infoConnection.query(sql,[requesterId, reciepientId], function(err, result)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                // console.log(result);
            }
        })
    })

    socket.on('get_name', function(data)
    {
        const id_cookie_location=socket.request.headers.cookie.search("id");
        const id_cookie=socket.request.headers.cookie.substring(id_cookie_location,id_cookie_location+4);
        const sid=id_cookie.split("=")[1];
        const { rid }=data;
        var sql="select name from info where userid = ?";
        connection.query(sql,[rid], function(err, result)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                // console.log(result);
            }
        })

    })

    socket.on('make_seen', function(data)
    {
        const id_cookie_location=socket.request.headers.cookie.search("id");
        const id_cookie=socket.request.headers.cookie.substring(id_cookie_location,id_cookie_location+4);
        const sid=id_cookie.split("=")[1];
        const { recieverEmail }=data;
        var sql="update message_box set new_msg = ? where rid = ? and sid = ?";
        connection.query(sql,["false", recieverEmail, sid], function(err, res)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log(res);
            }
        })
    })
})

//all custom events
event.on('first_message',function(data)
{
    const { requesterId, reciepientId }=data;
    var sql="insert into message_box(rid, sid, message, time) values(?,?,?,?)";
    const message="You are connected now";
    const time=new Date().toLocaleTimeString();
    connection.query(sql,[requesterId, reciepientId, message, time], function(err, result1)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            connection.query(sql,[reciepientId, requesterId, message, time], function(err, result2)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    // console.log(result1);
                    // console.log(result2);
                }
            })
        }
    })
})