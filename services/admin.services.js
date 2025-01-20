const Admin = require('../model/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AdminService {
    // التحقق من وجود البريد الإلكتروني
    async findAdminByEmail(email) {
        return await Admin.findOne({ email });
    }

    // تسجيل حساب جديد
    async registerAdmin(adminData) {
        const { name, email, password } = adminData;

        const existingAdmin = await this.findAdminByEmail(email);
        if (existingAdmin) {
            throw new Error('Admin already registered with this email.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ name, email, password: hashedPassword });
        return await newAdmin.save();
    }

    // تسجيل الدخول
    async loginAdmin(email, password) {
        console.log(`Searching for admin with email: ${email}`);
        const admin = await Admin.findOne({ email });
        if (!admin) throw new Error('Admin not found');
    
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) throw new Error('Invalid credentials');

        // توليد الـ JWT وتقديمه عند النجاح
        const token = jwt.sign({ id: admin._id, role: admin.role }, 'secretKey', { expiresIn: '1h' });
        return { message: 'Login successful', token };
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
