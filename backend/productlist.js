const http = require("http");
const fs = require("fs");
const url = require("url");
const productlist = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }
  // --- GET /products ---
  if (pathname === "/products" && req.method === "GET") {
    fs.readFile("products.json", "utf8", (err, data) => {
      if (err) return sendResponse(res, 500, { error: "File read error" });

      let products;
      try {
        products = JSON.parse(data);
      } catch {
        return sendResponse(res, 500, { error: "Invalid JSON format" });
      }
      // Search
      if (query.search) {
        const keyword = query.search.toLowerCase();
        products = products.filter((p) => p.name.toLowerCase().includes(keyword));
      }
      // Category filter
      if (query.category) {
        products = products.filter(
          (p) => p.category.toLowerCase() === query.category.toLowerCase()
        );
      }
      // Price filter
      if (query.minPrice) products = products.filter((p) => p.price >= parseInt(query.minPrice));
      if (query.maxPrice) products = products.filter((p) => p.price <= parseInt(query.maxPrice));
      // Sorting
      if (query.sortBy === "price") products.sort((a, b) => a.price - b.price);
      if (query.sortBy === "pricedesc") products.sort((a, b) => b.price - a.price);
      if (query.sortBy === "name") products.sort((a, b) => a.name.localeCompare(b.name));
      sendResponse(res, 200, products);
    });
  } 
  // --- POST /add-products ---
  else if (pathname === "/add-products" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk.toString());
    req.on("end", () => {
      try {
        const newProduct = JSON.parse(body);
        fs.readFile("products.json", "utf8", (err, data) => {
          if (err) return sendResponse(res, 500, { error: "File read error" });
          let products = JSON.parse(data);
          const lastId = products.length > 0 ? products[products.length - 1].id : 0;
          newProduct.id = lastId + 1;
        products.push(newProduct);
          fs.writeFile("products.json", JSON.stringify(products, null, 2), "utf8", err => {
            if (err) return sendResponse(res, 500, { error: "File write error" });
            sendResponse(res, 200, { message: "Product added successfully" });
          });
        });
      } catch {
        sendResponse(res, 400, { error: "Invalid JSON" });
      }
    });
  } 
  else {
    sendResponse(res, 404, { error: "Route not found" });
  }
});
function sendResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

productlist.listen(1403, () => console.log("Server running at http://localhost:1403"));
