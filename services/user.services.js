const UserModel = require('../model/user.model');
const jwt = require('jsonwebtoken');

class UserServices {
    static async registerUser(fullName, email, password, phoneNumber, gender, role, carNumber, carType) {
        try {
            // إنشاء بيانات المستخدم
            const userData = { fullName, email, password, phoneNumber, gender, role };

            // إضافة الحقول الخاصة بالسائق إذا كان الدور Driver
            if (role == 'Driver') {
                userData.carNumber = carNumber;
                userData.carType = carType;
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

    static async generateToken(tokenData,secretKey,jwt_expire)
    {
        return jwt.sign(tokenData,secretKey,{expiresIn:jwt_expire});
    }
}
module.exports = UserServices;
