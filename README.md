# OikosHR Backend Calcs 🔢

Servicio de Cálculos de OikosHR

> Las peticiones asíncronas como `POST /async/add` permiten al cliente enviar una petición sin necesidad de esperar por la respuesta. Son útiles para almacenar datos en bases de datos, sin embargo, no son útiles cuando se debe esperar el resutlado de una operación.

- Documentación de consumo de API en [Postman](server/postman_collection.json)

## Instalar ⚙

Requisitos

- [Node.js](https://nodejs.org/en/)

Pasos

1. Instalar dependencias de Node

```bash
npm install
```

2. Establecer variables de ambiente. Crear archivo `.env` a partir de [.env.example](.env.example)

```bash
cp .env.example .env
```

## Desarrollar 📟

```bash
npm run sls:offline start
```

## Desplegar 🚀

```bash
npm run sls:deploy -- -s <STAGE>
```

Ej.

```bash
npm run sls:deploy -- -s dev
```

> Despliega las funciones Lambda. Se pueden repetir los pasos de [configurar servicios en AWS](#configurar-servicios-en-aws-☁) para establecer unos diferentes para producción
