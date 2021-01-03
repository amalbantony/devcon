const jwt=require('jsonwebtoken');
const config=require('config');

module.exports=function(req,res,next){
    const token=req.header('x-auth-token');

    if(!token){
        return res.status(401).json({msg:'No Token,Authrization Denied !'})
    }

    try{
        const decoded=jwt.verify(token,config.get('jwttoken'));

        req.user=decoded.user;
        next()
    }

    catch(error){
        return res.status(401).json({msg:'Error ! Invalid Token'});

    }

};