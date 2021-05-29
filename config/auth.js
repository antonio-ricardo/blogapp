const localstrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
require("../models/Usuario")
const usuario = mongoose.model("usuarios")

module.exports = function(passport){
    passport.use(new localstrategy({ usernameField: "email", passwordField: "senha" }, (email, senha, done) => {
        usuario.findOne({email: email}).lean().then((usuario) => {
            if(!usuario) {
                return done(null, false, {message: "Essa conta não existe!"})
            }

            bcrypt.compare(senha, usuario.senha, (err, batem) => {
             
                if(batem){
                    
                    return done(null, usuario)
                }
                else{
                    return done(null,false,{message: "Senha incorreta"})
                }
            })
        }
        )} ))
        
    passport.serializeUser(function (usuario, done) {
        done(null, usuario._id)
    })

    passport.deserializeUser(function (id, done) {
        usuario.findById(id,(err, usuario) => {
            done(err,usuario)
        })
    })
}