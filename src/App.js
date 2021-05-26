const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger.json');
const LoginController = require('./controllers/LoginController');
const AppConstants = require('./enums/AppConstants');

class App {
    #controllers;

    iniciar() {
        // configurar o express
        this.#configurarExpress();
        // carregar os controllers
        this.#carregarControllers();
        // iniciar o servidor
        this.#iniciarServidor();
    }

    #configurarExpress = () => {
        // cria a instancia do express para gerenciar servidor
        this.express = express();

        // registra os middlewares para fazer a conversão das requisições da API
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(express.json());

        // configura o swagger da aplicação para servir a documentação
        this.express.use(
            `${AppConstants.BASE_API_URL}/docs`,
            swaggerUi.serve,
            swaggerUi.setup(swaggerFile)
            );


        // registra um middleware customisado que faz log das requisições
        this.express.use((req, res, next) => {
            console.log(`Requisição recebida, url: ${req.url}, método http: ${req.method}`);
            next();
        });
    }

    #carregarControllers = () => {
        // atribui para propriedade controllers a lista de controllers disponíveis da aplicação
        this.#controllers = [
            new LoginController(this.express)
        ];
    }

    #iniciarServidor = () => {
        // tenta pegar a porta a partir da variavel ambiente EXPRESS_PORT
        // se não estiver definida, usa a porta padrão
        const port = process.env.EXPRESS_PORT || 3001;
        this.express.listen(port, () => {
            console.log(`Aplicação executando na porta: ${port}`);
        });
    }

}

module.exports = App;