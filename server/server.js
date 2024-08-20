require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

// Crie o app Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para parseamento de JSON
app.use(express.json());

// Middleware para servir arquivos estáticos da build do React
app.use(express.static(path.join(__dirname, '../build')));

// Definição do esquema e modelo de usuário
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const User = mongoose.model('User', userSchema);

// Rotas da API
app.get('/api/test', (req, res) => {
    res.send('API funcionando!');
});

app.get('/api', (req, res) => {
    res.send('API funcionando!');
});

//Rota privada
app.get("/user/:id", checkToken, async(req, res) =>{
    const id = req.params.id
    //vou checar no banco
    const user = await User.findById(id, '-password')
    if(!user){
        return res.status(404).json({msg: 'Usuário não encontrado.'})
    }
    res.status(200).json({user})
})

function checkToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]

    if(!token){
        return res.status(401).json({msg: "Acesso negado."})
    }

    try{
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    }catch(error){
        res.status(400).json({msg: "Token inválido."})
    }
}

// Rota para registro de usuário
app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;

    // Verificar se todos os campos são fornecidos
    if (!name) {
        return res.status(422).json({ msg: 'O nome é obrigatório.' });
    }
    if (!email) {
        return res.status(422).json({ msg: 'O e-mail é obrigatório.' });
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória.' });
    }
    if (password !== confirmpassword) {
        return res.status(422).json({ msg: 'Confirmar a senha.' });
    }

    try {
        // Verificar se o e-mail já está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(422).json({ msg: 'Esse e-mail já está registrado.' });
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar um novo usuário
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ msg: 'Usuário registrado com sucesso!' });
    } catch (err) {
        res.status(500).json({ msg: 'Erro ao registrar o usuário.', error: err.message });
    }
});

//login user

app.post("/auth/login", async(req, res) => {
    const {email, password} = req.body
    if (!email) {
        return res.status(422).json({ msg: 'O e-mail é obrigatório.' });
    }
    if (!password) {
        return res.status(422).json({ msg: 'A senha é obrigatória.' });
    }

    //checar se o usuário já existe
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    //checar se a senha bate também
    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword){
        return res.status(422).json({ msg: 'Senha inválida.' });
    }

    try{
        const secret = process.env.SECRET
        const token = jwt.sign(
        {
            id: user._id,
        },
        secret,
    )

    res.status(200).json({msg: 'Autenticação realizada com sucesso!', token})

    }catch (err){
        console.log(erro)
        res.status(500).json({
            msg: 'Aconteceu um erro no servidor, tente novamente mais tarde.',
        })
    }
})

// Rota para servir o React - deve vir por último
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Conectar ao MongoDB e iniciar o servidor
const uri = process.env.MONGO_URI;

mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
        console.log('Conectado ao banco de dados!');
    })
    .catch((err) => console.log('Erro ao conectar ao banco de dados:', err));