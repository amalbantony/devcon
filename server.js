const express_var = require('express');
const cntDb=require('./config/db');

const app=express_var();

cntDb();


app.get('/',(req,res)=>{
    res.send('API running successfully')
});

app.use('/api/users',require('./routes/api/users'));
app.use('/api/posts',require('./routes/api/posts'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));

const PORT=process.env.PORT||5000;

app.listen(PORT,()=>{
    console.log(`Server running on port no ${PORT}`)
});





