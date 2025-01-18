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

        // التحقق من أن البريد الإلكتروني غير موجود مسبقًا
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
        const admin = await Admin.findOne({ email });
        if (!admin) throw new Error('Admin not found');

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) throw new Error('Invalid credentials');

        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
            expiresIn: '1d',
        });

        return { token, admin };
    }

    // جلب جميع المستخدمين
    async getAllUsers() {
        // افتراض أن لديك نموذج User لعرض جميع المستخدمين
        const users = await User.find();
        return users;
    }
}

module.exports = new AdminService();
