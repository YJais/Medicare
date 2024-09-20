const {MongoClient}=require("mongodb");
async function getcollection(collectionname){
        const client=new MongoClient("mongodb://localhost:27017/medicare");
         let con=await client.connect();
         let db=con.db("medicare");
         let collection=db.collection(collectionname);
         return collection;
}
async function getconnect(){
          return await getcollection("clientdata");
}
async function docdetail(){
          return await getcollection("doctorsdetails");
}
async function admin(){
          return await getcollection("admindata");
}
async function doctor(){
          return await getcollection("doctordata");
}
async function patient(){
          return await getcollection("patientdata");
}
async function appointment(){
          return await getcollection("appointmentdata");
}
module.exports={getconnect,docdetail,admin,doctor,patient,appointment};
