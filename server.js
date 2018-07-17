const jsonServer = require('json-server');
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults();

server.use(function (req, res, next) {
    setTimeout(next, 500); // delay w responsach
});
server.use(middlewares)
server.use(router)
server.listen(3000, () => {
    console.log('Fake Hig Server is running on port 3000')
})