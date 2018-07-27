const jsonServer = require('json-server');
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults();
const cors = require('cors');

//JWT
const jwt = require('jsonwebtoken');
const fs = require('fs');
const SECRET_KEY = '123456789';
const expiresIn = '1h';
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'));

// multipart/form-data
var multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })

server.use(jsonServer.bodyParser);
server.use(cors({ origin: 'http://localhost:8100' }));
server.use(function (req, res, next) {
    setTimeout(next, 500); // delay w responsach
});

// obsługa logowania
server.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    console.log("req.body", req.body);
    if (isAuthenticated({ email, password }) === false) {
        const status = 401;
        const message = 'Incorrect email or password';
        res.status(status).json({ status, message });
        return;
    }
    const access_token = createToken({ email, password });
    res.status(200).json({ access_token });
});

// łapie inne ściezki niż logowanie, i jeżeli nie zgadza się token, to zwraca błąd 401
server.use(/^(?!\/auth).*$/, (req, res, next) => { // regex co łapie wszystko inne niż '/auth'; Negative Lookahead
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        const status = 401;
        const message = 'Bad authorization header';
        res.status(status).json({ status, message });
        return;
    }
    try {
        verifyToken(req.headers.authorization.split(' ')[1]);
        next();
    } catch (err) {
        const status = 401;
        const message = 'Error: access_token is not valid';
        res.status(status).json({ status, message });
    }
});

// obsługa uploadu, na prawdziwym serwerze zwróci miniaturę
server.post('/photos', upload.single('file'),  (req, res) => {
    console.log("File:", req.file);
    console.log("Body:", req.body);

    // odkomentować jedno z poniższych

    // tutaj zwraca albo błąd
    // res.status(500).json({
    //     message: "Błąd przetwarzaia zdjęcia"
    // });
    // albo oryginał przed chwilą przesłany
    res.status(200).sendFile('uploads/' + req.file.originalname, { "root": __dirname });
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

// Create a token from a payload
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

// Verify the token
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err);
}

// Check if the user exists in database
function isAuthenticated({ email, password }) {
    console.log("isAuthenticated userdb", userdb);
    console.log({ email, password });
    console.log(userdb.users.findIndex(user => user.email === email && user.password === password));
    return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1;
}