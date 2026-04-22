# LogFit-2.0
O LogFit é uma aplicação fullstack projetada para ajudar usuários a monitorar sua ingestão diária de água e calorias. Esta versão 2.0 evolui de um sistema baseado em armazenamento local para uma plataforma robusta com autenticação, persistência em nuvem e uma base de dados nutricional proprietária.

Confira meu projeto em: https://logfit20.vercel.app/

---

## Tecnologias:

### Frontend
- React (Vite): Biblioteca principal para a interface.
- TypeScript: Tipagem estática para maior segurança e produtividade.
- Tailwind CSS: Estilização baseada em classes utilitárias.
- React Router: Gerenciamento de rotas (Login, Cadastro, Dashboard).
- Axios: Cliente HTTP para comunicação com o Backend.

### Backend
- Node.js & Express: Servidor e gerenciamento de rotas.
- MongoDB & Mongoose: Banco de dados NoSQL e modelagem de dados.
- JWT (JSON Web Token): Autenticação e segurança de rotas.
- Winston & Morgan: Sistema de logs e monitoramento de requisições.
- Bcrypt: Criptografia de senhas para segurança do usuário.

---

## Arquitetura do Sistema

A aplicação segue o modelo de arquitetura cliente-servidor, garantindo que os dados do usuário sejam persistidos de forma segura e acessíveis de qualquer lugar.

---

## Funcionalidades Planejadas (MVP)

1. Gestão de Usuários
- Cadastro de novos usuários com senha criptografada.
- Login com geração de token JWT.
- Proteção de rotas (apenas usuários logados acessam o Dashboard).

2. Módulo de Hidratação
- Registro de ingestão de água (ml/litros).
- Visualização da soma total consumida nas últimas 24 horas.
- Histórico de registros com timestamp.

3. Módulo de Calorias
- Busca de alimentos via API externa (FatSecret) => Posteriormente migrado para base local em razão de limitações da API externa envolvendo Auth 2.0.
- Cálculo automático de calorias com base na porção informada.
- Soma diária de calorias consumidas com reset automático de visualização após 24h.

## Desafios Técnicos & Decisões de Projeto

### Migração de Dados (ETL Simplificado):

Um dos maiores desafios foi a transição da API externa para a base local. Foi necessário realizar importação de um arquivo JSON com mais de 600 registros para o MongoDB, garantindo que o esquema de dados (Mongoose) fosse flexível o suficiente para lidar com diferentes tipos de valores nutricionais.

### Segurança e Persistência Volátil:

A aplicação implementa uma regra de negócio de expiração de dados de 24 horas via Índices TTL (Time To Live) do MongoDB. Isso garante que o dashboard do usuário mantenha o foco no ciclo diário de consumo, otimizando o armazenamento e respeitando o propósito de uso imediato da ferramenta.

### Otimização de Busca:

Para garantir que a busca de alimentos fosse performática mesmo com uma base local crescente, foi implementado um Índice de Texto no MongoDB, permitindo buscas por termos parciais e insensibilidade a maiúsculas/minúsculas.

## Diferenciais da Versão 2.0

- Autonomia: Independência de APIs externas para o catálogo de alimentos.
- Tipagem Estrita: Uso de interfaces TypeScript em todo o fluxo (do Schema ao Componente), garantindo que a troca de nomes de campos (ex: food_name para description) fosse feita sem quebras silenciosas.
- UX Consciente: Interface limpa que prioriza a precisão nutricional ao adotar a gramatura como unidade padrão.
