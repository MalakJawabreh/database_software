const adminService = require('../services/admin.services');

class AdminController {
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

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await adminService.loginAdmin(email, password);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ message: error.message });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await adminService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new AdminController();
