const BookTrip = require('../model/bookingtripP.model');
const TripModel = require('../model/tripD.model');

// إضافة حجز جديد
const createBooking = async (data) => {
    

    // التحقق إذا كان الراكب لديه حجز آخر في نفس الوقت
    const conflictingBooking = await BookTrip.findOne({
        nameP: data.nameP,
        date: data.date,
        time: data.time
    });

    if (conflictingBooking) {
        throw new Error("You cannot book two trips at the same time.");
    }

    // العثور على الرحلة المطلوبة بناءً على من، إلى، التاريخ، والوقت
    const tripDetails = await TripModel.findOne({
        from: data.from,
        to: data.to,
        date: data.date,
        time: data.time
    });

    if (!tripDetails) {
        throw new Error("Trip not found.");
    }

    console.log("Before updating currentPassengers:", tripDetails.currentPassengers);

    if (tripDetails.currentPassengers + data.seat > tripDetails.maxPassengers) {
        throw new Error(`No available seats for this trip. Maximum capacity is ${tripDetails.maxPassengers} passengers.`);
    }
    else
    {
    tripDetails.currentPassengers += data.seat;
    
    }
    console.log("After updating currentPassengers:", tripDetails.currentPassengers);
    await tripDetails.save();

    const newBooking = new BookTrip(data);
    return await newBooking.save();
};


// الحصول على الركاب الحاجزين لرحلة معينة
const getPassengersByTrip = async (driverEmail, from, to, date, time) => {
    // التحقق من وجود الرحلة أولاً
    const trip = await TripModel.findOne({ driverEmail, from, to, date, time });
    if (!trip) {
        throw new Error("Trip not found.");
    }

    // جلب الحجوزات المرتبطة بهذه الرحلة
    const passengers = await BookTrip.find({ from, to, date, time });
    return passengers; // تعيد أسماء ومعلومات الركاب
};

// الحصول على جميع الحجوزات
const getAllBookings = async () => {
    return await BookTrip.find();
};

const getBookingsByEmail2 = async (EmailP) => {
    try{
    return await BookTrip.find({ EmailP: EmailP }); }
    catch (error) {
        throw error;
    }
};

// حذف حجز معين
const cancelBooking = async (bookingId) => {
    // العثور على الحجز
    const booking = await BookTrip.findById(bookingId);
    if (!booking) {
        throw new Error("Booking not found.");
    }

    // العثور على الرحلة المقابلة
    const trip = await TripModel.findOne({
        from: booking.from,
        to: booking.to,
        date: booking.date,
        time: booking.time
    });

    if (trip) {
        // تقليل عدد الركاب الحاليين في الرحلة
        trip.currentPassengers -= booking.seat;
        await trip.save();
    }

    // حذف الحجز
    await BookTrip.findByIdAndDelete(bookingId);
    return { status: true, message: "Booking canceled successfully." };
};
const updateBooking = async (bookingId, updatedData) => {
    try {
      const booking = await BookTrip.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found.");
      }
  
      // تحديث الحقول
      booking.seat = updatedData.seat !== undefined ? updatedData.seat : booking.seat;
      booking.Note = updatedData.Note !== undefined ? updatedData.Note : booking.Note;
      booking.pay = updatedData.pay !== undefined ? updatedData.pay : booking.pay;
  
      // حفظ التحديثات في قاعدة البيانات
      await booking.save();
  
      console.log('Updated booking:', booking);  // تحقق من الحجز المحدث
  
      return booking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error(error.message);
    }
  };
  
  const updateBookingRate = async (bookingId, updatedData) => {
    try {
      const booking = await BookTrip.findById(bookingId);
      if (!booking) {
        throw new Error("Booking not found.");
      }
  
      // تحديث الحقول
      booking.driverRate = updatedData.driverRate !== undefined ? updatedData.driverRate : booking.driverRate;
      booking.NoteRate = updatedData.NoteRate !== undefined ? updatedData.NoteRate : booking.NoteRate;
  
      // حفظ التحديثات في قاعدة البيانات
      await booking.save();
  
      console.log('Updated booking:', booking);  // تحقق من الحجز المحدث
  
      return booking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw new Error(error.message);
    }
  };

module.exports = {
    createBooking,
    getAllBookings,
    getPassengersByTrip,
    getBookingsByEmail2,
    cancelBooking,
    updateBooking,
    updateBookingRate
};
