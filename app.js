const express = require('express');
const app= express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require('express-session');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.use(express('./public'));
app.set('view engine', 'ejs');

const allUser = [];//存放用户名单


app.get('/',(req,res,next)=>{
    res.render('index')
})

app.get('/checkuser',(req,res,next)=>{
    let username = req.query.username;
    if(!username){
        res.send('给我回去填昵称去');
        return;
    }
    if(allUser.indexOf(username) != -1){
        res.send('这昵称用过了欸，换个吧')
        return;
    }
    allUser.push(username);
    req.session.username = username;
    res.redirect('/chatroom')
})

app.get('/chatroom',(req,res,next)=>{
    if(!req.session.username){
        res.redirect('/');
        return;
    }
    res.render('chatroom',{
        'username': req.session.username
    })
})

io.on('connection',(socket)=>{
    socket.on('content',(msg)=>{
        io.emit('content',msg)
    })
})

http.listen(80);