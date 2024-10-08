const {
    MongoClient 
} = require('mongodb')



url = "mongodb://localhost:27017",
    dbName = "userdb",
    mongodb = require("mongodb"),
    ObjectID = mongodb.ObjectId;

const docArray = [{
    username: 'super',
    password: "456",
    email: "super@chat.com",
    roles: ['superAdmin'],
    groups: []
},
{
    username: 'chatter1',
    password: "123",
    email: "chatter@chat.com",
    roles: ['user'],
    groups: []
},
]

const client = new MongoClient(url);
let db = client.db("userdb");
let myCol = db.collection("colName");


const awaitHeaven = async function(client, myCol) {
    //await myCol.insertMany(docArray);
    console.log(docArray);
    let result = await myCol.find({}).toArray();
    console.log(result);
    client.close();    
}
awaitHeaven(client, myCol)
