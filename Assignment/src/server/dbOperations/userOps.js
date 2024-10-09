const { MongoClient,ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');

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


exports.profilePic = async function (req, res, client) {
    try {
        await client.connect();
        let db = client.db("userDb");
        let myCol = db.collection("users");

        // Check if a file was uploaded
        if (!req.files || !req.files.profilePicture) {
            console.error('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const profilePicture = req.files.profilePicture;
        const uploadDirectory = path.join(__dirname, '../uploads');

        // Ensure that the uploads directory exists
        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
            console.log('Created uploads directory');
        }

        // Set the relative path that will be stored in the database
        const uploadPath = `uploads/${profilePicture.name}`;

        // Move the file to the uploads directory
        profilePicture.mv(path.join(__dirname, '../', uploadPath), async (err) => {
            if (err) {
                console.error('Error saving file:', err); // Detailed error logging
                return res.status(500).json({ message: 'Error saving file', error: err });
            }

            // Retrieve the username from the request body
            const username = req.body.username;
            if (!username) {
                console.error('Username is missing');
                return res.status(400).json({ message: 'Username is missing' });
            }

            console.log('Updating database for user:', username); // Log which user is being updated

            // Save the relative file path to the database using the username
            const updateResult = await myCol.updateOne(
                { username: username },
                { $set: { profilePicture: uploadPath } }
            );

            console.log('Database update result:', updateResult); // Log the result of the database update
            res.json({ message: 'Profile picture uploaded successfully', filePath: uploadPath });
            client.close();
        });
    } catch (error) {
        console.error('Unexpected error during file upload:', error); // Log unexpected server errors
        res.status(500).json({ message: 'Server error during file upload', error: error });
    }
}

exports.getProfilePicture = async function (req, res, client) {
    try {
        await client.connect();
        let db = client.db("userDb");
        let myCol = db.collection("users");

        const username = req.query.username;
        const user = await myCol.findOne({ username: username });

        if (user && user.profilePicture) {
            res.json({ filePath: user.profilePicture });
        } else {
            res.status(404).json({ message: 'Profile picture not found' });
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error);
        res.status(500).json({ message: 'Server error', error: error });
    } finally {
        client.close();
    }
}