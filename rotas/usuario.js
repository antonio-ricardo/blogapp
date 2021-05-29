const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const usuario = mongoose.model("usuarios")
const bcrypt = require("bcryptjs")
const passport = require('passport')
require("../models/Postagem")
const postagens = mongoose.model("postagens")

router.get("/cadastro", (req, res) =>{
    res.render('usuarios/cadastro')
})

router.post("/cadastro", (req, res) => {
    var erros = []

    if(!req.body.nome){
        erros.push({texto: "Nome invalido"})
    }
    if(!req.body.email){
        erros.push({texto: "email invalido"})
    }
    if(!req.body.senha){
        erros.push({texto: "senha invalida"})
    }
    if(req.body.senha != req.body.senha2){
        erros.push({texto: "as senhas são diferentes"})
    }
    
    if(erros.length > 0){
        res.render("usuarios/cadastro", {erros: erros})
    }

    else{
        usuario.findOne({email: req.body.email}).then((usuarios) => {
            if(usuarios){
                erros.push({texto: "Email ja cadastrado"})
                res.render("usuarios/cadastro", {erros: erros})
            }
            else{
                bcrypt.genSalt(10,(_,salt) => {
                    bcrypt.hash(req.body.senha, salt, (_, hash) =>{
                    const newusuario = {
                        nome: req.body.nome,
                        email: req.body.email,
                        senha:hash
                    }   
                    new usuario(newusuario).save().then(() => res.render("./home"))})
                })
                    
            }
        })
            }
        })

router.get("/login", (req, res) => {
    res.render("usuarios/login")
})
router.post("/login", 
        passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/usuario/login/failed",
    })
)

router.get("/login/failed", (req, res) => {
    res.render("usuarios/login", {error : "Credenciais erradas, tente novamente!"})
})

router.get("/logout", (req, res) => {
    req.logout()
    postagens.find().populate("categoria").lean().then((postagens) => 
    res.render("./home", {postagens: postagens, chama: "Deslogado com sucesso"}))})



module.exports = router