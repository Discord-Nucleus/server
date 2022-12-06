<p align="center">
  <a href="" rel="noopener">
  <img width=200px height=200px src="assets/icon.svg" alt="Project logo"></a>
</p>

<h3 align="center">@discord-nucleus/server</h3>

<div align="center">

![Status](https://img.shields.io/badge/status-active-success.svg)
[![GitHub Issues](https://img.shields.io/github/issues/discord-nucleus/server.svg)](https://github.com/discord-nucleus/server/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/discord-nucleus/server.svg)](https://github.com/discord-nucleus/server/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> Customizable express-based server!
    <br> 
</p>

## 📝 Table of Contents

- [Installing](#installing)
- [Usage](#usage)

## 📦️ Installing <a name = "installing"></a>

> ### <img align="center"  width=20px height=20px src="assets/npm.svg" /> NPM
>
> ```sh
> npm install @discord-nucleus/server
> ```

> ### <img align="center"  width=20px height=20px src="assets/yarn.svg" /> Yarn
>
> ```sh
> yarn add @discord-nucleus/server
> ```

## 🔍️ Usage <a name="usage"></a>

> ### 🚀 Example Server
>
> In `index.ts`:
>
> ```ts
> import { Server, ServerOptions } from "@discord-nucleus/server";
> import { join } from "path";
>
> // You can customize server by extending him
> class MyServer extends Server {
>   // Error handler
>   protected override errorHandler(error: Error, request: Request, response: Response, next: > NextFunction): void {
>     response.status(500).send("Oops... Something went wrong!");
>   }
>   // Not found handler
>   protected override notFoundHandler(request: Request, response: Response, next: NextFunction): > void {
>     response.status(404).send("The requested URL was not found on this server!");
>   }
>   // Called after server instance initialization
>   protected override initialize(): void {
>     // Actually this function adds core-middlewares, so you need to call super
>     super.initialize();
>     // Anything else...
>   }
> }
>
> // Define server configuration
> const config: ServerOptions = {
>   port: 3000,
>   host: "127.0.0.1",
> };
>
> // Create new server
> const server = new MyServer(config);
>
> // Load routes from `./routes` directory
> server.registerRoutes(path.join(__dirname, "routes"));
>
> // Log when server gets ready
> server.on("ready", () => console.log("Ready!"));
>
> // Finally start server
> server.start();
> ```

> ### 🌌 Example Route
>
> In `routes/index.ts`:
>
> ```ts
> import { Route, middleware } from "@discord-nucleus/server";
> import type { Request, Response, NextFucnction } from "express";
>
> // Dummy showcase-only middleware
> const dummyMiddleware = (text: string) => (request: Request, response: Response, next: > NextFunction) => {
>   console.log(text);
>   next();
> };
>
> // Create a class that extends Route
> export default class extends Route {
>   // Adding middlewares
>   @middleware(dummyMiddleware("hello"))
>   @middleware(dummyMiddleware("world"))
>   // Method handler
>   protected override get(request: Request, response: Response, next: NextFunction): void {
>     response.send("Hello World!");
>   }
>
>   // Another way to add middlewares
>   @middleware(dummyMiddleware("hello"), dummyMiddleware("world"))
>   // Method handler
>   protected override async post(request: Request, response: Response, next: NextFunction): > Promise<void> {
>     response.send("Hello World!");
>   }
> }
> ```

> ### 🌌 Example Routes Folder
>
> In `routes/**/*.(js|ts)`:
>
> ```ini
> .
> ├── channels/
> │   ├── [channel_id]/
> │   │   ├── followers.ts
> │   │   ├── index.ts
> │   │   └── messages/
> │   │       ├── [message_id]/
> │   │       │   └── ack.ts
> │   │       ├── bulk-delete.ts
> │   │       └── index.ts
> │   ├── permissions.ts
> │   ├── pins.ts
> │   ├── purge.ts
> │   └── typing.ts
> └── guilds/
>     ├── index.ts
>     └── templates/
>         ├── index.ts
>         └── [guild_id]/
>             ├── audit-logs.ts
>             ├── bans.ts
>             └── index.ts
> ```
>
>> **Note**
>>
>> You can add brackets to route path to create a dynamic route