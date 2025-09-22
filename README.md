# 🚀 Tech Challenge Blog - Desafio Técnico

## 🎯 **IMPORTANTE**: Este é um Desafio Técnico

Esta aplicação foi **propositalmente** construída com problemas, bugs e oportunidades de melhoria que você deve **identificar, analisar e corrigir**. Seu objetivo é:

1. **🔍 EXPLORAR** o código e identificar problemas
2. **🐛 ENCONTRAR** bugs e falhas de segurança
3. **⚡ OTIMIZAR** performance e consultas ao banco
4. **🧪 CORRIGIR** testes quebrados
5. **🎨 MELHORAR** a experiência do usuário
6. **📦 CONFIGURAR** adequadamente o Docker

> **⚠️ ATENÇÃO**: Nem tudo está funcionando corretamente! Isso é intencional.

## 📋 Visão Geral do Desafio

Esta é uma aplicação full-stack de blog construída com Node.js, TypeScript, React, PostgreSQL, Docker e AWS S3. A aplicação contém tanto funcionalidades operacionais quanto **elementos intencionalmente quebrados** para fins de avaliação técnica.

## 🏗️ Arquitetura Técnica

### Backend

- **Framework**: Express.js com TypeScript
- **Database**: PostgreSQL com Sequelize ORM
- **Autenticação**: JWT tokens
- **Storage**: AWS S3
- **Containerização**: Docker

### Frontend

- **Framework**: React com TypeScript
- **Estilização**: Styled Components com Design System
- **Gerenciamento de Estado**: Custom hooks com React Context
- **Roteamento**: React Router
- **Formulários**: React Hook Form

## ✅ Funcionalidades que DEVEM Funcionar

### 1. **Sistema de Autenticação**

- Registro e login de usuários
- Autenticação baseada em JWT tokens
- Rotas protegidas

### 2. **Sistema de Posts**

- CRUD completo de posts
- Conteúdo em markdown
- Upload de imagens para S3
- Tags e categorias
- Contador de visualizações

### 3. **Sistema de Comentários**

- Comentários aninhados (respostas)
- Moderação de comentários
- Atualizações em tempo real

### 4. **Sistema de Likes**

- Like/unlike em posts
- Exibição de contador de likes

### 5. **Upload de Arquivos**

- Upload de imagens para AWS S3
- Validação de tipos de arquivo
- Restrições de tamanho

## 🐛 DESAFIOS TÉCNICOS - O QUE VOCÊ DEVE RESOLVER

### 🔴 **1. Problemas de Performance Críticos** (BACKEND)

**❌ PROBLEMA**: Queries N+1 causando lentidão extrema

- **Localização**: `backend/src/controllers/postController.ts`
- **Sintomas**: Para cada post, faz consultas separadas para likes e comentários
- **Impacto**: 50 posts = 150+ queries desnecessárias
- **Sua missão**: Implementar eager loading com Sequelize

### 🔴 **2. Testes Completamente Quebrados** (BACKEND/FRONTEND)

**❌ PROBLEMA**: Testes falhando propositalmente

- **Localização**:
  - `backend/src/tests/auth.test.ts`
  - `frontend/src/App.test.tsx`
- **Sintomas**: `npm test` falha em múltiplos casos
- **Sua missão**: Identificar e corrigir assertions incorretas

### 🟡 **3. Problemas de UX/CSS** (FRONTEND)

**❌ PROBLEMA**: Interface com problemas de usabilidade

- **Localização**: `frontend/src/components/` e `frontend/src/styles/`
- **Sintomas**: Hover states não funcionam, design não responsivo
- **Sua missão**: Melhorar a experiência do usuário

### 🟡 **4. Configuração Docker Insegura** (DEVOPS)

**❌ PROBLEMA**: Docker mal configurado

- **Localização**: `docker-compose.yml`
- **Sintomas**: Senhas em texto plano, sem health checks
- **Sua missão**: Implementar best practices de segurança

### 🟠 **5. Problemas de Segurança** (BACKEND)

**❌ PROBLEMA**: Vulnerabilidades de segurança

- **Localização**: Vários arquivos do backend
- **Sintomas**: Validações insuficientes, exposição de dados
- **Sua missão**: Implementar validações robustas

## 🚀 Como Começar o Desafio

### Pré-requisitos

- Node.js (v18+)
- PostgreSQL
- Docker & Docker Compose
- **Credenciais AWS S3** (veja instruções abaixo)

#### 🆓 **Como Obter Credenciais AWS S3 GRATUITAS:**

**Opção 1: AWS Free Tier (Recomendado)**

1. **Crie uma conta AWS gratuita**:

   - Acesse [aws.amazon.com](https://aws.amazon.com)
   - Clique em "Create an AWS Account"
   - Complete o cadastro (precisa de cartão, mas não será cobrado no free tier)

2. **Obtenha as credenciais**:

   - Acesse AWS Console → IAM
   - Crie um novo usuário para este projeto
   - Anexe a política `AmazonS3FullAccess`
   - Gere as `Access Keys` (salve com segurança!)

3. **Crie um bucket S3**:

   - Acesse S3 no console AWS
   - Crie um bucket (nome único globalmente)
   - Configure permissões públicas para leitura de imagens

4. **Free Tier S3 inclui**:
   - 5 GB de armazenamento
   - 20.000 requests GET
   - 2.000 requests PUT
   - Suficiente para desenvolvimento!

**🚫 Opção 2: SEM AWS - Alternativas Locais**

Se não conseguir/quiser usar AWS, **você pode simular**:

**A) Upload Local (Mais Simples)**

```javascript
// Modifique o uploadController.ts para salvar localmente:
const filePath = `./uploads/${filename}`;
fs.writeFileSync(filePath, buffer);
// Retorne URL local: http://localhost:3001/uploads/filename
```

**B) Usar Serviço Gratuito Alternativo**

- **Cloudinary** (gratuito até 25 créditos/mês)
- **ImageKit** (gratuito até 20GB bandwidth/mês)
- **Supabase Storage** (gratuito até 1GB)

**C) Mock/Fake AWS S3**

```javascript
// No uploadController.ts, apenas simule o upload:
export const uploadImage = (req, res) => {
  // Fake successful upload
  const fakeUrl = `https://fake-s3-bucket.com/images/${Date.now()}.jpg`;
  res.json({ success: true, imageUrl: fakeUrl });
};
```

#### 📝 **Configuração das Credenciais:**

**Se usar AWS real:**

```bash
# No arquivo backend/.env
AWS_ACCESS_KEY_ID=AKIA...sua-key-aqui
AWS_SECRET_ACCESS_KEY=sua-secret-key-aqui
AWS_S3_BUCKET=seu-bucket-name
AWS_REGION=us-east-1
```

**Se usar alternativa local:**

````bash
# No arquivo backend/.env
AWS_ACCESS_KEY_ID=fake-key-for-local-dev
AWS_SECRET_ACCESS_KEY=fake-secret-for-local-dev
AWS_S3_BUCKET=local-uploads
AWS_REGION=local
     ```

> **💡 DICA**: O foco do desafio NÃO é configurar AWS, e sim resolver os problemas de código! Use a alternativa que for mais rápida para você.

> **📖 ALTERNATIVA COMPLETA**: Se preferir upload local, consulte o arquivo `LOCAL_UPLOAD_GUIDE.md` para implementação detalhada.### 📝 **PASSO A PASSO PARA O DESAFIO:**

#### **Etapa 1: Setup Inicial** (5-10 min)

1. **Clone o repositório**
```bash
git clone <repository-url>
cd tech-challenge
````

2. **Configure as variáveis de ambiente**

```bash
# Backend
cp backend/.env.example backend/.env
# Edite backend/.env com suas credenciais de database e AWS

# Frontend
cp frontend/.env.example frontend/.env.local
```

3. **Instale as dependências**

```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

#### **Etapa 2: Identificação de Problemas** (15-20 min)

4. **🧪 Execute os testes e veja as falhas**

```bash
# Backend - você deve ver testes falhando!
cd backend && npm test

# Frontend - também deve falhar!
cd frontend && npm test
```

5. **🐳 Tente subir com Docker (vai ter problemas!)**

```bash
docker-compose up -d
# Observe os problemas de configuração
```

6. **🔍 Ou suba manualmente e explore**

```bash
# Inicie o PostgreSQL
# Atualize as configurações de conexão em backend/.env

# Backend
cd backend && npm run dev

# Frontend (em outro terminal)
cd frontend && npm start
```

#### **Etapa 3: Análise e Correção** (30-40 min)

7. **🕵️ Explore o código e identifique**:

   - Onde estão os problemas de performance?
   - Quais testes estão quebrados e por quê?
   - Onde a segurança está comprometida?
   - Que problemas de UX existem?

8. **🔧 Comece a corrigir**:
   - Priorize pelos problemas mais críticos
   - Teste suas correções
   - Documente as mudanças que fez

### 🎯 **DICAS PARA O DESAFIO**

#### **🔍 Como Identificar Problemas:**

1. **Performance Issues**:

   - Execute queries e observe quantas são feitas
   - Use o Network tab do browser
   - Monitore o console do banco de dados

2. **Problemas de Teste**:

   - Leia as mensagens de erro cuidadosamente
   - Verifique assertions que fazem sentido
   - Execute testes individuais para isolar problemas

3. **Problemas de Segurança**:

   - Procure por senhas em plain text
   - Verifique validações de input
   - Analise configurações de CORS e headers

4. **Problemas de UX**:
   - Teste a interface em diferentes telas
   - Verifique states de hover e foco
   - Teste formulários e validações

#### **⚡ Comandos Úteis para Diagnóstico:**

```bash
# Verificar logs do Docker
docker-compose logs -f

# Executar testes específicos
npm test -- --testNamePattern="auth"

# Build de produção para ver warnings
npm run build

# Análise de bundle (se disponível)
npm run analyze
```

### 🧪 Testando Suas Correções

```bash
# ✅ ESTES COMANDOS DEVEM PASSAR APÓS SUAS CORREÇÕES:

# Backend tests (devem todos passar!)
cd backend && npm test

# Frontend tests (devem todos passar!)
cd frontend && npm test

# Build deve ser bem-sucedido
npm run build

# Docker deve subir sem problemas
docker-compose up -d --build

# Verificar saúde dos containers
docker-compose ps
```

### 📦 Build de Produção

```bash
# Build completo (deve funcionar sem erros)
npm run build

# Build apenas backend
npm run build:backend

# Build apenas frontend
npm run build:frontend
```

## 📊 Critérios de Avaliação

### **🥇 Excelente** (Senior Level)

- [ ] Identificou TODOS os problemas críticos
- [ ] Corrigiu N+1 queries com eager loading
- [ ] Implementou security best practices
- [ ] Melhorou significativamente a UX
- [ ] Todos os testes passando
- [ ] Docker configurado corretamente
- [ ] Sugeriu melhorias adicionais de arquitetura

### **🥈 Muito Bom** (Pleno)

- [ ] Identificou a maioria dos problemas
- [ ] Corrigiu problemas de performance principais
- [ ] Corrigiu testes quebrados
- [ ] Melhorou configurações de segurança
- [ ] Interface funcional e responsiva

### **🥉 Bom** (Júnior)

- [ ] Identificou alguns problemas óbvios
- [ ] Corrigiu pelo menos os testes
- [ ] Fez melhorias básicas na interface
- [ ] Demonstrou capacidade de debug

## 🤔 Perguntas para Reflexão

Durante o desafio, considere estas questões:

1. **Performance**: Como você mediria o impacto das suas otimizações?
2. **Segurança**: Que outras vulnerabilidades poderiam existir?
3. **Escalabilidade**: Como esta aplicação se comportaria com 10k usuários?
4. **Monitoramento**: Que métricas você implementaria em produção?
5. **Testing**: Como melhorar a cobertura de testes?

## 📚 Referências e Configuração

### Environment Variables (Configure Corretamente!)

### Backend (.env)

```
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tech_challenge_blog
DB_USER=admin
DB_PASSWORD=password123
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name
AWS_REGION=us-east-1
MAX_FILE_SIZE=5242880
```

### Frontend (.env.local)

```
REACT_APP_API_URL=http://localhost:3001/api
```

### 📋 API Endpoints (Para Testar Suas Correções)

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Posts Endpoints

- `GET /api/posts` - Get all posts (paginated)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/like` - Toggle post like (protected)

### Comments Endpoints

- `GET /api/comments/post/:postId` - Get post comments
- `POST /api/comments` - Create comment (protected)
- `PUT /api/comments/:id` - Update comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

### Upload Endpoints

- `POST /api/upload/image` - Upload image (protected)
- `DELETE /api/upload/image/:key` - Delete image (protected)

### 🗄️ Schema do Banco de Dados (Para Entender as Relações)

### Users Table

- `id` (Primary Key)
- `username` (Unique)
- `email` (Unique)
- `password` (Hashed)
- `firstName`, `lastName`
- `avatar`
- `isActive`
- `lastLogin`
- `createdAt`, `updatedAt`

### Posts Table

- `id` (Primary Key)
- `title`
- `content`
- `excerpt`
- `imageUrl`
- `tags` (Array)
- `isPublished`
- `publishedAt`
- `viewCount`
- `authorId` (Foreign Key)
- `createdAt`, `updatedAt`

### Comments Table

- `id` (Primary Key)
- `content`
- `postId` (Foreign Key)
- `authorId` (Foreign Key)
- `parentId` (Foreign Key, nullable)
- `isApproved`
- `createdAt`, `updatedAt`

### Likes Table

- `id` (Primary Key)
- `userId` (Foreign Key)
- `postId` (Foreign Key)
- `createdAt`, `updatedAt`
- Unique constraint on (userId, postId)

## 🔧 Documentação Técnica de Referência

> **💡 DICA**: Use esta seção como referência enquanto resolve os problemas!

### ⚡ Corrigindo N+1 Queries - Exemplo Prático

**❌ Problema Atual (encontre no código!):**

```javascript
// RUIM: Isso causa N+1 queries
const posts = await Post.findAll(); // 1 query
for (const post of posts) {
  const author = await post.getAuthor(); // N queries (uma para cada post)
  const comments = await post.getComments(); // N queries adicionais
}
```

**✅ Sua Solução Deve Ser:**

```javascript
// BOM: Isso usa apenas 1 query otimizada
const posts = await Post.findAll({
  include: [
    { model: User, as: "author" },
    { model: Comment, as: "comments" },
  ],
});
```

### 🔒 Exemplo de Problemas de Segurança a Resolver

**❌ Encontre e Corrija:**

```javascript
// Senha em plain text (muito ruim!)
const user = { password: "123456" };

// JWT sem expiração
const token = jwt.sign({ userId }, "weak-secret");

// Input sem validação
app.post("/api/posts", (req, res) => {
  const { title, content } = req.body; // Sem validação!
});
```

**✅ Como Deve Ficar:**

```javascript
// Hash da senha
const hashedPassword = await bcrypt.hash(password, 12);

// JWT com expiração
const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
  expiresIn: "15m",
});

// Input validado
const schema = Joi.object({
  title: Joi.string().min(3).max(200).required(),
  content: Joi.string().min(10).required(),
});
```

### 🐳 Docker - Configuração Correta vs Insegura

**❌ Problemas a Resolver:**

```yaml
# INSEGURO - encontre no docker-compose.yml!
environment:
  - DATABASE_PASSWORD=supersecret123 # Senha exposta!
# Sem health checks
# Sem restart policies
```

**✅ Como Deve Ser:**

```yaml
# SEGURO
secrets:
  - db_password
environment:
  - DATABASE_PASSWORD_FILE=/run/secrets/db_password
healthcheck:
  test: ["CMD", "pg_isready", "-U", "postgres"]
  interval: 30s
  timeout: 10s
  retries: 3
restart: unless-stopped
```

### 🧪 Exemplos de Testes Quebrados para Corrigir

**❌ Encontre Tests Como Este:**

```javascript
// Teste que sempre falha (propositalmente!)
it("should fail - broken test example", async () => {
  const user = await User.create(userData);
  expect(user.username).toBe("wrongusername"); // ← Obviamente errado!
});
```

**✅ Sua Correção:**

```javascript
// Teste correto
it("should create user with correct username", async () => {
  const user = await User.create(userData);
  expect(user.username).toBe(userData.username); // ← Correto!
});
```

### TypeScript Benefits

**Type Safety:**

```typescript
interface User {
  id: number;
  username: string;
  email: string;
}

// TypeScript catches errors at compile time
const user: User = {
  id: "1", // Error: Type 'string' is not assignable to type 'number'
  username: "john",
  email: "john@example.com",
};
```

**Better IDE Support:**

- Auto-completion
- Refactoring tools
- Error detection
- Documentation

## 🎓 Guias de Otimização (Sua Meta!)

### 🚀 Database Optimization - O Que Implementar

1. **Add Indexes**

```sql
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_published_at ON posts(published_at);
```

2. **Query Optimization**

```javascript
// Use eager loading
const posts = await Post.findAll({
  include: [
    { model: User, as: "author", attributes: ["id", "username"] },
    { model: Comment, as: "comments", limit: 5 },
  ],
  order: [["publishedAt", "DESC"]],
  limit: 10,
});
```

3. **Connection Pooling**

```javascript
const sequelize = new Sequelize({
  pool: {
    max: 20, // Maximum connections
    min: 5, // Minimum connections
    acquire: 30000,
    idle: 10000,
  },
});
```

### ⚡ Frontend Optimization - Melhorias para Implementar

1. **Code Splitting**

```javascript
const LazyComponent = React.lazy(() => import("./Component"));
```

2. **Memoization**

```javascript
const MemoizedComponent = React.memo(ExpensiveComponent);
```

3. **Image Optimization**

```javascript
<img
  src={imageUrl}
  loading="lazy"
  alt="Description"
  srcSet={`${imageUrl}?w=300 300w, ${imageUrl}?w=600 600w`}
/>
```

## 🔐 Security Best Practices - Implementar TODAS

> **🚨 IMPORTANTE**: Várias dessas práticas estão faltando no código atual!

1. **Input Validation**

```javascript
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
```

2. **Password Hashing**

```javascript
const hashedPassword = await bcrypt.hash(password, 12);
```

3. **JWT Security**

```javascript
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: "15m",
});
```

## 🆘 Troubleshooting - Problemas Comuns Durante o Desafio

> **💡 DICA**: Se você encontrar estes problemas, está no caminho certo!

### Problemas Esperados (e Como Resolver)

1. **❌ Database Connection Failures**

   - ✅ Verifique se o PostgreSQL está rodando
   - ✅ Confirme credenciais no .env
   - ✅ Certifique-se que o banco existe

2. **❌ S3 Upload Failures**

   - ✅ Verifique credenciais AWS
   - ✅ Confirme permissões do bucket
   - ✅ Valide configuração CORS
   - **🆘 SEM AWS?** Use alternativa local:
     ```javascript
     // backend/src/controllers/uploadController.ts
     // Comente o código AWS e use:
     const localPath = `./public/uploads/${filename}`;
     fs.writeFileSync(localPath, buffer);
     res.json({ imageUrl: `http://localhost:3001/uploads/${filename}` });
     ```

3. **❌ Build Errors**

   - ✅ Limpe node_modules e reinstale
   - ✅ Corrija erros de TypeScript
   - ✅ Verifique todas as dependências

4. **❌ Testes Falhando** (ESPERADO!)

   - ✅ Leia as mensagens de erro
   - ✅ Encontre assertions incorretas
   - ✅ Corrija as expectativas dos testes

5. **❌ Docker Não Sobe**
   - ✅ Verifique configurações de segurança
   - ✅ Adicione health checks
   - ✅ Configure restart policies

## 🎯 **BOA SORTE NO DESAFIO!**

Lembre-se: **O objetivo é demonstrar suas habilidades de debugging, otimização e melhores práticas!**

## 📤 **Como Enviar Seu Desafio Técnico**

### 🍴 **Passo a Passo para Fork e Pull Request:**

#### **1. Fork do Repositório** (2 min)

```bash
# 1. Clique em "Fork" no GitHub (canto superior direito)
# 2. Isso criará uma cópia do repo na sua conta
# 3. Clone SEU fork (não o original):

git clone https://github.com/SEU-USUARIO/tech-challenge.git
cd tech-challenge

# 4. Adicione o repo original como upstream (para futuras atualizações):
git remote add upstream https://github.com/inovaulaorg/tech-challenge.git
```

#### **2. Crie uma Branch para Suas Correções** (1 min)

```bash
# Crie uma branch descritiva:
git checkout -b feature/correcoes-desafio-tecnico

# Ou use seu nome:
git checkout -b fix/joao-silva-solucoes

# Ou por categoria de correções:
git checkout -b fix/performance-security-tests
```

#### **3. Trabalhe nas Correções** (30-60 min)

```bash
# Faça suas correções nos arquivos
# Execute os testes após cada correção:
npm test

# Faça commits frequentes e descritivos:
git add .
git commit -m "fix: corrigir N+1 queries em postController com eager loading"

git add backend/src/tests/auth.test.ts
git commit -m "fix: corrigir assertions quebradas nos testes de auth"

git add docker-compose.yml
git commit -m "security: adicionar secrets e health checks no Docker"

# Continue fazendo commits para cada correção...
```

#### **4. Documente Suas Correções** (10-15 min)

Crie um arquivo `SOLUCOES.md` na raiz do projeto:

```bash
# Crie o arquivo de documentação:
touch SOLUCOES.md
```

**Exemplo de conteúdo para `SOLUCOES.md`:**

````markdown
# 🔧 Soluções Implementadas - [Seu Nome]

## 📊 Resumo das Correções

- ✅ **N+1 Queries**: Implementado eager loading no postController
- ✅ **Testes Quebrados**: Corrigidas 8 assertions incorretas
- ✅ **Docker Inseguro**: Adicionados secrets e health checks
- ✅ **UX Problems**: Corrigidos hover states e responsividade
- ✅ **Validações**: Implementadas validações de input robustas

## 🚀 Performance - Antes vs Depois

### N+1 Query Problem (postController.ts)

**Antes**: 50 posts = 150+ queries

```javascript
// Código problemático encontrado
const posts = await Post.findAll();
for (const post of posts) {
  const comments = await Comment.findAll({ where: { postId: post.id } });
}
```
````

**Depois**: 50 posts = 1 query otimizada

```javascript
// Minha solução implementada
const posts = await Post.findAll({
  include: [
    { model: User, as: "author" },
    { model: Comment, as: "comments" },
  ],
});
```

## 🧪 Testes - Correções Implementadas

1. **auth.test.ts linha 45**:

   - Antes: `expect(user.username).toBe('wrongusername')`
   - Depois: `expect(user.username).toBe('testuser')`

2. **auth.test.ts linha 67**:
   - Antes: `expect(token).toBeUndefined()`
   - Depois: `expect(token).toBeDefined()`

## 🔐 Melhorias de Segurança

1. **Docker Secrets**: Senhas não mais em plain text
2. **Input Validation**: Joi schemas em todos os endpoints
3. **JWT Expiration**: Tokens agora expiram em 15min
4. **CORS**: Configuração restritiva implementada

## 💭 Considerações Adicionais

### O que faria diferente em produção:

- Rate limiting para APIs
- Logs estruturados com Winston
- Monitoramento com métricas
- Cache com Redis para queries frequentes

### Arquitetura sugerida para escala:

- Microserviços separados (auth, posts, media)
- Event-driven architecture
- Database read replicas
- CDN para assets estáticos

````

#### **5. Push e Abra Pull Request** (5 min)
```bash
# 1. Push sua branch:
git push origin feature/(LOGIN-CIN)-correcoes-desafio-tecnico

# 2. Vá ao GitHub e clique em "Compare & pull request"
# 3. Preencha título descritivo:
````

**Título da PR:**

```
[DESAFIO TÉCNICO] Correções de Performance, Segurança e Testes - João Silva (LOGIN-CIN)
```

**Descrição da PR:**

````markdown
## 🎯 Desafio Técnico - Correções Implementadas

Olá! Aqui estão as correções que implementei para resolver os problemas intencionais do desafio:

### ✅ **Problemas Resolvidos:**

#### 🔴 **Críticos - Resolvidos**

- [x] **N+1 Queries**: Implementado eager loading em `postController.ts`
- [x] **Testes Quebrados**: Corrigidas todas as assertions em `auth.test.ts`
- [x] **Docker Inseguro**: Adicionados secrets, health checks e restart policies

#### 🟡 **Importantes - Resolvidos**

- [x] **UX Issues**: Hover states funcionais no Header component
- [x] **Validações**: Input validation com Joi em todos os endpoints
- [x] **Security**: Hash de senhas, JWT expiration, CORS configuration

### 📊 **Impacto das Correções:**

- **Performance**: Redução de 150+ queries para 1 query otimizada
- **Testes**: 100% dos testes passando (antes 0%)
- **Segurança**: Vulnerabilidades críticas resolvidas
- **UX**: Interface responsiva e acessível

### 🧪 **Como Testar:**

```bash
# 1. Testes automatizados:
npm test  # Todos devem passar!

# 2. Build de produção:
npm run build  # Deve ser bem-sucedido

# 3. Docker:
docker-compose up -d  # Deve subir sem problemas
```
````

### 📖 **Documentação:**

- Ver `SOLUCOES.md` para detalhes técnicos completos
- Commits organizados por tipo de correção
- Código comentado onde necessário

### 💭 **Considerações:**

- Priorizada performance e segurança
- Mantida compatibilidade com arquitetura existente
- Implementadas best practices de desenvolvimento

**Disponível para discussão sobre as soluções implementadas!** 🚀

```

### 🎯 **Dicas para um Pull Request Perfeito:**

#### **✅ DO - Faça:**
- **Commits organizados** por tipo de correção
- **Título descritivo** na PR
- **Documentação clara** das mudanças
- **Testes funcionando** 100%
- **Código limpo** e comentado

#### **❌ DON'T - Evite:**
- Commit único gigante com tudo
- Título genérico tipo "fixes"
- PR sem descrição
- Código não testado
- Mudanças não relacionadas ao desafio

### 📋 **Checklist Final:**

Antes de abrir a PR, confirme:

- [ ] **Todos os testes passando** (`npm test`)
- [ ] **Build de produção funcionando** (`npm run build`)
- [ ] **Docker subindo corretamente** (`docker-compose up`)
- [ ] **Commits organizados** e com mensagens claras
- [ ] **SOLUCOES.md criado** com documentação
- [ ] **PR tem título e descrição detalhados**
- [ ] **Código revisado** e limpo

### 🏆 **Resultado:**

Com este processo, o **entrevistador consegue**:
- ✅ **Ver exatamente** o que você mudou (diff do GitHub)
- ✅ **Avaliar seu código** diretamente online
- ✅ **Entender sua abordagem** pela documentação
- ✅ **Testar localmente** fazendo checkout da sua branch
- ✅ **Dar feedback** específico linha por linha
- ✅ **Avaliar qualidade** dos commits e organização

**Isso facilita muito a avaliação e demonstra profissionalismo!** 🎉

---

## 📄 License
This project is licensed under the MIT License.
```
