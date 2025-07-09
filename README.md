# T2 – Interface Gráfica para Sistema de Gestão de Comércio Pet

## 1. Introdução

Este projeto é a atividade 2 da avaliação passada pelo professor Gerson da Pinha Neto, cujo objetivo é implementar uma GUI para um sistema que lojas do "mercado pet" devem poder utilizar para administrar seus negócios.

## 2. Funcionalidades
- Clientes: criar, editar, excluir e listar;

- Pets: criar vinculando a um cliente via CPF, editar, excluir e listar;

- Produtos e Serviços: criar, editar, excluir e listar;

- Registro de consumo: selecionar cliente, pet, item, quantidade e tipo;

- Relatórios:

  - Top 5 produtos mais consumidos,

  - Top 5 serviços mais consumidos,

  - Itens mais consumidos por tipo e raça de pets,

  - Top 10 clientes por quantidade consumida,

  - Top 5 clientes por valor consumido.

## 3. Tecnologias utilizadas

- **React 18.2.0** – Biblioteca para construção de interfaces.

- **React DOM 18.2.0** - Integra o React à árvore DOM do navegador.

- **TypeScript 4.9.5** – Superset do JavaScript com tipagem estática.

- **Bootstrap 5.3.0** – Framework CSS para layout e componentes responsivos.

- **React Scripts 5.0.1** – Scripts de build, teste e execução (via create-react-app).

- **Web Vitals 2.1.4** – Coleta de métricas de performance.

- **Node.js 23.5.0** - Utilizado como ambiente para rodar e compilar o projeto React (via npm).

## 4. Estrutura do projeto

```
T2/
├── public/
│   ├── favicon.ico
│   ├── index.html   
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── componentes/
│   │   └── barraNavegacao.tsx
│   ├── paginas/
│   │   ├── cadastro.tsx
│   │   ├── clientes.tsx
│   │   ├── login.tsx
│   │   ├── pets.tsx
│   │   ├── produtos.tsx
│   │   └── servicos.tsx
│   ├── index.css
│   ├── index.tsx
│   ├── logo.svg
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   └── setupTests.ts      
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json

```

## 5. Instruções para execução
Siga os passos abaixo para executar o projeto localmente:

**1 -> Clone o repositório:**

```
git clone https://github.com/juliasoares17/T2
cd T2
```
**2 -> Instale as dependências:**

```
npm install
```
ℹ️ **Observação:** Durante a instalação (`npm install`), alguns avisos de dependências desatualizadas podem aparecer. Isso não compromete a execução do projeto.

**3 -> Inicie o projeto:**

```
npm start
```
**4 -> Acesse no navegador:**

Abra o endereço http://localhost:3000 para visualizar a interface.

Para finalizar a execução do projeto, basta retornar ao terminal, digitar CTRL + C e confirmar a finaização digitando "s".

## 6. Considerações finais
Esta atividade teve como objetivo desenvolver a base da interface gráfica do sistema de gestão pet, utilizando somente componentes de classe, conforme exigido, e deixando o produto preparado para modernização visual e futura integração com backend e banco de dados.


