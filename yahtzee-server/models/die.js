// student model
const mongoose = require('mongoose');

const dieSchema = mongoose.Schema({
    id: { type: String, required: true },
    currentNumber: { type: String, required: true },
    isSelected: { type: Boolean, required: true },
});

module.exports = mongoose.model('Die', dieSchema, 'dice');