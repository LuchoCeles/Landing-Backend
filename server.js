const app = require('./app');
const http = require('http');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});