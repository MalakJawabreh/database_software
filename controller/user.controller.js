const UserServices = require("../services/user.services");

exports.register = async (req, res, next) => {
    try {
        const {profilePicture, fullName, email, password, phoneNumber, gender, role,licensePicture,InsurancePicture, carNumber, carType } = req.body;

        if (!fullName || !email || !password || !phoneNumber || !gender || !role) {
            return res.status(400).json({ status: false, error: "All fields are required." });
        }

        if (role === 'Driver' && (!carNumber || !carType)) {
            return res.status(400).json({ status: false, error: "Vehicle number and vehicle type are required for drivers." });
        }

        const successRes = await UserServices.registerUser(profilePicture,fullName, email, password, phoneNumber, gender, role,licensePicture,InsurancePicture, carNumber, carType);

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
exports.changePassword = async (req, res, next) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ status: false, error: "All fields are required." });
        }

        const user = await UserServices.checkuser(email);

        if (!user) {
            return res.status(404).json({ status: false, error: "User not found." });
        }

        // تحقق من صحة كلمة المرور القديمة
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ status: false, error: "Old password is incorrect." });
        }

        // تحديث كلمة المرور الجديدة
        await UserServices.updatePassword(user, newPassword);

        res.status(200).json({ status: true, success: "Password changed successfully." });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};
exports.blockUser = async (req, res, next) => {
    try {
        const { userId, blockedUserId } = req.body;

        if (!userId || !blockedUserId) {
            return res.status(400).json({ status: false, error: 'User ID and Blocked User ID are required.' });
        }

        const user = await UserServices.blockUser(userId, blockedUserId);
        res.status(200).json({ status: true, success: 'User blocked successfully', user });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};
exports.unblockUser = async (req, res, next) => {
    try {
        const { userId, blockedUserId } = req.body;

        if (!userId || !blockedUserId) {
            return res.status(400).json({ status: false, error: 'User ID and Blocked User ID are required.' });
        }

        const user = await UserServices.unblockUser(userId, blockedUserId);
        res.status(200).json({ status: true, success: 'User unblocked successfully', user });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};


