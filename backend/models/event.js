const mongoose = require('mongoose');

const Player = require('./player');

let ObjectId = mongoose.Schema.Types.ObjectId;

let EventSchema = new mongoose.Schema({
    town: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    format: { type: String, required: true },
    author: { type: String, required: true },
    author_fb_id: { type: String, required: true },
    author_fb_name: { type: String, required: true },
    players: [{ type: ObjectId, ref: 'Player' }],
    inviting: { type: Boolean, required: true, default: false },
    weather: { type: String },
    created_at: { type: String, required: true }
});

module.exports = mongoose.model('Event', EventSchema);
