const { MongoClient,ObjectId } = require('mongodb');

exports.insert = async function (req, res, client) {
    let doc = req.body;
    await client.connect();
    console.log("client connected");
    let db = await client.db("userDb")
        myCol = await db.collection("groups");
    await myCol.insertOne(doc);
    console.log("Inserted the following document into the collection")
    console.log(doc);
    res.send(doc);
    client.close();
}

exports.find = async function (req, res, client) {
    await client.connect();
    let db = client.db("userDb");
        myCol = await db.collection("groups");
    const docs = await myCol.find({}).toArray();
    console.log("found documents => " + docs);
    res.send(docs);
    client.close();
}

exports.update = async function (req, res, client) {
    console.log(req.body);
    await client.connect();

    let db = client.db("userDb");
    myCol = await db.collection("groups"); 

    let queryJSON = req.body.query;
    let updateJSON = req.body.update;

    result = await db.collection("groups").updateMany(queryJSON, {
        $set: updateJSON
    });
    console.log("For the documents with ", queryJSON);
    console.log("SET: ", updateJSON);
    res.send(result);
    client.close();
}

exports.delete = async function (req, res, client) {
    await client.connect();

    let db = client.db("userDb");
    myCol = await db.collection("groups"); 

    let queryJSON = req.body;
    console.log(queryJSON);
    console.log(queryJSON._id);
    queryJSON._id = new ObjectId(queryJSON._id);
    console.log(queryJSON._id);

    let result = await myCol.deleteMany(queryJSON);
    console.log("Removed the documents with: ", queryJSON, result);
    res.send(queryJSON);
    client.close(0);
}