const adminService = require('../services/admin.services');

class AdminController {
    // تسجيل إدمن جديد
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
    
            // التحقق من وجود الإيميل وكلمة المرور في الطلب
            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Email, name and password are required.' });
            }
    
            // التحقق إذا كان الحساب موجودًا بالفعل
            const existingAdmin = await adminService.findAdminByEmail(email);
            if (existingAdmin) {
                return res.status(400).json({ message: 'Admin already registered with this email.' });
            }
    
            // إذا لم يكن موجودًا، إنشاء حساب جديد
            const admin = await adminService.registerAdmin(name, email, password);  // تعديل هنا
            res.status(201).json({ message: 'Admin registered successfully', admin });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    

   
      async login (req, res) {
            try {
                const {email, password} = req.body;
        
                const admin = await adminService.checkuser(email);
        
                
                if (!admin) {
                    // إرسال رسالة عند عدم وجود المستخدم
                    return res.status(400).json({ 
                        status: false, 
                        message: 'Email does not exist' 
                    });
                }
        
                const isMatch = await admin.comparePassword(password);
        
                if (!isMatch) {
                    // إرسال رسالة عند كون كلمة المرور غير صحيحة
                    return res.status(400).json({ 
                        status: false, 
                        message: 'Invalid password' 
                    });
                }
        
                let tokenData = ({ id: admin._id, role: admin.role });
                const token = await adminService.generateToken(tokenData,'secretKey','1h')
        
                res.status(200).json({status:true,token:token});
       
            }  catch (error) {
                console.error(error);
                res.status(400).json({ status: false, error: error.message });
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
            const { id } = req.params;
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
            const { id } = req.params;

            const deletedAdmin = await adminService.deleteAdmin(id);
            res.status(200).json({ message: 'Admin deleted successfully', deletedAdmin });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = new AdminController();