// seeds/createDefaultServices.js
// Script para criar os 4 serviços padrão de manicure

require('dotenv').config({ path: './variaveisambiente.env' });
const mongoose = require('mongoose');
const Service = require('../models/Service');
const User = require('../models/User');

const defaultServices = [
    {
        nome: 'Manicure Tipo 1',
        duracao_min: 45,
        preco: 25.00,
        tipo: 'manicure_1',
        descricao: 'Manicure básica com corte, lixa e esmaltação simples'
    },
    {
        nome: 'Manicure Tipo 2', 
        duracao_min: 45,
        preco: 35.00,
        tipo: 'manicure_2',
        descricao: 'Manicure com design básico e cuidados especiais'
    },
    {
        nome: 'Manicure Tipo 3',
        duracao_min: 45,
        preco: 45.00,
        tipo: 'manicure_3',
        descricao: 'Manicure decorada com nail art e técnicas avançadas'
    },
    {
        nome: 'Manicure Tipo 4',
        duracao_min: 45,
        preco: 55.00,
        tipo: 'manicure_4',
        descricao: 'Manicure premium com técnicas especiais e produtos de luxo'
    }
];

async function createDefaultServices() {
    try {
        // Conecta ao MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado ao MongoDB');

        // Busca o primeiro profissional para associar os serviços
        const profissional = await User.findOne({ userType: 'profissional' });
        
        if (!profissional) {
            console.log('❌ Nenhum profissional encontrado. Crie um profissional primeiro.');
            process.exit(1);
        }

        console.log(`👤 Profissional encontrado: ${profissional.nome}`);

        // Remove serviços existentes do profissional
        await Service.deleteMany({ userId: profissional._id });
        console.log('🗑️ Serviços existentes removidos');

        // Cria os novos serviços
        for (const serviceData of defaultServices) {
            const service = new Service({
                ...serviceData,
                userId: profissional._id
            });
            
            await service.save();
            console.log(`✅ Serviço criado: ${service.nome} - R$ ${service.preco}`);
        }

        console.log('🎉 Todos os serviços foram criados com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao criar serviços:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Conexão fechada');
    }
}

// Executa o script se for chamado diretamente
if (require.main === module) {
    createDefaultServices();
}

module.exports = createDefaultServices;