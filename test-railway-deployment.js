// Test script for Railway deployment
// Run this after setting up environment variables in Railway

const https = require('https');
const http = require('http');

const RAILWAY_URL = 'https://agendamentos-production-12c5.up.railway.app';

// Test endpoints
const endpoints = [
    { path: '/api', method: 'GET', description: 'API Health Check' },
    { path: '/api/check_session', method: 'GET', description: 'Session Check' },
];

function makeRequest(url, method = 'GET') {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
            path: urlObj.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Railway-Test-Script'
            },
            timeout: 10000
        };

        const client = urlObj.protocol === 'https:' ? https : http;
        
        const req = client.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        req.end();
    });
}

async function testEndpoint(endpoint) {
    const url = `${RAILWAY_URL}${endpoint.path}`;
    console.log(`\n🧪 Testing: ${endpoint.description}`);
    console.log(`📍 URL: ${url}`);
    
    try {
        const response = await makeRequest(url, endpoint.method);
        
        console.log(`✅ Status: ${response.statusCode}`);
        
        if (response.statusCode === 200) {
            try {
                const jsonBody = JSON.parse(response.body);
                console.log(`📄 Response:`, JSON.stringify(jsonBody, null, 2));
            } catch (e) {
                console.log(`📄 Response: ${response.body.substring(0, 200)}...`);
            }
        } else {
            console.log(`⚠️ Response: ${response.body}`);
        }
        
        return response.statusCode === 200;
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
        return false;
    }
}

async function runTests() {
    console.log('🚀 Testing Railway Deployment');
    console.log('=' .repeat(50));
    
    let passedTests = 0;
    let totalTests = endpoints.length;
    
    for (const endpoint of endpoints) {
        const success = await testEndpoint(endpoint);
        if (success) passedTests++;
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 Test Results: ${passedTests}/${totalTests} passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Your Railway deployment is working correctly.');
        console.log('✅ Backend is responding and ready to serve requests.');
    } else {
        console.log('⚠️ Some tests failed. Check the Railway deployment logs.');
        console.log('📋 Make sure all environment variables are set in Railway:');
        console.log('   - MONGODB_URI');
        console.log('   - SESSION_SECRET');
        console.log('   - NODE_ENV=production');
        console.log('   - CORS_ORIGIN');
    }
}

// Run the tests
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = { runTests, testEndpoint };