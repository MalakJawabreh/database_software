const nodemailer = require('nodemailer');
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
         // إعداد بريد إلكتروني للإرسال
         const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'maakwassalni@gmail.com',  // بريدك الإلكتروني
                pass: 'bysg qfzv vobk fscq'    // كلمة المرور الخاصة ببريدك
            }
        });

        // إعداد محتوى الرسالة
        const mailOptions = {
            from: 'maakwassalni@gmail.com',  // نفس البريد الإلكتروني
            to: email,                     // البريد الإلكتروني للمستخدم
            subject: 'Account Registration Successful',
            text: `Hello ${fullName},\n\nYour account has been successfully registered.\n\nThank you for using our service!`
        };

        // إرسال البريد الإلكتروني
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

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

        
        if (!user) {
            // إرسال رسالة عند عدم وجود المستخدم
            return res.status(400).json({ 
                status: false, 
                message: 'Email does not exist' 
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            // إرسال رسالة عند كون كلمة المرور غير صحيحة
            return res.status(400).json({ 
                status: false, 
                message: 'Invalid password' 
            });
        }

        let tokenData = {_id:user._id,gender:user.gender,email:user.email,role:user.role,fullName:user.fullName,phoneNumber:user.phoneNumber,licensePicture:user.licensePicture,profilePicture:user.profilePicture,InsurancePicture:user.InsurancePicture,carType:user.carType};
        const token = await UserServices.generateToken(tokenData,'secretKey','1h')

        res.status(200).json({status:true,token:token,gender:user.gender, role: user.role ,fullName:user.fullName,phoneNumber:user.phoneNumber,licensePicture:user.licensePicture,profilePicture:user.profilePicture,InsurancePicture:user.InsurancePicture,carType:user.carType });

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

exports.getAllDrivers = async (req, res, next) => {
    try {
        const drivers = await UserServices.getAllDrivers();

        res.status(200).json({
            status: true,
            success: "Drivers fetched successfully",
            drivers: drivers,
        });
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(400).json({ status: false, error: error.message });
    }
};

