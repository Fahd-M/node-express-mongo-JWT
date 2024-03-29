// REFERNCE ONLY TO JSON DB 
//For the refresh token route
// const usersDB = {
//     users: require('../model/users.json'),
//     setUsers: function (data) {
//         this.users = data
//     }
// }

const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    // console.log(cookies.jwt);

    const refreshToken = cookies.jwt;


    //find the user that has been sent in
    //const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden

    //evaluate JWT 
    jwt.verify(
        refreshToken, 
        process.env.REFRESH_TOKEN_SECRET, 
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const roles = Object.values(foundUser.roles);

            const accessToken = jwt.sign(
                { 
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '45s' }
            );
            res.json({  roles, accessToken })
        }
    );
}

module.exports = { handleRefreshToken };