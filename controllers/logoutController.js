// FOR REFERENCE ONLY, JSONDB version
// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {
//         this.users = data
//     }
// }

// const fsPromises = require('fs').promises;
// const path = require('path');

const User = require('../model/User');


const handleLogout = async (req, res) => {
// on client: also delete the access token  which is in the memory 


    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt;

    // is refresh token in the db?
    //const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt', { httpOnly: true, sameSite:'None', secure:true });
        return res.sendStatus(204);
    }

    // Delete refresh token in the db - JSON DB version
    // const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    // const currentUser = { ...foundUser, refreshToken: ''};

    // usersDB.setUsers([...otherUsers, currentUser]);
    // await fsPromises.writeFile(
    //     path.join(__dirname, '..', 'model', 'users.json'),
    //     JSON.stringify(usersDB.users)
    // );

    foundUser.refreshToken = ''; //Delete refresh token in the db 
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true}) // production mode
    //res.clearCookie('jwt', { httpOnly: true, sameSite: 'None'})  // dev mode
    // secure:true - only serves on https

    res.sendStatus(204);
}

module.exports = { handleLogout };