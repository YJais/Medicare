const {MongoClient}=require("mongodb");
async function getconnect(){
        const client=new MongoClient("mongodb://localhost:27017/medicare");
         let con=await client.connect();
         let db=con.db("medicare");
         let collection=db.collection("clientdata");
         return collection;
}
async function admin(){
        const client=new MongoClient("mongodb://localhost:27017/medicare");
         let con=await client.connect();
         let db=con.db("medicare");
         let collection=db.collection("admindata");
         return collection;
}
module.exports=getconnect;
module.exports=admin;