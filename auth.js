const jwt = require('jsonwebtoken')


const jwt_privateKey = "this is a todo application"
function auth(req,res,next){
  const token = req.headers.token
    const decoded_data = jwt.verify(token,jwt_privateKey)
    if(decoded_data){
        req.userId = decoded_data.id
        next()
    }else{
        res.sendStatus(403).json({
        message : "User NOt Found"
    })}
}

module.exports = {
    auth : auth,
    jwt_privateKey : jwt_privateKey
}