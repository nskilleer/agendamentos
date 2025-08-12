@echo off
echo.
echo ==========================================
echo  INICIANDO AGENDAFACIL BACKEND
echo ==========================================
echo.

echo Verificando Node.js...
node --version
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado!
    pause
    exit /b 1
)

echo.
echo Verificando dependencias...
if not exist node_modules (
    echo Instalando dependencias...
    npm install
)

echo.
echo Iniciando servidor...
node index.js

echo.
echo Servidor encerrado.
pause
