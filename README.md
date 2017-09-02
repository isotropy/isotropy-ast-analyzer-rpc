Isotropy AST Analyzer for RPC
=============================
This module abstracts AST analysis for common RPCs so that they don't have to be repeated in every server plugin.
This is part of the isotropy framework (www.isotropy.org).

Create a module "server.js" containing a set of exported function that mock the server.
The filename can be changed in configuration.
```javascript
//In my-server/index.js
export function getAllTodos() {
  return todos
}
```

Perform a RPC
```javascript
import * as myServer from "../my-server";

async function getAllTodos() {
  return await myServer.postsAPI.getAllTodos();
}

```
