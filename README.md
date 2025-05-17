# PerfexCRM MCP Server

Este é um MCP Server que fornece integração com a API do PerfexCRM para uso com agentes de IA através do N8N.

## Funcionalidades

- Autenticação com a API do PerfexCRM
- Gerenciamento completo de Customers (CRUD)
  - Listar todos os customers
  - Buscar customer por ID
  - Criar novo customer
  - Atualizar customer existente
  - Deletar customer

## Requisitos

- Node.js 18 ou superior
- NPM ou Yarn
- Acesso à API do PerfexCRM

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd perfex-mcp-server
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações do PerfexCRM.

## Uso

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

### Integração com N8N

1. No N8N, adicione um novo nó "MCP Trigger"
2. Configure o nó com a URL do seu MCP Server
3. Selecione as tools que deseja utilizar

## Tools Disponíveis

### Autenticação
- `validate-perfex-auth`: Valida a chave de API do PerfexCRM

### Customers
- `list-customers`: Lista todos os customers
- `get-customer`: Busca um customer específico por ID
- `create-customer`: Cria um novo customer
- `update-customer`: Atualiza um customer existente
- `delete-customer`: Remove um customer

## Estrutura do Projeto

```
src/
  ├── index.ts              # Ponto de entrada da aplicação
  ├── services/            # Serviços de negócio
  │   ├── auth.service.ts
  │   └── customer.service.ts
  ├── tools/              # Definição das tools do MCP
  │   ├── auth.tools.ts
  │   └── customer.tools.ts
  └── utils/              # Utilitários
      └── logger.ts
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

MIT 