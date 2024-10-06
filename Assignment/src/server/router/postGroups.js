var fs = require('fs');

module.exports = function(req, res) {

    let groupObj = {
        "groupName": req.body.groupName,
        "admins": req.body.admins
    }

    let gArray = [];
    fs.readFile('./data/groups.json', 'utf8', function(err, data) {
        if (err) throw err;
        gArray = JSON.parse(data);
        console.log(gArray);

        let i = gArray.findIndex(x => x.groupName == groupObj.groupName);
        if (i == -1) {
            gArray.push(groupObj);
        } else {
            gArray[i] = groupObj;
        }
        res.send(gArray);
        let gArrayjson = JSON.stringify(gArray);
        fs.writeFile('./data/groups.json', gArrayjson, 'utf8', function(err) {
            if (err) throw err;
        })
    })

    
}