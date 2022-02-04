## Backend: tecnologias e versões

Foram utilizadas as seguintes tecnologias no backend:

- PHP 7.4.6 e Laravel API 8.82.0
- MySQL 5.7.31
- Composer 2.2.1

## Frontend: tecnologias e versões

Foram utilizadas as seguintes tecnologias no frontend:

- ReactJS 17.0.2 com Bootstrap 5.1.3
- Versão do Node utilizada: 14.11.0
- Versão do NPM: 6.14.8

## Ao clonar repositório

1. Rodar script SQL ```db.sql``` do repositório dentro do banco de dados MySQL
2. Entrar na pasta backend
3. Criar o arquivo de ambiente .env com base no arquivo .env.example e definir parâmetros de conexão do banco MySQL
    1. Nome do banco: app_clients
4. Executar comando ```composer install``` para instalar dependências
5. Executar comando ```php artisan serve``` para inicializar backend
6. Entrar na pasta frontend
7. Executar comando ```npm install``` para instalar dependências
8. Executar comando ```npm start```
9. Acessar sistema pela url http://localhost:3000
