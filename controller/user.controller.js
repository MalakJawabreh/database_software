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

        if (!profilePicture) {
            return res.status(404).json({ status: false, error: "Profile picture not found" });
        }

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
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await UserServices.getAllUsers();

        res.status(200).json({
            status: true,
            success: "All users fetched successfully",
            users: users,
        });
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(400).json({ status: false, error: error.message });
    }
};

exports.getAllPassengers = async (req, res, next) => {
    try {
        const passengers = await UserServices.getAllPassengers();

        res.status(200).json({
            status: true,
            success: "Passengers fetched successfully",
            passengers: passengers,
        });
    } catch (error) {
        console.error('Error fetching passengers:', error);
        res.status(400).json({ status: false, error: error.message });
    }
};
exports.addUser = async (req, res, next) => {
    try {
        const { profilePicture, fullName, email, location, password, phoneNumber, gender, role, licensePicture, InsurancePicture, carNumber, carType } = req.body;

        if (role === 'Driver' && (!carNumber || !carType)) {
            return res.status(400).json({ status: false, error: "Vehicle details are required for drivers." });
        }

        const userData = { profilePicture, fullName, email, location, password, phoneNumber, gender, role, licensePicture, InsurancePicture, carNumber, carType };
        const newUser = await UserServices.addUser(userData);

        res.status(201).json({ status: true, success: "User added successfully.", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const updateData = req.body;

        const updatedUser = await UserServices.updateUserById(userId, updateData);

        if (!updatedUser) {
            return res.status(404).json({ status: false, error: "User not found." });
        }

        res.status(200).json({ status: true, success: "User updated successfully.", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const deletedUser = await UserServices.deleteUserById(userId);

        if (!deletedUser) {
            return res.status(404).json({ status: false, error: "User not found." });
        }

        res.status(200).json({ status: true, success: "User deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};
exports.getTotalUsers = async (req, res, next) => {
    try {
        const totalUsers = await UserServices.getTotalUsers();
        res.status(200).json({ status: true, totalUsers });
    } catch (error) {
        console.error('Error fetching total users:', error);
        res.status(500).json({ status: false, error: error.message });
    }
};

exports.getActiveUsers = async (req, res, next) => {
    try {
        const activeUsers = await UserServices.getActiveUsers();
        res.status(200).json({ status: true, activeUsers });
    } catch (error) {
        console.error('Error fetching active users:', error);
        res.status(500).json({ status: false, error: error.message });
    }
};




