const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config();

mongoose
  .connect(process.env.dburl)
  .then (() => console.log('Database connected successfully'))
  .catch ((err) => console.log('Can not connect to database'));

const port = process.env.port || 3000;
console.log(process.env.NODE_ENV);
// if(process.env.NODE_ENV === 'development') {
  app.listen(port, ()=> console.log(`Server running on port http://localhost:${port}`));
// } else {
  // console.log('Can not run the production UNIT.');
// }

