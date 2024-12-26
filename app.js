const express = require('express');
const cors = require('cors');
const body_parser = require('body-parser');
const userRouter = require('./routers/user.routers');
const tripDriverRouter = require('./routers/tripD.router');
const TripServices = require('./services/tripD.services');
const bookTripRoutes = require('./routers/bookingtripP.router');
const complaint = require('./routers/complaint.router');

const app = express();

// زيادة الحد الأقصى لحجم الطلب إلى 10MB
app.use(body_parser.json({ limit: '10mb' }));
app.use(body_parser.urlencoded({ limit: '10mb', extended: true }));


app.use(cors());

// ربط المسارات
app.use('/', userRouter); // المستخدمين
app.use('/', tripDriverRouter); // الرحلات
app.use('/', bookTripRoutes); // الحجوزات
app.use('/', complaint); // الشكاوي

module.exports = app;
