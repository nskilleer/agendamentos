// Script para testar as rotas da API
const http = require('http');

const testRoute = (path, description) => {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3333,
            path: path,
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                console.log(`✅ ${description}: ${res.statusCode}`);
                if (res.statusCode === 200) {
                    try {
                        const json = JSON.parse(data);
                        console.log(`   📄 Response: ${JSON.stringify(json, null, 2)}`);
                    } catch (e) {
                        console.log(`   📄 Response: ${data}`);
                    }
                } else {
                    console.log(`   ❌ Error: ${data}`);
                }
                resolve();
            });
        });

        req.on('error', (err) => {
            console.log(`❌ ${description}: ${err.message}`);
            resolve();
        });

        req.end();
    });
};

const runTests = async () => {
    console.log('🧪 Testando rotas da API...\n');
    
    await testRoute('/api/', 'Rota raiz da API');
    await testRoute('/api/test', 'Rota de teste');
    await testRoute('/api/public/services', 'Serviços públicos');
    await testRoute('/api/public/appointments/79998313236', 'Agendamentos por telefone');
    
    console.log('\n🎯 Testes concluídos!');
};

runTests();
