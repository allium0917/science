import pool from './config/db.js';

// Express 설정
const express = require('express');
const app = express();

// EJS 설정
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Express-Session 설정
const session = require('express-session');

app.use(session({
    secret: 'mynodejs',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// <form> 태그 사용 시 필요한 폼 데이터 파싱 코드
app.use(express.urlencoded({ extended: true }));

const client = new pg.Client(dbconfig);

app.get('/', (req, res) => {
    if (req.session.user) {
        res.render('index', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { uid, password } = req.body;

    client.query(`
        SELECT uid, username
        FROM accounts
        WHERE uid = $1 AND password = encode(digest($2, 'sha256'), 'hex')`,
        [uid, password])
        .then(result => {
            const user = result.rows[0];
            if (user) {
                req.session.user = user.username;
            }

            return res.redirect('/');
        })
        .catch(err => {
            console.error('로그인 오류', err);
            return res.status(500).send('서버 오류' + err.message);
        });
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});