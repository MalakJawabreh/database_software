const TripModel = require('../model/tripD.model');
const BookTrip= require('../model/bookingtripP.model');
const UserModel = require('../model/user.model'); // استيراد نموذج المستخدم

const moment = require('moment'); // للتعامل مع التواريخ والأوقات

class TripServices {
    // إنشاء رحلة جديدة
    static async createTrip(name,driverEmail,phoneNumber, from, to, price, maxPassengers,currentPassengers, date, time,carBrand,visibilty_trip) {
        try {
            const currentDateTime = moment();
            const tripDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD hh:mmA');

            // تحديد حالة الرحلة
            const status_trip = tripDateTime.isAfter(currentDateTime) ? 'upcoming' : 'completed';

            // التحقق من وجود رحلة مكررة
            const isDuplicate = await TripModel.findOne({
                name,
                driverEmail,
                phoneNumber,
                from,
                to,
                price,
                maxPassengers,
                currentPassengers,
                date,
                time,
                carBrand,
                visibilty_trip
            });

            if (isDuplicate) {
                throw new Error('This trip already exists.');
            }

            const tripData = { name,driverEmail,phoneNumber, from, to, price, maxPassengers,currentPassengers, date, time,carBrand, status_trip,visibilty_trip };
            const newTrip = new TripModel(tripData);
            return await newTrip.save();
        } catch (error) {
            throw error;
        }
    }
    static async updateTrip(id, updates) {
        try {
            // تحقق من صحة id
            if (!id) {
                throw new Error("Trip ID is required.");
            }
    
            // تحديث الرحلة باستخدام id
            const updatedTrip = await TripModel.findByIdAndUpdate(id, updates, { new: true });
    
            if (!updatedTrip) {
                throw new Error("Trip not found or could not be updated.");
            }
    
            return updatedTrip;
        } catch (error) {
            throw error;
        }
    }
    
    // جلب الرحلات الخاصة بالسائق
    static async getDriverTrips(driverEmail) {
        try {
            return await TripModel.find({ driverEmail });
        } catch (error) {
            throw error;
        }
    }


    static async deleteTrip(tripId) {
        try {
            // البحث عن الرحلة باستخدام tripId
            const trip = await TripModel.findById(tripId);
            if (!trip) {
                throw new Error("Trip not found."); // إذا لم يتم العثور على الرحلة
            }
    
            // حذف الحجوزات المتعلقة بالرحلة (إذا كان هذا جزءًا من المطلوب)
            await BookTrip.deleteMany({
                from: trip.from,
                to: trip.to,
                date: trip.date,
                time: trip.time,
            });
    
            // حذف الرحلة
            await TripModel.findByIdAndDelete(tripId);
    
            return { trip, message: "Trip and related bookings deleted successfully." };
        } catch (error) {
            throw error; // إعادة تمرير الخطأ إلى الـ Controller
        }
    }
    


// إضافة دالة لجلب جميع الرحلات لجميع السائقين
/*static async getAllTrips() {
    try {
        return await TripModel.find(); // جلب جميع الرحلات من قاعدة البيانات
    } catch (error) {
        throw error;
    }
}*/

static async getAllTrips(filter = {}) {
    try {
        // إذا كانت filter فارغة، سيتم إرجاع جميع الرحلات
        if (Object.keys(filter).length === 0) {
            return await TripModel.find();
        }

        // تطبيق الفلترة بناءً على المدخلات (مثل السعر، التاريخ، الحالة)
        const trips = await TripModel.find(filter);

        return trips;
    } catch (error) {
        throw error;
    }
}

    // جلب الرحلات بناءً على جندر المستخدم
    static async getTripsByGender(userId) {
        try {
            // جلب بيانات المستخدم بناءً على الـ userId
            const user = await UserModel.findById(userId);

            if (!user) {
                throw new Error('User not found.');
            }

            let genderFilter = [];

            // تحديد الفلاتر بناءً على الجندر
            if (user.gender === 'Female') {
                genderFilter = ['Public', 'Female'];
            } else if (user.gender === 'Male') {
                genderFilter = ['Public', 'Male'];
            }

            // البحث عن الرحلات التي تتوافق مع الفلاتر المحددة
            const trips = await TripModel.find({
                visibilty_trip: { $in: genderFilter }
            });

            return trips;
        } catch (error) {
            throw error;
        }
    }

}

module.exports = TripServices;
//new