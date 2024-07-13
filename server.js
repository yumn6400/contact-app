const http = require('http');
const url = require('url');
const { sequelize } = require('./models');
const userController = require('./controllers/userController');
const contactController = require('./controllers/contactController');

const requestListener = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log(parsedUrl)
  const path = parsedUrl.pathname;
  const method = req.method;
  if (path === '/' && method === 'GET') {
    console.log("Welcome to contact application")
  }
  if (path === '/register' && method === 'POST') {
    userController.register(req, res);
  } else if (path === '/login' && method === 'POST') {
    userController.login(req, res);
  } else if (path === '/spam' && method === 'POST') {
    contactController.markSpam(req, res);
  } else if (path.startsWith('/search/name') && method === 'GET') {
    contactController.searchByName(req, res);
  } else if (path.startsWith('/search/phone') && method === 'GET') {
    contactController.searchByPhoneNumber(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
};

const server = http.createServer(requestListener);
const PORT =  3000;
sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
