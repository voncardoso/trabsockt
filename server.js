// tratativa do documento estatico 
const express = require('express');
const path = require('path');

const app = express();
//web socket acessar o protocolo http
const server = require('http').createServer(app);
// protocolo de web cocket 
const io = require('socket.io')(server);

// cnfig diretorio dos arquivos publicos  
app.use(express.static(path.join(__dirname, 'public')));

// config o padrão do html 
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// dericionar para view index.hyml
app.use('/', (req, res)=>{
    res.render('index.html')
});

// armazenar todas as menssagens
let messages = [];

//conexão de novos clientes
io.on('connection', socket =>{
    //id
    console.log(`Socket conectado: ${socket.id}`);

    // envia todas as messagens anteriors para o usuraio 
    socket.emit('previousMessage', messages);

    // recebe os dados do front
    socket.on('sendMessage', data => {
        messages.push(data);

        //enviar msg para todos os sockets connectado na aplicação
        socket.broadcast.emit('receiveMessage', data)
    });

})

server.listen(3000);



