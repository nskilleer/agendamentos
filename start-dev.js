#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

console.log('🚀 Iniciando AgendaFácil em modo desenvolvimento...\n');

// Determina o comando correto baseado no SO
const isWindows = os.platform() === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// Função para iniciar o backend
function startBackend() {
  console.log('📦 Iniciando Backend...');
  
  const backendProcess = spawn(npmCmd, ['start'], {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: true
  });

  backendProcess.on('error', (err) => {
    console.error('❌ Erro ao iniciar backend:', err);
  });

  return backendProcess;
}

// Função para iniciar o frontend
function startFrontend() {
  console.log('🎨 Iniciando Frontend...');
  
  const frontendProcess = spawn(npmCmd, ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  frontendProcess.on('error', (err) => {
    console.error('❌ Erro ao iniciar frontend:', err);
  });

  return frontendProcess;
}

// Inicia ambos os processos
const backend = startBackend();
setTimeout(() => {
  const frontend = startFrontend();
  
  // Manipula o encerramento gracioso
  process.on('SIGINT', () => {
    console.log('\n⏹️ Encerrando aplicação...');
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
}, 2000); // Espera 2 segundos para o backend iniciar primeiro

console.log('\n✨ Aplicação iniciada!');
console.log('📱 Frontend: http://localhost:5173 (ou próxima porta disponível)');
console.log('🔧 Backend: http://localhost:3333');
console.log('\n💡 Use Ctrl+C para parar ambos os serviços\n');
