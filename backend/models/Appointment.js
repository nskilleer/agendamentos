// models/Appointment.js

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    // clientId agora é opcional - permite clientes não cadastrados
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    nomeCliente: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true
    },
    telefoneCliente: {
        type: String,
        required: true,
        maxlength: 20,
        trim: true,
        index: true // Índice para busca rápida por telefone
    },
    start: {
        type: Date,
        required: true,
        index: true
    },
    end: {
        type: Date,
        required: true
    },
    duracao_min: {
        type: Number,
        required: true,
        default: 45 // Padrão para manicure
    },
    status: {
        type: String,
        enum: ['agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado', 'nao_compareceu'],
        default: 'agendado'
    },
    observacoes: {
        type: String,
        maxlength: 500
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);