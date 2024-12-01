const TripModel = require('../model/tripD.model');
const moment = require('moment'); // للتعامل مع التواريخ والأوقات

class TripServices {
    // إنشاء رحلة جديدة
    static async createTrip(name,driverEmail,phoneNumber, from, to, price, maxPassengers, date, time) {
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
                date,
                time
            });

            if (isDuplicate) {
                throw new Error('This trip already exists.');
            }

            const tripData = { name,driverEmail,phoneNumber, from, to, price, maxPassengers, date, time, status_trip };
            const newTrip = new TripModel(tripData);
            return await newTrip.save();
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

    // إضافة دالة لحذف رحلة بناءً على الـ id
static async deleteTrip(id) {
    try {
        const trip = await TripModel.findByIdAndDelete(id);
        if (!trip) {
            throw new Error('Trip not found.');
        }
        return trip;
    } catch (error) {
        throw error;
    }
}

// إضافة دالة لجلب جميع الرحلات لجميع السائقين
static async getAllTrips() {
    try {
        return await TripModel.find(); // جلب جميع الرحلات من قاعدة البيانات
    } catch (error) {
        throw error;
    }
}



    
    
}

module.exports = TripServices;
