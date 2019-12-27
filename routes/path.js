const express=require('express');
const router=require('express').Router();
const cookieparser=require('cookie-parser');
const checkToken=require('../jwt/jwt').checkToken;
const connection=require('../db/db');
const jwt=require('jsonwebtoken');
const sgMail=require('@sendgrid/mail');
const sendGridKey=require('../config/key').sendGridKey;
sgMail.setApiKey(sendGridKey);


const config={
    secret:"iamthebest"
}

router.use(cookieparser());


//send login page
router.get('/',(request, response)=>
{
  if(request.cookies.email)
  {
    const token=request.cookies.email;
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        console.log(err);
          console.log('not valid')
          response.render('login');
      } else {
        response.redirect('/users/login');
      }
    });
  }
  else
  {
    response.render('login')
  }
})


//send image page
router.get('/image',checkToken,function(request, response)
{
    const { email }=request.decoded;
    var sqlSelectImageQuery="select * from image where email = ?";
    connection.query(sqlSelectImageQuery,[email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            response.render("image", {result});
        }
    })
})

router.get('/audio',checkToken, function(request, response)
{
  const {email}=request.decoded;
  const userid=request.cookies.id;
  var sqlSelectAudioQuery="select * from audio where email = ?";
  connection.query(sqlSelectAudioQuery,[email], function(err, result)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      response.render('audio',{result});
    }
  })
})

router.get('/video',checkToken, function(request, response)
{
  const { email }=request.decoded;
  const userid=request.cookies.id;
  var sqlVideoSelectQuery="select * from video where email = ?";
  connection.query(sqlVideoSelectQuery,[email], function(err, result)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      response.render('video', {result});
    }
  })
})

router.get('/doc', checkToken, function(request, response)
{
  const { email }=request.decoded;
  var sqlDocsSelectQuery="select * from doc where email = ?";
  connection.query(sqlDocsSelectQuery,[email], function(err, result)
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
      response.render('doc',{ result });
    }
  })
})

router.get('/chat',checkToken, function(request, response)
{
  const { email }=request.decoded;
  const userid=request.cookies.id;
  var sql="select * from info where university=( select university from info where email = ? ) and not email=? and userid not in(select recipient from request where requester = ?) and userid not in(select requester from request where recipient = ?)";
  connection.query(sql,[email, email, userid, userid], function(err, result)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      var sql1="select * from info where userid in (select requester from request where recipient = ? and status = 1)";
      connection.query(sql1,[userid],function(err, result1)
      {
        if(err)
        {
          console.log(err);
        }
        else
        {
          var sql2="select * from info where userid in (select recipient from request where requester = ? and status = 1)";
          connection.query(sql2,[userid], function(err, result2)
          {
            if(err)
            {
              console.log(err);
            }
            else
            {
              var sql3="select * from image where email = ?";
              connection.query(sql3,[email], function(err, result3)
              {
                if(err)
                {
                  console.log(err);
                }
                else
                {
                  var sql4="select * from audio where email = ?";
                  connection.query(sql4,[email], function(err, result4)
                  {
                    if(err)
                    {
                      console.log(err);
                    }
                    else
                    {
                      var sql5="select * from video where email = ?";
                      connection.query(sql5,[email], function(err, result5)
                      {
                        if(err)
                        {
                          console.log(err);
                        }
                        else
                        {
                          response.render('chat',{result, result1, result2, result3, result4, result5});
                        }
                      })
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
})

router.get('/history',checkToken,(request, response)=>
{
  const { email }=request.decoded;
  var sql="select * from share_history where sender = ?";
  connection.query(sql,[email], function(err, result)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      response.render('history',{ result })
    }
  })
})


router.get('/bin',checkToken, function(request, response)
{
  const { email }=request.decoded;
  var sql="select * from bin where email = ?";
  connection.query(sql,[email], function(err, result)
  {
    if(err)
    {
      console.log(err);
      response.status(500);
    }
    else
    {
      response.render('bin',{ result });
    }
  })
})






//private image validation
router.get('/:imageid/image/:name',checkToken, function(request, response, next)
{
    const { imageid, name }=request.params;
    const { email }=request.decoded;
    var sqlCheckQuery="select * from image where imageid = ? and email = ?";
    connection.query(sqlCheckQuery,[imageid, email], function(err, result)
    {
        if(err)
        {
            console.log(err);
        }
        if(result.length>0)
        {
            // console.log(result);
            next();
        }
    })
})


router.get('/:videoid/watchvideo/:videoname', checkToken, function(request, response, next)
{
  const { videoid, videoname }=request.params;
  const {email}=request.decoded;
  var sqlCheckQuery="select * from video where videoid=? and email=? and name =?";
  connection.query(sqlCheckQuery,[videoid, email, videoname], function(err, result)
  {
    if(err)
    {
      response.status(400).send({
        message:"Internal error"
      })
    }
    if(result.length>0)
    {
      next();
    }
    else
    {
      response.send({
        message:"Video does not exist"
      })
    }
  })
})

//public url validation
router.get('/public/:token/image/:name',(request, response, next)=>
{
  const name=request.params.name;
  const token=request.params.token;
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return response.json({
        success: false,
        code:'304',
        message: 'Token is not valid'
      });
    } else {
      var imageurl=request.originalUrl;
      next();
    }
  });
})

router.get('/public/:token/docs/:name',(request, response, next)=>
{
  const name=request.params.name;
  const token=request.params.token;
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return response.json({
        success: false,
        code:'304',
        message: 'Token is not valid'
      });
    } else {
      next();
    }
  });
})

router.get('/public/:token/audio/:name',(request, response, next)=>
{
  const name=request.params.name;
  const token=request.params.token;
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return response.json({
        success: false,
        code:'304',
        message: 'Token is not valid'
      });
    } else {
      next();
    }
  });
})


router.get('/public/:token/watchvideo/:name',(request, response, next)=>
{
  const name=request.params.name;
  const token=request.params.token;
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return response.json({
        success: false,
        code:'304',
        message: 'Token is not valid'
      });
    } else {
      next();
    }
  });
})

//public url share
router.post('/share',checkToken, function(request, response)
{
  const { email }=request.decoded;
  const arrOfEmail=request.body.arrOfEmail;
  const link=request.body.link;
  var time=new Date().toLocaleDateString()+' '+new Date().toLocaleTimeString();
  var sql="insert into share_history(sender, reciever, link, date) values(?,?,?,?)";
  connection.query(sql,[email,arrOfEmail.toString() , link, time], function(err, result)
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
        to:arrOfEmail,
        from:'sankhadip.2000@gmail.com',
        subject:'Video URL',
        text:link,
      })
    }
  })
})

// //view public url
// router.get('/public/:type', function(request, response)
// {
//   const { type }=request.params;
//   const { expire, name }=request.query;
//   jwt.verify(expire, config.secret, (err, decoded) => {
//     if (err) {
//       return response.json({
//         success: false,
//         code:'304',
//         message: 'Token is not valid'
//       });
//     } else {
//       if(type==='video')
//       {
//         const url=`/public/${expire}/watchvideo/${name}`;
//         response.render('public/video.ejs',{ url });
//       }
//       else if(type==='image')
//       {
//         const url=`/public/${expire}/${type}/${name}`;
//         response.render("public/image.ejs",{ url });
//       }
//       else if(type==='audio')
//       {
//         const url=`/public/${expire}/${type}/${name}`;
//         response.render('public/audio.ejs',{ url });
//       }
//       else if(type==='docs')
//       {
//         const url=`/public/${expire}/${type}/${name}`;
//         response.render('public/docs.ejs',{url});
//       }
//     }
//   });
// })

//download public shared file
router.get('/public/download/public/:token/:type/:filename', function(request, response)
{
  function downloadFile(path)
  {
    response.download(path);
  }
  const { token, type, filename }=request.params;
  jwt.verify(token, config.secret, (err, decoded) => {
    if(err)
    {
      response.send({
        success: false,
        code:'304',
        message: 'Token is not valid'
      });
    } 
    else 
    {
      if(type==='image')
      {
        const path='../gravity/upload/image/'+filename;
        downloadFile(path);
      }
      else if(type==='watchvideo')
      {
        const path='../gravity/videos/watchvideo/'+filename;
        downloadFile(path);
      }
      else if(type==='audio')
      {
        const path="../gravity/upload/audio/"+filename;
        downloadFile(path);
      }
      else if(type==='docs')
      {
        const path='../gravity/upload/docs/'+filename;
        downloadFile(path);
      }
    }
  });
})



module.exports=router;