const UserModel = require('../model/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserServices {
    static async registerUser(profilePicture,fullName, email,location, password, phoneNumber, gender, role,licensePicture,InsurancePicture, carNumber, carType) {
        try {
            // إنشاء بيانات المستخدم
            const userData = {profilePicture, fullName, email,location, password, phoneNumber, gender, role };

            // إضافة الحقول الخاصة بالسائق إذا كان الدور Driver
            if (role == 'Driver') {
                userData.carNumber = carNumber;
                userData.carType = carType;
                userData.licensePicture = licensePicture;
                userData.InsurancePicture = InsurancePicture;
            }

            const createUser = new UserModel(userData);
            return await createUser.save();
        } catch (err) {
            console.error("Error in registering user:", err);
            throw err;
        }
    }

    static async checkuser(email) {
        try {
            return await UserModel.findOne({ email });
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
            console.error("Error in updating profile picture:", error);
            throw error;
        }
    }

    static async updatelocation(email, location) {

        if (!email || !location) {
            throw new Error("Email and profilePicture are required");
        }

        try {
            const updatedUser = await UserModel.findOneAndUpdate(
                { email }, // البحث باستخدام البريد الإلكتروني
                { location }, // التحديث
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
            const user = await UserModel.findOne({ email }, 'profilePicture');
            if (!user || !user.profilePicture) {
                return null; // إذا لم تكن الصورة موجودة
            }
            return user.profilePicture;
        } catch (error) {
            throw error;
        }
    }
    

    static async getUserByEmail(email) {
        if (!email) {
            throw new Error("Email is required");
        }
    
        try {
            const user = await UserModel.findOne({ email }); // جلب جميع معلومات المستخدم
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            throw error;
        }
    }
    


    static async generateToken(tokenData, secretKey, jwt_expire) {
        try {
            return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire });
        } catch (error) {
            console.error("Error in generating token:", error);
            throw error;
        }
    }



    static async updatePassword(user, newPassword) {
        try {
            // التحقق من أن كلمة المرور الجديدة تتوافق مع القواعد
            const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
            if (!passwordRegex.test(newPassword)) {
                throw new Error('Password must contain at least one letter, one number, and be at least 8 characters long');
            }
    
            // تشفير كلمة المرور الجديدة
            const salt = await bcrypt.genSalt(12);
            const hashPass = await bcrypt.hash(newPassword, salt);
    
            // تحديث كلمة المرور باستخدام updateOne مع bypass validation
            await UserModel.updateOne({ _id: user._id }, { password: hashPass });
    
        } catch (error) {
            console.error("Error in updating password:", error);
            throw error;
        }
    }
    static async blockUser(userId, blockedUserId) {
        try {
            const user = await UserModel.findById(userId);
    
            if (!user) {
                throw new Error('User not found');
            }
    
            // التحقق من أن المستخدم الآخر ليس محظورًا بالفعل
            if (user.blockedUsers.includes(blockedUserId)) {
                throw new Error('User is already blocked');
            }
    
            // إضافة المستخدم إلى القائمة
            user.blockedUsers.push(blockedUserId);
            await user.save();
    
            return user;
        } catch (error) {
            console.error('Error in blocking user:', error);
            throw error;
        }
    }
static async unblockUser(userId, blockedUserId) {
    try {
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        // إزالة المستخدم من القائمة
        user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== blockedUserId.toString());
        await user.save();

        return user;
    } catch (error) {
        console.error('Error in unblocking user:', error);
        throw error;
    }
}

static async getAllDrivers() {
    try {
        return await UserModel.find({ role: 'Driver' });
    } catch (error) {
        console.error('Error fetching drivers:', error);
        throw error;
    }
}
static async getAllUsers() {
    try {
        return await UserModel.find(); // يجلب جميع المستخدمين
    } catch (error) {
        console.error('Error fetching all users:', error);
        throw error;
    }
}
static async getAllPassengers() {
    try {
        return await UserModel.find({ role: 'Passenger' });
    } catch (error) {
        console.error('Error fetching passengers:', error);
        throw error;
    }
}
static async addUser(userData) {
    try {
        const newUser = new UserModel(userData);
        return await newUser.save();
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

static async updateUserById(userId, updateData) {
    try {
        return await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

static async deleteUserById(userId) {
    try {
        return await UserModel.findByIdAndDelete(userId);
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}
static async getTotalUsers() {
    try {
        return await UserModel.countDocuments(); // Counts all users
    } catch (error) {
        console.error('Error fetching total users:', error);
        throw error;
    }
}

static async getActiveUsers() {
    try {
        return await UserModel.countDocuments({ active: true }); // Counts only active users
    } catch (error) {
        console.error('Error fetching active users:', error);
        throw error;
    }
}





}

module.exports = UserServices;
