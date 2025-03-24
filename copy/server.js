const app = require('./app');

const PORT = 8080;
const HOST = '148.213.41.139';
app.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
