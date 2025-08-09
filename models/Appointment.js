// models/Appointment.js

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    nomeCliente: {
        type: String,
        required: true,
        maxlength: 100
    },
    telefoneCliente: {
        type: String,
        required: true,
        maxlength: 20
    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },
    duracao_min: {
        type: Number,
        required: true,
        default: 30
    },
    cancelado: {
        type: Boolean,
        default: false
    },
    criado_em: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);