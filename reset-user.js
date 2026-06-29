// node reset-user.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/seloria').then(async () => {
  const users = mongoose.connection.db.collection('users');
  const hashed = await bcrypt.hash('krunal123', 10);
  await users.updateOne({ email: 'krunal@gmail.com' }, { $set: { password: hashed } });
  console.log('✅ Password reset — email: krunal@gmail.com  password: krunal123');
  await mongoose.disconnect();
});
