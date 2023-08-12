const http = require('http');
const url = require('url');

let items = [];
let itemIdCounter = 1;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'POST' && parsedUrl.pathname === '/items') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const newItem = JSON.parse(body);
      newItem.id = itemIdCounter++;
      items.push(newItem);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newItem));
    });
  } else if (req.method === 'GET' && parsedUrl.pathname === '/items') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(items));
  } else if (req.method === 'GET' && parsedUrl.pathname.startsWith('/items/')) {
    const itemId = parseInt(parsedUrl.pathname.split('/')[2], 10);
    const item = items.find(item => item.id === itemId);

    if (item) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(item));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Item not found');
    }
  } else if (req.method === 'PUT' && parsedUrl.pathname.startsWith('/items/')) {
    const itemId = parseInt(parsedUrl.pathname.split('/')[2], 10);
    const existingItem = items.find(item => item.id === itemId);

    if (existingItem) {
      let body = '';

      req.on('data', chunk => {
        body += chunk.toString();
      });

      req.on('end', () => {
        const updatedItem = JSON.parse(body);
        existingItem.name = updatedItem.name;
        existingItem.price = updatedItem.price;
        existingItem.size = updatedItem.size;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(existingItem));
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Item not found');
    }
  } else if (req.method === 'DELETE' && parsedUrl.pathname.startsWith('/items/')) {
    const itemId = parseInt(parsedUrl.pathname.split('/')[2], 10);
    const index = items.findIndex(item => item.id === itemId);

    if (index !== -1) {
      items.splice(index, 1);
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Item not found');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Invalid endpoint');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
