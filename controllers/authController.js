// REFERENCE ONLY JSON DB VERSION
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
const jwt = require('jsonwebtoken');


const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({'message': 'Username and password are required'});

    //find the user that has been sent in
    //const foundUser = usersDB.users.find(person => person.username === user);
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); //unauthorized

    //evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if(match) {
        const roles = Object.values(foundUser.roles);

        //create JWTs to send and use with other protected routes also 
        const accessToken = jwt.sign(
            { 
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles,
                }
            },
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '45s' } // 5 min or 15 min in production
        );

        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '1d' } 
        );

        //save refresh token in the db with current user
        //JSON DB VERSION
        // const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        // const currentUser = { ...foundUser, refreshToken };

        // usersDB.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
        //     path.join(__dirname, '..', 'model', 'users.json'),
        //     JSON.stringify(usersDB.users)
        // );
        
        foundUser.refreshToken = refreshToken; //Saving refreshToken with current user
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite:'None', secure:true,  maxAge: 24 * 60 * 60 * 1000}); // for production. make sure to match the logout and refresh token controllers too.
        //maxAge is 1day 
        
        //res.cookie('jwt', refreshToken, { httpOnly: true, sameSite:'None',  maxAge: 24 * 60 * 60 * 1000}); 
        // this version when testing in postman or thunderclient while in dev mode
        // secure:true - only serves on https

        res.json({ accessToken }); // on front end you store this accessToken in memory - not secure in localstorage or cookie. 

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };