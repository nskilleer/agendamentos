// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true, maxlength: 100 },
    email: {
        type: String,
        required: function () { return this.userType !== 'cliente'; },
        unique: true,
        sparse: true,
        maxlength: 150
    },
    telefone: { type: String, maxlength: 20 },
    senha: {
        type: String,
        required: function () { return this.userType !== 'cliente'; },
        maxlength: 255
    },
    userType: {
        type: String,
        enum: ['cliente', 'profissional', 'admin'],
        default: 'cliente',
        required: true
    },
    criado_em: { type: Date, default: Date.now }
});

// ✅ Middleware para exclusão em cascata
userSchema.pre('findOneAndDelete', async function (next) {
    const Appointment = mongoose.model('Appointment');
    const Service = mongoose.model('Service');
    const Schedule = mongoose.model('Schedule');

    const userId = this.getQuery()._id;

    console.log(`Deletando todos os dados relacionados ao usuário ${userId}...`);

    try {
        // Exclui agendamentos onde o usuário é o profissional OU o cliente
        await Appointment.deleteMany({ $or: [{ userId: userId }, { clientId: userId }] });

        // Exclui serviços do profissional
        await Service.deleteMany({ userId: userId });

        // Exclui horários de funcionamento do profissional
        await Schedule.deleteMany({ userId: userId });

        console.log(`Dados relacionados ao usuário ${userId} foram deletados com sucesso.`);
        next();
    } catch (err) {
        console.error('Erro na exclusão em cascata:', err);
        next(err);
    }
});

module.exports = mongoose.model('User', userSchema);