const { MongoClient,ObjectId } = require('mongodb');

exports.insert = async function (req, res, client) {
    await client.connect();
    console.log("client connected");
    let db = await client.db("userDb")
        myCol = await db.collection("users");

    const existingUser = await myCol.findOne({username: req.body.username})
    if (existingUser) {
        return res.status(409).json({ message: 'Username already exists. Please choose a different one.' });
    }

    const newUser = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        groups: req.body.groups || [],
        roles: req.body.roles || []
    };
    await myCol.insertOne(newUser);
    console.log("Inserted the following document into the collection")
    console.log(newUser);
    res.send(newUser);
    client.close();
}

exports.find = async function (req, res, client) {
    await client.connect();
    let db = client.db("userDb");
        myCol = await db.collection("users");
    const docs = await myCol.find({}).toArray();
    console.log("found documents => " + docs);
    res.send(docs);
    client.close();
}

exports.update = async function (req, res, client) {
    console.log(req.body);
    await client.connect();

    let db = client.db("userDb");
    myCol = await db.collection("users"); 

    let queryJSON = req.body.query;
    let updateJSON = req.body.update;

    result = await db.collection("users").updateMany(queryJSON, {
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
    myCol = await db.collection("users"); 

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

exports.login = async function (req, res, client) {
    await client.connect();
    let db = client.db("userDb");
        myCol = await db.collection("users");
    let input = req.body.username;
    const user = await myCol.findOne({username: req.body.username});
    const docs = await myCol.find({}).toArray();
    console.log("found documents => " + docs);
    //console.log(myCol);

    try {        
        if (!user || user.password !== req.body.password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        res.json({ 
            message: 'Login successful',
            user: {
                username: user.username,
                email: user.email,
                roles: user.roles,
                groups: user.groups
            }
        });

    } catch (err) {
        console.log("Error during login", err);
        res.status(500).json({ message: "Server error" });
    } finally {
        client.close();
    }    
}