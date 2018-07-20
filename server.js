const jsonServer = require('json-server');
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults();
const cors = require('cors');

server.use(cors({ origin: 'http://localhost:8100' }));
server.use(function (req, res, next) {
    setTimeout(next, 500); // delay w responsach
});

server.patch('/people/1', (req, res) => {
    res.status(409).json({
        message: "Błąd zapisu. Konflikt danych."
    });
});

server.use(middlewares)
server.use(router)
server.listen(3000, () => {
    console.log('Fake Hig Server is running on port 3000')
})