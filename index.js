const express = require('express');
const {getconnect,admin,doctor,appointment}= require('./dbconnect');
const app=express();
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
app.get("/signup_doc",(req,res)=>{
    res.render("signupdoc",{errors:{}});
});
app.get("/login_doc",(req,res)=>{
    res.render("login_doc",{errors:{}});
});
app.get("/login_admin",(req,res)=>{
    res.render("login_admin",{errors:{}});
});
// app.get("/das",(req,res)=>{
//     res.render("billing");
// });
//Client Signup
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
app.get("/login",(req,res)=>{
    res.render("login",{ success: "You have successfully signed up! Please log in." })
});
//Client LogIn
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
    if (user.usrpass !== upass) {
        errors.password="Incorrect password";
        console.log("Incorrect password");
        return res.render("login", {errors});
    }
    console.log("Login Successful. Redirecting to dashboard");
    res.redirect("/dashboard");
});
app.get("/dashboard",(req,res)=>{
    res.render("dashboard",{ success: "You have successfully logged in!" })
});
//Client Appointment Booking
app.get("/getappointment",(req,res)=>{
    res.render("appointment");
});
app.post("/getappointment", async (req, res) => {
    const { patname, patage, patcontact, choosedept, d_name, m_pay } = req.body;
    const collection = await appointment();

    await collection.insertOne({
        Patient_Name: patname,
        Patient_Age: patage,
        Patient_Contact: patcontact,
        Department: choosedept,
        Doctor_Name: d_name,
        Mode_of_Payment: m_pay
    });

    console.log("New Appointment inserted.");
    res.redirect("/dashboard_user");
});
app.get("/dashboard_user",(req,res)=>{
    res.render("dashboard")
})


// Fetch Doctors by Department
app.get("/getdoctors", async (req, res) => {
    const d_dept = req.query.doc_dept;
    const collection = await doctor();
    const doctors = await collection.find({ doc_dept: d_dept }).toArray();
    res.json(doctors);
});

// Fetch Doctor Fees by Doctor Name
app.get("/getdoctorfees", async (req, res) => {
    const d_name = req.query.doc_name;
    const collection = await doctor();
    const doctorRecord = await collection.findOne({ doc_name: d_name });

    if (doctorRecord) {
        res.json({ d_fees: doctorRecord.doc_fees });
    } else {
        res.status(404).json({ error: "Doctor not found" });
    }
});
//My Appointment
app.get("/my_appointments", async (req, res) => {
    const user= await getconnect();
    const userEmail = req.query.usremail;
    const collection = await appointment(); 
    const appointments = await collection.find({ usremail: userEmail }).toArray();
    res.render("my_appo", { appointments });
});

//Admin LogIn
app.post("/login_adminbtn",async(req,res)=>{
    let aname=req.body.adname;
    let apass=req.body.adpass;
    let collection=await admin();
    let errors={};
    let user=await collection.findOne({adname:aname});
    if(!user){
        errors.ad_name="E-mail not Found";
        console.log("E-mail not Found");
        return res.render("login_admin",{errors});
    }
    if (user.adpass !== apass) {
        errors.adpassword="Incorrect password";
        console.log("Incorrect password");
        return res.render("login_admin", {errors});
    }
    console.log("Admin Login Successful. Redirecting to admin dashboard");
    res.redirect("/dashboard_admin");
});

app.get("/dashboard_admin",(req,res)=>{
    res.render("dashboard_admin",{ success: "You have successfully logged in!" })
});

app.get("/docdata",async (req,res)=>{
    let collection=await doctor();
    let records=await collection.find({}).toArray();
    res.render("docdata",{records});
});
app.get("/insertdocdata",(req,res)=>{
    res.render("insertdocdata");
    
});
app.post("/inst",async (req,res)=>{
    let d_id=req.body.doc_id;
    let d_name=req.body.doc_name;
    let d_desig=req.body.doc_desig;
    let d_sal=req.body.doc_sal;
    let d_dept=req.body.doc_dept;
    let d_fees=req.body.doc_fees;
    let collection=await doctor();
    let r=await collection.insertOne({
        doc_id:d_id,
        doc_name:d_name,
        doc_desig:d_desig,
        doc_sal:d_sal,
        doc_dept:d_dept,
        doc_fees:d_fees
    });
    let records=await collection.find({}).toArray();
    res.redirect("docdata");
});
app.get("/docdata",(req,res)=>{
    res.render("docdata",{records})
});
app.get("/deletedocdata",(req,res)=>{
    res.render("deletedocdata");
});

app.get("/del",async (req,res)=>{
    let d_id=req.query.doc_id;
    let collection=await doctor();
    let r=await collection.deleteOne({doc_id:d_id});
    let records=await collection.find({}).toArray();
    res.redirect("docdata");
});
app.get("/docdata",(req,res)=>{
    res.render("docdata",{records})
});
        
//Server Port
app.listen(5000,()=>{
    console.log("Listening");
})