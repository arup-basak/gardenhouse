# Server Documentation

This document provides an overview of the server-side implementation of the application.

## Routes

The server defines the following routes:

* **`/api/v1/user`**: Handles customer user operations.
    * `POST /`: Creates a new customer user. Requires authentication.
    * `GET /:id`: Retrieves a specific customer user by ID. Requires authentication.
    * `PUT /:id`: Updates a specific customer user by ID. Requires authentication.
    * `DELETE /:id`: Deletes a specific customer user by ID. Requires authentication.
* **`/api/v1/gardener`**: Handles gardener user operations.
    * `POST /`: Creates a new gardener user. Requires authentication.
    * `GET /:id`: Retrieves a specific gardener user by ID. Requires authentication.
    * `PUT /:id`: Updates a specific gardener user by ID. Requires authentication.
    * `DELETE /:id`: Deletes a specific gardener user by ID. Requires authentication.
* **`/api/v1/auth`**: Handles authentication operations.
    * `POST /register`: Registers a new user.
    * `POST /login`: Logs in an existing user.
    * `GET /me`: Retrieves the current user's information. Requires authentication.
* **`/api/v1/order`**: Handles order operations.
    * `GET /`: Retrieves all orders. Requires authentication.
    * `GET /:id`: Retrieves a specific order by ID. Requires authentication.
    * `POST /`: Creates a new order. Requires authentication.
    * `PUT /:id`: Updates the status of a specific order by ID. Requires authentication.
* **`/healthcheck`**: Returns the server's health status.

## Controllers

The server uses controllers to handle requests for each route.  The controllers are located in the `src/controller` directory.  Each controller contains methods that correspond to the HTTP methods for the route.  For example, the `UserController` has methods for `createUser`, `updateUser`, `deleteUser`, `getAllUsers`, and `getUser`.

## Index.ts

The `index.ts` file is the entry point for the server. It initializes the Express app, sets up middleware, defines routes, and starts the server.  It uses the following middleware:

* **`cors`**: Enables Cross-Origin Resource Sharing.
* **`helmet`**: Sets various HTTP headers to improve security.
* **`bodyParser`**: Parses request bodies.
* **`morgan`**: Logs HTTP requests.

The `index.ts` file also defines a health check route (`/healthcheck`) and a 404 handler for routes that are not found.