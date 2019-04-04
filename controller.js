function createNewUser(userId, email) {
    var updates = {};
    updates['/users/' + userId] = {email: email};

    return database.update(updates);
}

/* This function returns a new key that can be used to create a new dish */
function getNewDishKey() {
    return database.child('dishes').push().key;
}

exports.createDish = async (req, res) => {
    const userId = req.params.userId;
    const name = req.body.name;
    const category = req.body.category;

    const key = await getNewDishKey();

    var responseObject = {id: key};

    res.location('http://localhost:5000/api/users/' + userId + '/dish/' + key);
    res.status(201).send(JSON.stringify(responseObject));
};
