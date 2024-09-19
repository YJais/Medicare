const express = require('express');
const {getconnect,admin,doctor,patient}= require('./dbconnect');
// const admin= require('./dbconnect');
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
// app.get("/login",(req,res)=>{
//     res.render("login",{errors:{}});
// });


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
    if (user.usrpass !== upass) {
        errors.password = "Incorrect password.";
        console.log("Incorrect password.");
        return res.render("login", { errors });
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

//admin

app.get("/login_admin",(req,res)=>{
    res.render("login_admin");
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

app.get("/docdata",async (req,res)=>{
    let collection=await doctor();
    let records=await collection.find({}).toArray();
    // console.log(records);
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
    let collection=await doctor();
    let r=await collection.insertOne({
        doc_id:d_id,
        doc_name:d_name,
        doc_desig:d_desig,
        doc_sal:d_sal,
        doc_dept:d_dept
    });
    let records=await collection.find({}).toArray();
    res.render("docdata",{records});
});
app.get("/deletedocdata",(req,res)=>{
    res.render("deletedocdata");
});

app.get("/del",async (req,res)=>{
    let d_id=req.query.doc_id;
    let collection=await doctor();
    let r=await collection.deleteOne({doc_id:d_id});
    let records=await collection.find({}).toArray();
	   res.render("docdata",{records});
});

// app.get("/updatedocdata",(req,res)=>{
//     res.render("updatedocdata");
// });

// app.post("/updateres",async (req,res)=>{
//    let d_id=req.body.d_id;
//    let d_name=req.body.d_name;
//    let d_desig=req.body.d_name;
//    let d_sal=req.body.d_sal;
//    let collection=await doctor();
//    let r=await collection.updateOne({id:d_id},{$set:{name:d_name,designation:d_desig,salary:d_sal}});
//    let records=await collection.find({}).toArray();
//    res.render("docdata",{records});
// });

// app.get("/updatedocdata", async (req, res) => {
//     let doc_id = req.query.d_id; // Assuming you're passing the doctor ID via query parameter
//     let collection = await doctor(); // Access the 'doctors' collection

//     // Find the doctor record by ID
//     let rec = await collection.findOne({ doc_id: doc_id });

//     // Check if the doctor was found
//     if (!rec) {
//         return res.status(404).send("Doctor not found.");
//     }

//     // Pass the doctor's record to the EJS template
//     res.render("updatedocdata", { rec });
// });

app.get("/updatedocdata", async (req, res) => {
    let doc_id = req.query.d_id; // Assuming you're passing the doctor ID via query parameter
    let collection = await doctor(); // Access the 'doctors' collection

    // Find the doctor record by ID
    let rec = await collection.findOne({ doc_id: doc_id });

    // Check if the doctor was found
    if (!rec) {
        return res.status(404).send("Doctor not found.");
    }

    // Pass the doctor's record to the EJS template
    res.render("updatedocdata", { rec });
});

app.post("/updateres", async (req, res) => {
    let d_id = req.body.d_id;
    let d_name = req.body.d_name;
    let d_desig = req.body.d_desig;
    let d_sal = req.body.d_sal;
    let collection = await doctor();

    // Update doctor details
    await collection.updateOne({ doc_id: d_id }, { $set: { doc_name: d_name, doc_desig: d_desig, doc_sal: d_sal } });

    // Fetch updated records
    let records = await collection.find({}).toArray();
    res.render("docdata", { records });
});


        
//Server Port
app.listen(5000,()=>{
    console.log("Listening");
})