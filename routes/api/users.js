const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');

router.post('/',[
    check('name','Name is required!').not().isEmpty(),
    check('email','Email is required , include it!').isEmail(),
    check('password','Enter password , min length 6').isLength({min:6})
    
],(req,res)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})

    }
    res.send('USER Route');
});
module.exports=router;