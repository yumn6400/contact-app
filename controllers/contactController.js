const { Contact, User } = require('../models');
const { parse } = require('url');
const { Op } = require('sequelize');

const parseRequestBody = (req, callback) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    callback(JSON.parse(body));
  });
};

const markSpam = async (req, res) => {
  parseRequestBody(req, async (data) => {
    const { phoneNumber } = data;
    try {
      const contact = await Contact.findOne({ where: { phoneNumber } });
      if (contact) {
        contact.spamCount += 1;
        await contact.save();
      } else {
        await Contact.create({ phoneNumber, spamCount: 1 });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Number marked as spam' }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(error));
    }
  });
};

const searchByName = async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { name } = parsedUrl.query;
  try {
    const users = await User.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`
        }
      },
      include: [{ model: Contact, as: 'contacts' }]
    });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(error));
  }
};

const searchByPhoneNumber = async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { phoneNumber } = parsedUrl.query;
  try {
    const contacts = await Contact.findAll({ where: { phoneNumber } });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(contacts));
  } catch (error) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(error));
  }
};

module.exports = { markSpam, searchByName, searchByPhoneNumber };
