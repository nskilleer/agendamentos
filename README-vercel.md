# Deploy Frontend na Vercel

## Instruções para Deploy

### 1. Preparação

1. **Obtenha a URL do seu backend no Railway:**
   - Após o deploy no Railway, copie a URL (algo como: `https://agendafacil-production.up.railway.app`)
   
2. **Atualize o arquivo `.env.production`:**
   ```
   VITE_API_URL=https://sua-url-do-railway.up.railway.app/api
   ```

### 2. Deploy na Vercel

1. **Via CLI da Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Via Interface Web:**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte seu repositório GitHub
   - Configure as variáveis de ambiente:
     - `VITE_API_URL`: URL do seu backend no Railway

### 3. Configurações Importantes

#### No Railway (Backend):
Adicione a URL da Vercel nas variáveis de ambiente:
```
CORS_ORIGIN=https://seu-app.vercel.app
```

#### Arquivos de Configuração:
- `vercel.json`: Configuração de build e rewrites
- `.env.production`: Variáveis de ambiente para produção

### 4. Estrutura do Deploy

```
Frontend (Vercel) ➜ Backend (Railway) ➜ MongoDB Atlas
```

- **Frontend**: Interface React servida pela Vercel
- **Backend**: API Express servida pelo Railway
- **Database**: MongoDB Atlas (compartilhado)

### 5. Proxy de API

O `vercel.json` está configurado para:
- Fazer proxy das chamadas `/api/*` para o backend no Railway
- Servir o React SPA para todas as outras rotas
- Configurar CORS adequadamente

### 6. Troubleshooting

#### Erro de CORS:
1. Verifique se `CORS_ORIGIN` no Railway está correto
2. Verifique se `VITE_API_URL` na Vercel está correto

#### API não funciona:
1. Teste a API diretamente no Railway
2. Verifique os logs na Vercel
3. Confirme que o proxy está funcionando

### 7. Comandos Úteis

```bash
# Build local para testar
npm run build

# Preview local
npm run preview

# Deploy na Vercel
vercel --prod

# Logs da Vercel
vercel logs
```