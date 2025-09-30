const http = require("http");
const fs = require("fs");
const url = require("url");

const fstask = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  let body = "";
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", () => {
    if (pathname == "/register" && req.method == "POST") {
      const { username, password } = JSON.parse(body);
      fs.readFile("users.json", "utf8", (err, data) => {
        if (err) return sendResponse(res, 500, { error: "File read error" });
        const users = JSON.parse(data);
        const exists = users.find((u) => u.username == username);
        if (exists) return sendResponse(res, 400, { error: "User already exists" });
        users.push({ username, password });
        fs.writeFile("users.json", JSON.stringify(users, null, 2), "utf8", (err) => {
          if (err) return sendResponse(res, 500, { error: "File write error" });
          sendResponse(res, 200, { message: "Registration successful" });
        });
      });
    } else if (pathname == "/login" && req.method == "POST") {
      const { username, password } = JSON.parse(body);
      fs.readFile("users.json", "utf8", (err, data) => {
        if (err) return sendResponse(res, 500, { error: "File read error" });
        const users = JSON.parse(data);
        const user = users.find((u) => u.username == username && u.password == password);
        if (!user) return sendResponse(res, 401, { error: "Invalid credentials" });
        sendResponse(res, 200, { message: "Login successful" });
      });
    } else if (pathname == "/forgot-password" && req.method == "POST") {
      const { username, newPassword } = JSON.parse(body);
      fs.readFile("users.json", "utf8", (err, data) => {
        if (err) return sendResponse(res, 500, { error: "File read error" });
        const users = JSON.parse(data);
        const userIndex = users.findIndex((u) => u.username == username);
        if (userIndex == -1) return sendResponse(res, 404, { error: "User not found" });
        users[userIndex].password = newPassword;
        fs.writeFile("users.json", JSON.stringify(users, null, 2), "utf8", (err) => {
          if (err) return sendResponse(res, 500, { error: "File write error" });
          sendResponse(res, 200, { message: "Password updated successfully" });
        });
      });
    } else {
      sendResponse(res, 404, { error: "Route not found" });
    }
  });
});

function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", 
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

fstask.listen(1433, () => console.log(`Server running at http://localhost:1433`));
