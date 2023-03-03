const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [...allowedRoles]; 
        //console.log(rolesArray); //diff roles passed in 
        //console.log(req.roles); // previously set inside the verifyJWT 

        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);
        //map creates new array, for each role compare to rolesArray and see if it includes the role we are passing in. if it does, return true. 
        //Just need one true to allow access , so chain find : for each value check the value to see if its equal to true 

        if (!result) return res.sendStatus(401);
        next();
    }
}

module.exports = verifyRoles;