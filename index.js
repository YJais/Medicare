const express = require('express');
const getconnect= require('./dbconnect')
const admin= require('./dbconnect')
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
app.get("/login_admin",(req,res)=>{
    res.render("login_admin");
});

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
    res.redirect("/login");
});

app.get("login",(req,res)=>{
    res.render("login",{ success: "You have successfully signed up! Please log in." })
});

app.post("/login",async(req,res)=>{
    let uemail=req.body.usremail;
    let upass=req.body.usrpass;
    let collection=await getconnect();
    let errors={};
    let user=await collection.findOne({usremail:uemail});
    if(!user){
        errors.email="E-mail not Found";
        console.log("E-mail not Found");
        return res.render("login",{errors});
    }
    console.log("Login Successful. Redirecting to dashboard");
    res.redirect("/dashboard");
});

app.get("/dashboard",(req,res)=>{
    res.render("dashboard",{ success: "You have successfully logged in!" })
});

app.get("/getappointment",(req,res)=>{
    res.render("appointment");
});

app.post("/login_adminbtn",async(req,res)=>{
    let aname=req.body.adname;
    let apass=req.body.adpass;
    let collection=await admin();
    console.log("Admin Login Successful. Redirecting to admin dashboard");
    res.redirect("/dashboard_admin");
});

app.get("/dashboard_admin",(req,res)=>{
    res.render("dashboard_admin",{ success: "You have successfully logged in!" })
});

app.listen(5000,()=>{
    console.log("Listening");
})