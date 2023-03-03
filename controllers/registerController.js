// FOR REFERENCE ONLY: if using JSON data
// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {
//         this.users = data
//     }
// }
// const fsPromises = require('fs').promises;
// const path = require('path');

const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({'message': 'Username and password are required'});

    //check for duplicate username in DB
    //const duplicate = usersDB.users.find(person => person.username === user); 
    const duplicate = await User.findOne({ username: user }).exec();  // exec needed when using async await with findOne
    if (duplicate) return res.sendStatus(409); //conflict status code

    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

// FOR REFERENCE ONLY: if using JSON
        // store the new user
        // const newUser = { 
        //     "username": user, 
        //     "roles": { "User": 2001 },
        //     "password": hashedPwd
        // };

        // usersDB.setUsers([...usersDB.users, newUser]); 

        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // )
        // console.log(usersDB.users);

        const result = await User.create({ // create and store the new user
            "username": user,
            "password": hashedPwd
            //role value and id will auto generate based on our schema
        })

        console.log(result);

        res.status(201).json({'success': `New User ${user} created! `});


    } catch (err) {
        res.status(500).json({'message': err.message });
    }
}

module.exports = { handleNewUser };