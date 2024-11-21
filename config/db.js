const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb://localhost:27017/db_software').on('open',()=>{
    console.log("Mongo connectd");
}).on('error',()=>{
    console.log("MongoDb connecttion error");
});

module.exports = connection;