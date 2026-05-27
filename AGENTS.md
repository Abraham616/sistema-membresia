# Membresia-Cassava AI Agent Guide

## Project Overview
Coffee shop membership management system with stamp accumulation feature. Built with React 19 using class components and Bootstrap for UI.

## Key Conventions
- **Naming**: Use Spanish identifiers (componentes, usuarios, cargadatos)
- **Components**: Class components with `this.state` (legacy pattern)
- **API**: Fetch API with `.then()` chains (not async/await)
- **Styling**: Bootstrap 5 classes

## Build & Test
See [README.md](README.md) for standard Create React App scripts:
- `npm start` - Development server
- `npm test` - Jest tests (currently broken)
- `npm run build` - Production build

## Common Pitfalls
- **API URL**: Currently hard-coded ngrok tunnel URL in [Listar.js](src/componentes/Listar.js#L12) - use environment variables instead
- **Incomplete Features**: Crear.js and Editar.js are skeleton components - implement form functionality
- **Route Params**: Edit/Delete links missing user ID parameters
- **Tests**: App.test.js references non-existent content - update to match actual app structure

## Architecture
```
App.js (Router)
├── Listar (List members - implemented)
├── Crear (Create member - skeleton)
└── Editar (Edit member - skeleton)
```

API endpoints: GET `/membresias/` returns `{id, nombre, correo, ...}` array</content>
<parameter name="filePath">c:\Users\abrah\Documents\cruds\membresia-cassava\AGENTS.md