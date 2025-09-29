const http = require("http");

let users = [
    { id: 1, name: "Thendral" },
    { id: 2, name: "Ammu" }
];

const app = http.createServer((req, res) => {
    // CORS headers
res.setHeader("Access-Control-Allow-Origin", "*"); // allow requests from any origin
res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS"); // allowed methods
res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // allowed headers

    res.writeHead(200, { 'Content-Type': 'application/json' });

    // GET: Home
    if (req.url == '/' && req.method == 'GET') {
        res.end(JSON.stringify({ message: "Welcome to API" }));

    // GET: All users
    } else if (req.url == "/users" && req.method == "GET") {
        res.end(JSON.stringify({ users }));

    // GET: Single user by ID
    } else if (req.url.startsWith("/user/") && req.method == "GET") {
        const id = parseInt(req.url.split("/")[2]);
        const user = users.find(u => u.id == id);
        if (user) {
            res.end(JSON.stringify(user));
        } else {
            res.end(JSON.stringify({ error: "User not found" }));
        }

    // POST: Add new user
    } else if (req.url == "/users" && req.method == 'POST') {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const { name } = JSON.parse(body);
                const newUser = { id: users.length + 1, name };
                users.push(newUser);
                res.end(JSON.stringify({ message: "New user added", user: newUser }));
            } catch {
                res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
        });

    // POST: Update user
    } else if (req.url.startsWith("/user/") && req.method == 'POST') {
        const id = parseInt(req.url.split("/")[2]);
        let body = '';
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const { name } = JSON.parse(body);
                let user = users.find(u => u.id === id);
                if (user) {
                    user.name = name;
                    res.end(JSON.stringify({ message: "User updated", user }));
                } else {
                    res.end(JSON.stringify({ error: "User not found" }));
                }
            } catch {
                res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
        });

    // DELETE: Remove user
    } else if (req.url.startsWith("/user/") && req.method == "DELETE") {
        const id = parseInt(req.url.split("/")[2]);
        const index = users.findIndex(u => u.id == id);
        if (index !== -1) {
            const deletedUser = users.splice(index, 1);
            res.end(JSON.stringify({ message: "User deleted", user: deletedUser[0] }));
        } else {
            res.end(JSON.stringify({ error: "User not found" }));
        }

    // Invalid route
    } else {
        res.end(JSON.stringify({ error: "Invalid request" }));
    }
});

app.listen(1433, () => {
    console.log("Server running at http://localhost:1433");
});
