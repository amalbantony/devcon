const mongs=require('mongoose');

const profileSchema=new mongs.Schema({
    user:{
        type:mongs.Schema.Types.ObjectId,
        ref:'USER'
    },
    company:{
        type:String
    },
    website:{
        type:String
    },
    location:{
        type:String
    },
    status:{
        type:String,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    bio:{
        type:String
    },
    github_username:{
        type:String
    },

    experience:[{
        title:{
            type:String,
            required:true
        },
        company:{
            type:String,
            required:true
        },
        location:{
            type:String
        },
        from:{
            type:Date,
            required:true
        },
        to:{
            type:Date,
            required:true
        },
        current:{
            type:Boolean,
            required:true
        },
        description:{
            type:String
        },
    }],
    
    education:[{
        school:{
            type:String,
            required:true
        },
        degree:{
            type:String,
            required:true
        },
        field_of_study:{
            type:String,
            required:true
        },
        from:{
            type:Date,
            required:true
        },
        to:{
            type:Date,
            required:true
        },
        current:{
            type:Boolean,
            required:true
        },
        description:{
            type:String
        },
    }],

    social:{
        youtube:{
            type:String
        },
        twitter:{
            type:String
        },
        facebook:{
            type:String
        },
        linkedin:{
            type:String
        },
        instagram:{
            type:String
        },
    },
    date:{
        type:Date,
        default:Date.now()
    }

})

module.exports=Profile=mongs.model('PROFILE',profileSchema);