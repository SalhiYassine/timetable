import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('password', 10),
    isAdmin: true,
  },
  {
    name: 'John',
    email: 'john@example.com',
    password: bcrypt.hashSync('password', 10),
  },
  {
    name: 'Jane',
    email: 'jane@example.com',
    password: bcrypt.hashSync('password', 10),
  },
];

export default users;
