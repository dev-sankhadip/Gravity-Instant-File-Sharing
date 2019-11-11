const jwt=require('jsonwebtoken');
const config={
  secret:"iamthebest"
}

let checkToken = (req, res, next) => {
    let token=req.cookies.email;
    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          console.log(err);
            console.log('not valid')
          return res.json({
            success: false,
            code:'304',
            message: 'Token is not valid'
          });
        } else {
            // console.log(decoded);
          req.decoded = decoded;
          next();
        }
      });
    } else {
        console.log('not supplied');
      return res.json({
        success: false,
        message: 'Auth token is not supplied',
        code:'305'
      });
    }
  };

  module.exports={
      checkToken:checkToken
  }
