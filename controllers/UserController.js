const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { parse } = require('url');
const { Buffer } = require('buffer');

const parseRequestBody = (req, callback) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    callback(JSON.parse(body));
  });
};

const register = async (req, res) => {
  parseRequestBody(req, async (data) => {
    const { name, phoneNumber, email, password } = data;
    const hashedPassword = await bcrypt.hash(password, 8);
    try {
      const user = await User.create({ name, phoneNumber, email, password: hashedPassword });
      const token = jwt.sign({ id: user.id }, 'secretKey');
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ user, token }));
    } catch (error) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(error));
    }
  });
};

const login = async (req, res) => {
  parseRequestBody(req, async (data) => {
    const { phoneNumber, password } = data;
    try {
      const user = await User.findOne({ where: { phoneNumber } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid login credentials' }));
        return;
      }
      const token = jwt.sign({ id: user.id }, 'secretKey');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ user, token }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(error));
    }
  });
};
module.exports = { register, login };
