# LMS Frontend (Angular 19)

Frontend do **Learning Management System**.

- **Stack:** Angular 19, TypeScript
- **Auth:** Basic Auth (via Interceptor)
- **Backend alvo:** Java 21 / Spring Boot 3.4 – padrão em `http://localhost:8080`

---

## 1) Pré-requisitos

- Node.js **20+**
- Angular CLI **19**  
  ```bash
  npm i -g @angular/cli
2) Configuração de ambiente
Edite src/environments/environment.ts (dev):

ts
Copy code
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080' // NÃO inclua /api aqui
};
Os services já montam as rotas como ${API_BASE}/api/..., evitando //.

3) Instalação
bash
Copy code
npm ci
# ou: npm install
4) Executar em desenvolvimento
bash
Copy code
npm start
# equivalente a "ng serve -o"
# abre em http://localhost:4200
Dica: se trocar URLs no environment.ts, pare o servidor (Ctrl+C) e rode de novo.

5) Autenticação e usuários de teste
O frontend usa HTTP Basic armazenado em sessionStorage:

sessionStorage['authHeader'] = "Basic <base64(user:pass)>"

sessionStorage['username'] = "<user>"

Usuários de teste (backend padrão):

admin / admin123 (ROLE_ADMIN)

student / student123 (ROLE_STUDENT)

Como logar
Acesse http://localhost:4200/login

Informe usuário e senha

Após login, a navbar mostra: “Logado como {username}” e o botão Sair

Verificação rápida (DevTools → Console)
js
Copy code
sessionStorage.getItem('authHeader'); // "Basic ABC..."
sessionStorage.getItem('username');   // "admin" ou "student"
Problemas comuns
401/403 em /students:

Verifique se fez login (vá em /login).

Em DevTools → Network, confira o header Authorization nas chamadas:

Deve aparecer: Authorization: Basic <token>

Algumas rotas podem exigir ROLE_ADMIN no backend (tente logar como admin/admin123).

6) Rotas principais
/login – tela de login

/students – lista de estudantes (com botão “+ Novo Estudante”)

/students/register – cadastro de estudante (validações no front)

Outras rotas (/courses, /enrollments) já existem e podem ser evoluídas.

7) Funcionalidades implementadas
Estudantes
Listagem: carrega do backend, mostra loading/erro/empty.

Cadastro:

Campos obrigatórios: Primeiro/Último nome, Data de nascimento (≥ 16), E-mail (único), Telefone.

Trata conflito de e-mail duplicado (HTTP 409).

Autenticação:

Login e Logout (limpa sessão e redireciona para /login).

Exibe usuário logado na navbar.

8) Build de produção
bash
Copy code
npm run build
# artefatos em ./dist/lms-frontend/
Servir o build (exemplos)
8.1) Com o próprio Angular (serve estático simples)
Use um servidor estático qualquer (ex.: npx http-server):

bash
Copy code
npx http-server ./dist/lms-frontend -p 4200 -a 0.0.0.0
# abre em http://localhost:4200
8.2) Nginx (produção)
Copie o conteúdo de ./dist/lms-frontend para /usr/share/nginx/html/

Certifique-se de ter um try_files para SPA no location /:

nginx
Copy code
location / {
  try_files $uri $uri/ /index.html;
}
Importante: O backend deve estar acessível pelo navegador (CORS liberado, se necessário).

9) Testes úteis
Ver se o backend responde (exemplos)
bash
Copy code
# listar estudantes (autenticação básica)
curl -i -u admin:admin123 http://localhost:8080/api/students

# cadastrar estudante
curl -i -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
        "firstName":"Ana",
        "lastName":"Silva",
        "birthDate":"2000-01-01",
        "email":"ana@example.com",
        "phone":"+55 47 99999-0000"
      }'
10) Estrutura (resumo)
bash
Copy code
src/
  app/
    app.component.(ts|html|scss)
    app-routing.module.ts
    core/
      interceptors/auth.interceptor.ts
      services/
        auth.service.ts
        students.service.ts
      models/
        student.model.ts
        ... (course/enrollment/tasklog, se aplicável)
    features/
      auth/
        login/
          login.component.(ts|html|css)
      students/
        students-list/
          students-list.component.(ts|html|css)
        students-create/
          students-create.component.(ts|html|css)
      # courses/, enrollments/ já existem para evolução
11) Roadmap / Trabalhos futuros
Cursos (ADMIN): CRUD completo, nome único, e regra “concluir ≤ 6 meses”.

Matrículas (STUDENT): limitar a 3 cursos ativos por estudante.

Task Logs (STUDENT):

Campos: data, categoria (PESQUISA, PRATICA, ASSISTIR_VIDEOAULA), descrição,

Tempo em incrementos de 30 min,

Editar / remover logs.

Guards de rota:

authGuard (rota exige login),

adminGuard (rota exige ROLE_ADMIN).

Tratamento de erros mais rico (toasts, i18n, etc).

Testes unitários em services/validators.

12) Licença
MIT (ou a de sua preferência)