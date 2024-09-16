const express = require('express');
const getconnect= require('./dbconnect')
const app=express()
app.set("view engine","ejs");
app.use(express.static(__dirname+'/public'))
app.use(express.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/signup",(req,res)=>{
    res.render("signup",{errors:{}});
});
app.get("/login",(req,res)=>{
    res.render("login",{errors:{}});
});
// app.get("/dashboard"(req,res)=>{
//     res
// })
app.post("/signup",async(req,res)=>{
    let fname=req.body.firname;
    let mname=req.body.midname;
    let lname=req.body.lstname;
    let uname=req.body.usrname;
    let uemail=req.body.usremail;
    let upass=req.body.usrpass;
    let collection=await getconnect();
    let errors = {};
    let userWithSameUsername = await collection.findOne({ usrname: uname });
    if (userWithSameUsername) {
        errors.username = "Username is already taken.";
    }

    let userWithSameEmail = await collection.findOne({ usremail: uemail });
    if (userWithSameEmail) {
        errors.email = "Email is already registered.";
    }

    if (Object.keys(errors).length > 0) {
        console.log("Error detected: ", errors);
        return res.render("signup", { errors });
    }    

    let r= await collection.insertOne({
        firname:fname,
        midname:mname,
        lstname:lname,
        usrname:uname,
        usremail:uemail,
        usrpass:upass
    });
    console.log("New user data inserted.");
    res.render("login", { success: "You have successfully signed up! Please log in." });
});
app.get("/dashboard",async(req,res)=>{
    let uemail=req.query.usremail;
    let upass=req.query.usrpass;
    let collection=await getconnect();
    let errors={};
    let user=await collection.findOne({usremail:uemail});
    if(!user){
        errors.email="E-mail not Found";
        console.log("E-mail not Found");
        return res.render("login",{errors});
    }
    if(user.usrpass!==upass){
        errors.password="Password not Found";
        console.log("Password not Found");
        return res.render("login",{errors})
    }
    console.log("Login Successful. Redirecting to dashboard");
    res.render("dashboard",{success:"You have successfully logged in!"})
});
app.get("/getappointment",(req,res)=>{
    res.render("appointment");
})
app.listen(5000,()=>{
    console.log("Listening");
})