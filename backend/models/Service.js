// models/Service.js

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nome: { type: String, required: true, maxlength: 100 },
    duracao_min: { type: Number, required: true },
    preco: { type: Number, required: true },
    tipo: { 
        type: String, 
        enum: ['manicure_1', 'manicure_2', 'manicure_3', 'manicure_4'],
        required: false 
    },
    descricao: { type: String, maxlength: 500 },
    ativo: { type: Boolean, default: true }
}, { timestamps: true });

serviceSchema.pre('findOneAndDelete', async function (next) {
    const Appointment = mongoose.model('Appointment'); // Importa o modelo no escopo do hook

    const serviceId = this.getQuery()._id;

    try {
        await Appointment.deleteMany({ serviceId: serviceId });
        console.log(`Agendamentos relacionados ao serviço ${serviceId} foram deletados.`);
        next();
    } catch (err) {
        console.error('Erro na exclusão em cascata de agendamentos para o serviço:', err);
        next(err);
    }
});

module.exports = mongoose.model('Service', serviceSchema);