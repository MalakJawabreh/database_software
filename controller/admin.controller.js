const adminService = require('../services/admin.services');

class AdminController {
    // تسجيل إدمن جديد
    async register(req, res) {
        try {
            const { email } = req.body;

            // التحقق إذا كان الحساب موجودًا بالفعل
            const existingAdmin = await adminService.findAdminByEmail(email);
            if (existingAdmin) {
                return res.status(400).json({ message: 'Admin already registered with this email.' });
            }

            // إذا لم يكن موجودًا، إنشاء حساب جديد
            const admin = await adminService.registerAdmin(req.body);
            res.status(201).json({ message: 'Admin registered successfully', admin });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // تسجيل الدخول
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await adminService.loginAdmin(email, password);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    // جلب جميع الإدمنين
    async getAllAdmins(req, res) {
        try {
            const admins = await adminService.getAllAdmins();
            res.status(200).json(admins);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // تعديل بيانات إدمن
    async updateAdmin(req, res) {
        try {
            const { id } = req.params; // معرف الإدمن
            const updateData = req.body;

            const updatedAdmin = await adminService.updateAdmin(id, updateData);
            res.status(200).json({ message: 'Admin updated successfully', updatedAdmin });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // حذف إدمن
    async deleteAdmin(req, res) {
        try {
            const { id } = req.params; // معرف الإدمن

            const deletedAdmin = await adminService.deleteAdmin(id);
            res.status(200).json({ message: 'Admin deleted successfully', deletedAdmin });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new AdminController();
