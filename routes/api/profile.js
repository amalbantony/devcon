const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
const Profile=require('../../models/Profile');
const {check,validationResult}=require('express-validator')
const User=require('../../models/User');

router.get('/me',auth,async (req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('USER',['name','avatar']);
        
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


})

module.exports=router;