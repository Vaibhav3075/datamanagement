const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose');
const exp = require('constants');
var fs = require('fs');
const { type } = require('os');
const { env } = require('process');
const { getEnvironmentData } = require('worker_threads');
 

mongoose.set('strictQuery', true);


app.use(express.urlencoded({
    extended : true
}));



mongoose.connect("mongodb://localhost:27017/dmpdb" , {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then(()=>{
    console.log("mongodb connection successfull")
})
.catch((err)=>{
    console.log(err)
})

const myschema = new mongoose.Schema({
    name : {
        type : String
    },
    rollno : {
        type : String,
        required : true
    },
    branch : String,
    dob : {
        type : String,
        required : true
    },
    contactno : Number
})

const mycollection = new mongoose.model("mycollection" , myschema)

const port = process.env.port || 3000

app.use(express.static(path.join(__dirname,'views')))
app.set('view engine','ejs');

app.get('/' , (req , res)=>{
    
    res.sendFile(__dirname+'/views/index.html')
})

app.post('/login', async (req , res)=>{
    
    try{
        const rollno1 = req.body.rollno;
        const password = req.body.password;
        const result = await mycollection.findOne({rollno : "20113075"})

        console.log(rollno1,password,result.dob);

        if(result.dob == password){
            var content = fs.readFileSync(__dirname+'/views/student.html');
            content = content.toString()
            content = content.replace("__student", result.name)
            // console.log(content);
            res.send(content)
            
        }
        else{
            res.send('invalid credentials')
        }
    }catch(err){
        res.send('catched, invalid credentials')
    }
})
app.post('/admin', async (req , res)=>{
    
    try{
        const rollno1 = req.body.rollno;
        const password = req.body.password;
        const result = await mycollection.findOne({rollno : "20113075"})
        const data = await mycollection.find();

        console.log('admin post',rollno1,password,result.dob);

        if(result.dob == password){
            res.render('admin',{
                data : data 
            });         
        }
        else{
            res.send('invalid credentials')
        }
    }catch(err){
        res.send('catched, invalid credentials')
    }
})

app.get('/admin', async (req,res)=>{
    const data = await mycollection.find();
    res.render('admin',{
        data : data
    });
})

app.post('/adminpost', async (req,res)=>{

    try{
        const obj = req.body;

        const doc = new mycollection({
            name : obj.name,
            rollno : obj.rollno,
            branch : obj.branch,
            dob : obj.dob,
            contactno : obj.contactno
        })

        var result = await doc.save();
        res.redirect('/admin') ;
    }catch(err){
        res.send(`catched while inserting new data ${err}`);
    }

})

app.listen(port , ()=>{
    console.log(`server is listening at port ${port}`)
})