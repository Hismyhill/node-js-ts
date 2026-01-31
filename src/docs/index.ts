import { apiReference } from "@scalar/express-api-reference";
import { authPaths } from "./auth";

const openapiSpecification = {
  openapi: "3.0.0",
  info: {
    title: "Kolekto API",
    version: "1.0.0",
    description: "API documentation for Kolekto Backend",
  },
  servers: [
    {
      url: "/v1",
      description: "API Version 1",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    ...authPaths,
  },
};

export const apiDocsOptions = apiReference({
  theme: "purple",
  spec: {
    content: openapiSpecification,
  },
});
