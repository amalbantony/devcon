const mgs=require('mongoose');
const config=require('config');
const db=config.get('mongoURI');

const connectDB=async()=>{
    try{
        await mgs.connect(db,{ useNewUrlParser: true,useUnifiedTopology: true });
        console.log('MongoDb Connected.....')
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

module.exports=connectDB;
