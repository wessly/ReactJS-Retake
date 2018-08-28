const mongoose = require('mongoose');

const Event = require('./event');

let PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    slot: { type: String, required: true },
		isGk: { type: Boolean, required: true, default: false },
		locked: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model('Player', PlayerSchema);
