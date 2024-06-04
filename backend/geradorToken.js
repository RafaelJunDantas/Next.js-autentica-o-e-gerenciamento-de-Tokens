const jwt = require('jsonwebtoken');

const SECRET_KEY = 'sdaddj284h413';

const myToken = jwt.sign(
  {
    name: 'Rafael',
  },
  SECRET_KEY,
  {
    expiresIn: '1d',
    subject: '1',
  },

);

const TOKEN_GERADO = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmFmYWVsIiwiaWF0IjoxNzE3NTA0MDA4LCJleHAiOjE3MTc1OTA0MDgsInN1YiI6IjEifQ.9XBM1CBzTA3qT6NcZBpEWbLy4hvw-XLsXaEEY26VmqA'

console.log(myToken);
console.log('------------------');
// console.log(jwt.verify(TOKEN_GERADO, SECRET_KEY));
console.log(jwt.decode(myToken));
