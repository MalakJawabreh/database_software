const UserServices = require("../services/user.services");

exports.register = async (req, res, next) => {
    try {
        const {profilePicture, fullName, email,location, password, phoneNumber, gender, role,licensePicture,InsurancePicture, carNumber, carType } = req.body;

        if (!fullName || !email || !password || !phoneNumber || !gender || !role) {
            return res.status(400).json({ status: false, error: "All fields are required." });
        }

        if (role === 'Driver' && (!carNumber || !carType)) {
            return res.status(400).json({ status: false, error: "Vehicle number and vehicle type are required for drivers." });
        }

        const successRes = await UserServices.registerUser(profilePicture,fullName, email,location, password, phoneNumber, gender, role,licensePicture,InsurancePicture, carNumber, carType);

        res.json({ status: true, success: "User Registered Successfully" });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};

exports.updateProfilePicture = async (req, res, next) => {
    try {

        console.log('Request Body:', req.body);

        const email = req.body.email;
        const profilePicture = req.body.profilePicture; // assuming profile picture URL is sent as form-data with key 'profilePicture'

        const updatedUser = await UserServices.updateUserProfilePicture(email, profilePicture);

        res.status(200).json({ status: true, success: "تم تحديث صورة الملف الشخصي بنجاح", user: updatedUser });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};

exports.updatelocation = async (req, res, next) => {
    try {

        console.log('Request Body:', req.body);

        const email = req.body.email;
        const location = req.body.location; // assuming profile picture URL is sent as form-data with key 'profilePicture'

        const updatedUser = await UserServices.updatelocation(email, location);

        res.status(200).json({ status: true, success: "location updated", user: updatedUser });
    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};

exports.getProfilePicture = async (req, res, next) => {
    try {
        const { email } = req.query; // الحصول على البريد الإلكتروني من الـ Query Parameters

        if (!email) {
            return res.status(400).json({ status: false, error: "Email is required" });
        }

        const profilePicture = await UserServices.getProfilePictureByEmail(email);

        res.status(200).json({
            status: true,
            success: "Profile picture fetched successfully",
            profilePicture: profilePicture,
        });
    } catch (error) {
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

        let tokenData = {_id:user._id,email:user.email,role:user.role,fullName:user.fullName,phoneNumber:user.phoneNumber,licensePicture:user.licensePicture,profilePicture:user.profilePicture,InsurancePicture:user.InsurancePicture,carType:user.carType};
        const token = await UserServices.generateToken(tokenData,'secretKey','1h')

        res.status(200).json({status:true,token:token, role: user.role ,fullName:user.fullName,phoneNumber:user.phoneNumber,licensePicture:user.licensePicture,profilePicture:user.profilePicture,InsurancePicture:user.InsurancePicture,carType:user.carType });

    } 
    catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};

exports.getUserDetails = async (req, res, next) => {
    try {
        const { email } = req.query; // الحصول على الإيميل من Query Parameters

        if (!email) {
            return res.status(400).json({ status: false, error: "Email is required" });
        }

        const userDetails = await UserServices.getUserByEmail(email);

        res.status(200).json({
            status: true,
            success: "User details fetched successfully",
            user: userDetails,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};
