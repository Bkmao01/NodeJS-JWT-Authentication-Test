const express = require('express');
const app = express();
const path = require('path');
const bodyParser= require('body-parser');
const port = 3000;
const { expressjwt: exjwt } = require('express-jwt');
app.use(bodyParser.json());
const secretKey ="My secret key"
const jwt=require('jsonwebtoken');

const jwtMW = exjwt({
    secret:secretKey,
    algorithms:['HS256']
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));



let users = [
    {
        id: 1,
        username: 'Ben',
        password: 'Mao'
    },
    {
        id: 2,
        username: 'Ben1',
        password: 'Mao1'
    }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    //console.log(username,password);
    //res.json({data: 'it works'});
    for (let user of users) {
        if (username == user.username && password == user.password) {
            let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '7d' });
            res.json({
                success: true,
                err: null,
                token
            });
            userFound = true; 
            break;
        }
    else {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Username or password is incorrect'
        });
    }
    }
});

app.get('/api/dashboard',jwtMW,(req,res)=>  {
    res.json({
        success:true,
        text:'Secret content that only logged in people can see'
    });
});

app.get('/api/prices',jwtMW,(req,res)=>  {
    res.json({
        success:true,
        text:'price is $3.99'
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        text: 'Settings content that only logged in people can see'
    });
});


app.use(function(err,req,res,next)  {
    if(err.name==='UnauthorizedError') {
    res.status(401).json({
        success:false,
        officialError: err,
        err: 'Username or Password is incorrect 2'
    });

}  
else {
    next(err);
}
});

app.listen(port, () => {
    console.log(`Serving on port: ${port}`);
});