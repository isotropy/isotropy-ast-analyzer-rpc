Isotropy AST Analyzer for FS
============================

First, we need to create a JS file while represents or emulates our file system on the client-side.
Here's how you do that.

```javascript
import express from "isotropy-lib-express";

const app = express();

server.get("/api/add", (req, res) => {
  res.send(req.params.x + req.params.y);
})

server.post("/api/multiply", (req, res) => {
  res.send(req.body.x * req.body.y);
})

```

You should then be able to invoke these methods from anywhere with the HTML Fetch API.

```javascript
//HTTP GET
const sum = fetch("/api/add?x=10&y=20")

//HTTP POST
const product = fetch(
  "/api/multiply", 
  { body: { x: 10, y: 20 } }
)
```