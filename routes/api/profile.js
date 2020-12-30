const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>res.send('PROFILE Route'));
module.exports=router;