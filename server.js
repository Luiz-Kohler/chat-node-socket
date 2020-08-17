//Instanciando o express
const express = require('express')

//Instanciando o path
const path = require('path');

//Criando aplicação
const app = express();

//Informando o protocolo htpp para nossa aplicação
const server = require('http').createServer(app)

//Informando o protocolo socket.io para nossa aplicação e chamando a mesma
const io = require('socket.io')(server)

//Informando onde vai ficar o font-end
app.use(express.static(path.join(__dirname, 'public')))

//Informando onde irão ficar as views
app.set('views', path.join(__dirname, 'public'))

//Configuração para usar HTML para as views
app.engine('html', require('ejs').renderFile)

//Usando configuração HTML
app.set('view engine', 'html')

//Rota padrão
app.use('/', (request, response) => {
    //Carregando a tela index nessa requisição
    response.render('index.html')
})

//Lugar onde vai armazenar todas as mensagens = Bd
let messages = []

//Toda vez que alguem se conectar,
io.on('connection', socket => {

    //id gerado do socket.io
    console.log(`socket conectado: ${socket.id}`)

    //Enviando todas as mensagens assim que o socket conectar
    socket.emit('previousMessage', messages);

    //Função chamada pelo front
    socket.on('sendMessage', data => {
        //adicionando mensagem para o array
        messages.push(data)

        //emit: enviar unicamente para o socket do contexto
        //on: ouvir algo
        //broadcast.emit: enviar para os demais socket

        //Enviando as mensagens para os socket's
        socket.broadcast.emit('receivedMessage', data)

        console.log('Mensagem enviada com sucesso')
    })
})

//Declarando a porta que app vai escutar
const port = 3000;

//informando a porta
server.listen(port)