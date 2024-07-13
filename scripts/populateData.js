const { User, Contact } = require('../models');
const bcrypt = require('bcryptjs');

const createRandomUsers = async (numUsers) => {
  for (let i = 0; i < numUsers; i++) {
    const name = `User${i}`;
    const phoneNumber = `123456789${i}`;
    const email = `user${i}@example.com`;
    const password = await bcrypt.hash('password', 8);
    await User.create({ name, phoneNumber, email, password });
  }
};

const createRandomContacts = async (numContacts) => {
  const users = await User.findAll();
  for (let i = 0; i < numContacts; i++) {
    const name = `Contact${i}`;
    const phoneNumber = `987654321${i}`;
    const userId = users[Math.floor(Math.random() * users.length)].id;
    await Contact.create({ name, phoneNumber, userId });
  }
};

const populateData = async () => {
  await createRandomUsers(10);
  await createRandomContacts(50);
};

populateData().then(() => {
  console.log('Data populated');
  process.exit();
}).catch(err => {
  console.error('Error populating data:', err);
  process.exit(1);
});
