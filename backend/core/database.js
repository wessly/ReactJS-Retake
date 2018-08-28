const mongoose = require('mongoose');
const dbPath = 'mongodb://pesho:gosho@ds137600.mlab.com:37600/kletka';

mongoose.Promise = global.Promise;

module.exports = () => {
    mongoose.connect(dbPath, {
        // useMongoClient: true
    });

    const db = mongoose.connection;

    db.once('open', error => {
        if (error) throw error;
        console.log('Connected to database.');
    });

    db.on('error', error => {
        console.log(error);
    });
};
