const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const Profile=require('../../models/Profile');
const {check,validationResult}=require('express-validator')
const User=require('../../models/User');
const mongoose=require('mongoose');

router.get('/me',auth,async (req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
        
        if(!profile){
            res.status(400).json({msg:'No Profile found for this User'});
        }
        
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// post request to create or update user profile - private

router.post('/',[auth,
    [check('status','Status is required').not().isEmpty(),
    check('skills','Skills is required').not().isEmpty()]
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }

    const {company,website,location,bio,status,github_username,skills,youtube,twitter,facebook,linkedin,instagram}=req.body;

    //build profile fields
    const profileFields={};
    profileFields.user=req.user.id;
    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(github_username) profileFields.github_username=github_username;
    if(status) profileFields.status=status;
    if(skills) {
        profileFields.skills=skills.split(',').map(skill=>skill.trim());
    }

    //console.log(profileFields.skills)
    //res.send('HELL YEAH');
    
    // Build Social Fields
    profileFields.social={};

    if(youtube) profileFields.social.youtube=youtube;
    if(twitter) profileFields.social.twitter=twitter;
    if(facebook) profileFields.social.facebook=facebook;
    if(linkedin) profileFields.social.linkedin=linkedin;
    if(instagram) profileFields.social.instagram=instagram;

    try{
        // check for a profile first
        let profile=await Profile.findOne({user:req.user.id});
        if(profile){
            profile=await Profile.findOneAndUpdate(
                {user:req.user.id},
                {$set:profileFields},
                {new:true}
            );

            return res.json(profile);
        }

        // create a profile if not found

        profile=new Profile(profileFields);
        await profile.save();
        res.json(profile);
    }

    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }


});

router.get('/', async (req,res)=>{
    try {
        const profiles=await Profile.find().populate('user',['name','avatar']);
        res.send(profiles);
        
    } catch (er) {
        console.err(er.messsage);
        res.status(500).send('Server Error');
    }
})

router.get('/user/:user_id',async (req,res)=>{
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.user_id)) {
            return res.status(400).json({ msg: "No such Profile found ,Invalid ID" });
          }

        const profile=await Profile.findOne({user:req.params.user_id}).populate('user',['name','avatar']);
        
        if(!profile){
            return res.status(400).json({msg:"No such profile found"});
        }
        
        res.send(profile);
        
    } catch (err) {
        console.error(err.messsage);
        res.status(500).json('Server Error');

        
    }
})

//Remove User and Profile

router.delete('/',auth,async (req,res)=>{
    try {
        await Profile.findOneAndRemove({user:req.user.id}); // remove profile

        await User.findOneAndRemove({_id:req.user.id}) // removes user
        res.json({msg:"User Deleted"})
        
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Server Error , Cannot Proceed with Delete Request')
        
    }
})

// ADDING EXPERIENCE USING A PUT REQUEST
router.put('/experience',[auth,[
    check('title','Title is Required').not().isEmpty(),
    check('company','Company is Required').not().isEmpty(),
    check('from','From Date is Required').not().isEmpty()]
],async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    
    const {title,company,location,from,to,current,description}=req.body;
    const newExp={title,company,location,from,to,current,description};
    
    try {
        const profile=await Profile.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.messsage);
        res.status(500).json('Server Error,Cant Add Experience');
        
    }

})

// delete an experience field = private acess
router.delete('/experience/:exp_id',auth,async (req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.user.id});
        // get index to remove
        const rmv_index=profile.experience.map(idx=>idx.id).indexOf(req.params.exp_id);
        profile.experience.splice(rmv_index,1);
        await profile.save();
        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error , Cant Delete Experience");
        
    }
})

// Adding Education
router.put('/education',[auth,[
    check('school','School is Required').not().isEmpty(),
    check('degree','Degree is Required').not().isEmpty(),
    check('field_of_study','Field of study is Required').not().isEmpty(),
    check('from','From Date is Required').not().isEmpty()]
],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    
    const {school,degree,field_of_study,from,to,current,description}=req.body;
    const newEdu={school,degree,field_of_study,from,to,current,description};
    
    try {
        const profile=await Profile.findOne({user:req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
        
    } catch (err) {
        console.error(err.messsage);
        res.status(500).json('Server Error,Cant Add Education');
        
    }

}
)

router.delete('/education/:edu_id',auth,async(req,res)=>{
    try {
        const profile=await Profile.findOne({user:req.user.id});
        // get index to remove
        const rmv_index=profile.education.map(idx=>idx.id).indexOf(req.params.edu_id);
        profile.education.splice(rmv_index,1);
        await profile.save();
        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error , Cant Delete Education");
        
    }

})


module.exports=router;