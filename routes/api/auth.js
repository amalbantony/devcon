const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth')
const User=require('../../models/User')
const {check,validationResult}=require('express-validator');
const jwt=require('jsonwebtoken');
const config=require('config');
const bcrypt=require('bcryptjs');

// Finding user by userID
router.get('/',auth,async(req,res)=>{
    try{
        const user=await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error !')
    }
})


// Login and authentication of users

router.post('/',[
    check('email','Email is required , include it!').isEmail(),
    check('password','Password is Required').exists()
    ],
    async(req,res)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})

    }

    const {email,password}=req.body;
    try{
        let user=await User.findOne({email});

        if(!user){
           return res.status(400).json({errors:[{msg:'Invalid Credentials ! \n'}]})
        }

        const is_match=await bcrypt.compare(password,user.password);
        if(!is_match){
            return res.status(400).json({errors:[{msg:'Invalid Credentials ! \n'}]})
        }


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

