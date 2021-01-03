const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');
const User=require('../../models/User');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');

router.post('/',[
    check('name','Name is required!').not().isEmpty(),
    check('email','Email is required , include it!').isEmail(),
    check('password','Enter password , min length 6').isLength({min:6})
    
],async(req,res)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})

    }

    const {name,email,password}=req.body;
    try{
        let user1=await User.findOne({email});

        if(user1){
           return res.status(400).json({errors:[{msg:'User Already Exists \n'}]})
        }

        const avatar=gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })

        const user=new User({
            name,
            email,
            avatar,
            password
        })

        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);
        await user.save();

        const payload={
            user:{
                id:user.id
            }
        }

        jwt.sign(payload,
            config.get('jwttoken'),
            {
           expiresIn:360000 },
        (error,token)=>{
            if(error) throw error;
            res.json({token});

        })

       

    }
    catch(err){
        console.error(err.messsage);
        res.status(500).send('Server Error');

    }

    
});
module.exports=router;