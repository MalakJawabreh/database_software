const UserServices = require("../services/user.services");

exports.register = async (req, res, next) => {
    try {
        const { fullName, email, password, phoneNumber, gender, role, carNumber, carType } = req.body;

        if (!fullName || !email || !password || !phoneNumber || !gender || !role) {
            return res.status(400).json({ status: false, error: "All fields are required." });
        }

        if (role === 'Driver' && (!carNumber || !carType)) {
            return res.status(400).json({ status: false, error: "Vehicle number and vehicle type are required for drivers." });
        }

        const successRes = await UserServices.registerUser(fullName, email, password, phoneNumber, gender, role, carNumber, carType);

        res.json({ status: true, success: "User Registered Successfully" });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const user = await UserServices.checkuser(email);

        if(!user)
        {
            throw new Error('User not exist');
        }

        const isMatch = await user.comparePassword(password);

        if(isMatch === false)
        {
            throw new Error('Password Invalid');
        }

        let tokenData = {_id:user._id,email:user.email,role:user.role,fullName:user.fullName};
        const token = await UserServices.generateToken(tokenData,'secretKey','1h')

        res.status(200).json({status:true,token:token, role: user.role ,fullName:user.fullName });

    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};
