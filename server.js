const express_var = require('express');

const app=express_var();

app.get('/',(req,res)=>{
    res.send('API running successfully')
});

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server running on port no ${PORT}`)
});





