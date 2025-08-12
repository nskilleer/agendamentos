// models/Schedule.js

const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referência ao _id do usuário
    dia_semana: {
        type: String,
        required: true,
        enum: ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'] // Validação ENUM com array de strings
    },
    hora_abertura: { type: String, required: true }, // Ex: "09:00"
    hora_fechamento: { type: String, required: true }, // Ex: "18:00"
});

// Criar um índice único composto para garantir um único horário por dia por profissional
scheduleSchema.index({ userId: 1, dia_semana: 1 }, { unique: true });

module.exports = mongoose.model('Schedule', scheduleSchema);