const Admin = require('../model/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AdminService {
    // التحقق من وجود البريد الإلكتروني
    async findAdminByEmail(email) {
        return await Admin.findOne({ email });
    }

   
         async registerAdmin(name,email, password) {
            try {
                // إنشاء بيانات المستخدم
                const adminData = {name, email, password };
    
                // إضافة الحقول الخاصة بالسائق إذا كان الدور Driver

                const createUser = new Admin(adminData);
                return await createUser.save();
            } catch (err) {
                console.error("Error in registering user:", err);
                throw err;
            }
        }
     async checkuser(email) {
        try {
            return await Admin.findOne({ email });
        } catch (error) {
            throw error;
        }
    }
 async generateToken(tokenData, secretKey, jwt_expire) {
        try {
            return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire });
        } catch (error) {
            console.error("Error in generating token:", error);
            throw error;
        }
    }
    

    // جلب جميع الإدمنين
    async getAllAdmins() {
        return await Admin.find({}, { password: 0 });
    }

    // تعديل بيانات الإدمن
    async updateAdmin(adminId, updateData) {
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });
        if (!updatedAdmin) throw new Error('Admin not found');
        return updatedAdmin;
    }

    // حذف إدمن
    async deleteAdmin(adminId) {
        const deletedAdmin = await Admin.findByIdAndDelete(adminId);
        if (!deletedAdmin) throw new Error('Admin not found');
        return deletedAdmin;
    }

    // التحقق من صلاحيات الإدمن
    async isAdmin(adminId) {
        const admin = await Admin.findById(adminId);
        return admin?.role === 'admin';
    }
}

module.exports = new AdminService();
