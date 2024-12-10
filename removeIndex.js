const mongoose = require('mongoose');
const TripModel = require('./model/bookingtripP.model'); // قم بتحديث المسار ليشير إلى ملف النموذج الخاص بـ TripModel

const removePhoneNumberIndex = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/db_software'); // ضع رابط الاتصال بقاعدة البيانات الخاصة بك
        console.log('Connected to MongoDB.');

        // إزالة الفهرس
        await TripModel.collection.dropIndex('phoneNumberD_1');
        console.log('Index "phoneNumberD_1" has been removed.');

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    } catch (error) {
        console.error('Error removing index:', error.message);
    }
};

removePhoneNumberIndex();
