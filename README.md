# 💅 AgendaFácil - Sistema de Agendamento para Manicure

> Sistema completo de agendamento online especializado para profissionais de manicure, pedicure e nail art.

## 📋 Sobre o Projeto

O **AgendaFácil** é uma aplicação web desenvolvida especificamente para manicures e profissionais de beleza das unhas, permitindo que gerenciem seus serviços, horários e agendamentos de forma digital e eficiente. O sistema oferece interface para profissionais administrarem sua agenda e para clientes agendarem serviços.

### 🔄 Estado Atual - Migração em Andamento

Este projeto está atualmente em **processo de migração** de uma arquitetura HTML tradicional para React moderno:

- **✅ Versão Legada (HTML)**: Funcional e estável
- **🚧 Nova Versão (React)**: Em desenvolvimento ativo
- **🎯 Objetivo**: Interface moderna, melhor UX e manutenibilidade

## 🛠️ Tecnologias Utilizadas

### Backend (Completo)
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **bcrypt** - Criptografia de senhas
- **express-session** - Gerenciamento de sessões
- **Winston** - Sistema de logs
- **Helmet** - Segurança HTTP
- **CORS** - Controle de acesso

### Frontend - Versão Legada (HTML)
- **HTML5** - Estrutura das páginas
- **CSS3** - Estilização (Poppins font, design responsivo)
- **JavaScript Vanilla** - Interatividade
- **Tailwind CSS** - Framework CSS
- **Font Awesome** - Ícones

### Frontend - Nova Versão (React) 🚧
- **React 19** - Biblioteca UI
- **Vite** - Bundler e dev server
- **Tailwind CSS v4** - Estilização moderna
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Context API** - Gerenciamento de estado

## 📁 Estrutura do Projeto

```
agendamentos/
├── backend/                    # Servidor Node.js
│   ├── controles/             # Controllers da API
│   ├── middlewares/           # Middlewares customizados
│   ├── models/               # Modelos MongoDB (User, Service, Appointment, Schedule)
│   ├── configuracoes/        # Configurações (logger)
│   ├── public/               # 📄 PÁGINAS HTML LEGADAS
│   │   ├── login.html        # Login tradicional
│   │   ├── cadastro.html     # Cadastro tradicional
│   │   ├── painelpro.html    # Dashboard profissional
│   │   ├── painelcli.html    # Dashboard cliente
│   │   ├── agenda.html       # Agenda tradicional
│   │   ├── config.html       # Configurações
│   │   └── styles.css        # Estilos globais
│   ├── utils/                # Utilitários
│   ├── index.js              # Entrada do servidor
│   ├── app.js                # Configuração Express
│   ├── routes.js             # Definição das rotas
│   └── variaveisambiente.env # Variáveis de ambiente
├── src/                      # 🆕 APLICAÇÃO REACT NOVA
│   ├── components/           # Componentes React
│   │   ├── layout/           # Layouts (Sidebar, DashboardLayout)
│   │   └── ui/               # Componentes UI (Card, StatCard)
│   ├── contexts/             # Context providers
│   │   ├── AuthContext.jsx   # Autenticação
│   │   └── ThemeContext.jsx  # Tema/Dark mode
│   ├── pages/                # Páginas React
│   │   ├── Login.jsx         # 🆕 Nova página de login
│   │   ├── Register.jsx      # 🆕 Nova página de cadastro
│   │   ├── DashboardPro.jsx  # 🆕 Dashboard profissional
│   │   └── DashboardClient.jsx # 🆕 Dashboard cliente
│   ├── services/             # Serviços (API calls)
│   └── utils/                # Utilitários frontend
├── dist/                     # Build do React (produção)
└── package.json              # Dependências frontend
```

## 🌟 Funcionalidades

### Para Profissionais de Manicure
- ✅ **Gestão de Serviços**: Criar serviços (manicure, pedicure, nail art, spa das unhas)
- ✅ **Definir Preços e Duração**: Configurar tempo e valor de cada serviço
- ✅ **Horários de Funcionamento**: Definir disponibilidade semanal
- ✅ **Dashboard Completo**: Visão geral dos agendamentos e estatísticas
- ✅ **Gerenciar Agendamentos**: Visualizar, confirmar, cancelar
- ✅ **Lista de Clientes**: Histórico e dados dos clientes

### Para Clientes
- ✅ **Agendamento Simples**: Escolher serviços e horários disponíveis
- ✅ **Visualizar Serviços**: Ver lista completa com preços e duração
- ✅ **Meus Agendamentos**: Acompanhar agendamentos ativos
- ✅ **Cancelar Agendamentos**: Autonomia para cancelar quando necessário
- ✅ **Cadastro Simplificado**: Registro rápido sem complexidade

## 🚀 Como Executar

### 1. Pré-requisitos
- Node.js 18+
- MongoDB Atlas (ou local)
- Git

### 2. Clone o Repositório
```bash
git clone https://github.com/nskilleer/agendamentos.git
cd agendamentos
```

### 3. Configurar Backend
```bash
# Navegar para o backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Edite o arquivo variaveisambiente.env:
SESSION_SECRET=sua_chave_secreta_aqui
MONGODB_URI=sua_string_conexao_mongodb
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# Executar servidor
npm run dev  # Desenvolvimento
npm start    # Produção
```

### 4. Configurar Frontend (React)
```bash
# Navegar para a raiz do projeto
cd ..

# Instalar dependências
npm install

# Executar aplicação React
npm run dev
```

### 5. Acessar as Aplicações
- **Backend API**: http://localhost:3333
- **Frontend React**: http://localhost:5173
- **Frontend HTML (legado)**: http://localhost:3333 (servido pelo backend)

## 📡 API Endpoints

### Autenticação
- `POST /api/login` - Login de usuário
- `POST /api/register` - Cadastro de usuário
- `POST /api/logout` - Logout
- `GET /api/check_session` - Verificar sessão ativa

### Serviços (Profissionais)
- `GET /api/servicos` - Listar serviços do profissional
- `POST /api/add_servico` - Criar novo serviço
- `DELETE /api/delete_servico/:id` - Excluir serviço

### Agendamentos
- `GET /api/agendamentos` - Listar agendamentos (profissional)
- `POST /api/agendamentos` - Criar agendamento (cliente)
- `POST /api/cancel_appointment_cliente` - Cancelar (cliente)
- `POST /api/cancel_appointment_profissional` - Cancelar (profissional)

### Horários
- `GET /api/get_horarios_disponiveis` - Horários disponíveis
- `POST /api/set_horario_funcionamento` - Definir horários
- `GET /api/get_horarios_funcionamento` - Listar horários

## 🎯 Roadmap da Migração

### ✅ Concluído
- [x] Backend completo funcional
- [x] Estrutura React configurada
- [x] Context API (Auth, Theme)
- [x] Páginas de Login e Register (React)
- [x] Dashboards básicos (React)
- [x] Comunicação Frontend-Backend

### 🚧 Em Progresso
- [ ] Migração completa do Dashboard Profissional
- [ ] Sistema de agendamento (React)
- [ ] Gestão de serviços (React)
- [ ] Configurações de horários (React)

### 📋 Próximos Passos
- [ ] Dashboard do Cliente completo
- [ ] Agenda visual (calendário)
- [ ] Notificações em tempo real
- [ ] Upload de imagens (nail art)
- [ ] Relatórios e estatísticas
- [ ] PWA (Progressive Web App)
- [ ] Integração WhatsApp/SMS

## 🗂️ Modelos de Dados

### User (Usuário)
```javascript
{
  nome: String,
  email: String,
  telefone: String,
  senha: String (hash),
  userType: ['cliente', 'profissional', 'admin'],
  criado_em: Date
}
```

### Service (Serviço)
```javascript
{
  userId: ObjectId,
  nome: String, // Ex: "Manicure Simples", "Nail Art", "Pedicure Spa"
  duracao_min: Number,
  preco: Number
}
```

### Appointment (Agendamento)
```javascript
{
  userId: ObjectId, // Profissional
  clientId: ObjectId,
  serviceId: ObjectId,
  nomeCliente: String,
  telefoneCliente: String,
  start: Date,
  end: Date,
  duracao_min: Number,
  cancelado: Boolean
}
```

### Schedule (Horário de Funcionamento)
```javascript
{
  userId: ObjectId,
  diaSemana: Number, // 0-6 (Dom-Sab)
  horaInicio: String,
  horaFim: String,
  ativo: Boolean
}
```

## 🎨 Design System

### Cores Principais
- **Primária**: `#3B82F6` (Azul)
- **Secundária**: `#10B981` (Verde)
- **Fundo**: `#F0F4F8` (Cinza claro)
- **Texto**: `#334155` (Cinza escuro)

### Tipografia
- **Fonte**: Poppins (Google Fonts)
- **Pesos**: 400, 500, 600, 700

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

- **Nathan Silva** - [GitHub](https://github.com/nskilleer)

---

<div align="center">
  <strong>💅 Transformando a gestão de serviços de manicure com tecnologia moderna</strong>
</div>