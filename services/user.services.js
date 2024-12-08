const UserModel = require('../model/user.model');
const jwt = require('jsonwebtoken');

class UserServices {
    static async registerUser(profilePicture,fullName, email, password, phoneNumber, gender, role,licensePicture,InsurancePicture, carNumber, carType) {
        try {
            // إنشاء بيانات المستخدم
            const userData = {profilePicture, fullName, email, password, phoneNumber, gender, role };

            // إضافة الحقول الخاصة بالسائق إذا كان الدور Driver
            if (role == 'Driver') {
                userData.carNumber = carNumber;
                userData.carType = carType;
                userData.licensePicture=licensePicture;
                userData.InsurancePicture=InsurancePicture;
            }
            const createUser = new UserModel(userData);
            return await createUser.save();
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    static async checkuser(email)
    {
        try {
            return await UserModel.findOne({email});
            
        } catch (error) {
            throw error;
        }
    }

    static async updateUserProfilePicture(email, profilePicture) {

        if (!email || !profilePicture) {
            throw new Error("Email and profilePicture are required");
        }

        try {
            const updatedUser = await UserModel.findOneAndUpdate(
                { email }, // البحث باستخدام البريد الإلكتروني
                { profilePicture }, // التحديث
                { new: true } // إعادة الوثيقة المُحدَّثة
            );
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    static async getProfilePictureByEmail(email) {
        if (!email) {
            throw new Error("Email is required");
        }
    
        try {
            // البحث عن المستخدم باستخدام البريد الإلكتروني
            const user = await UserModel.findOne({ email }, 'profilePicture'); // جلب الحقل "profilePicture" فقط
            if (!user) {
                throw new Error("User not found");
            }
            return user.profilePicture;
        } catch (error) {
            throw error;
        }
    }
    

    static async generateToken(tokenData,secretKey,jwt_expire)
    {
        return jwt.sign(tokenData,secretKey,{expiresIn:jwt_expire});
    }

}
module.exports = UserServices;
