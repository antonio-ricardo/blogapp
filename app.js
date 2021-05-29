const express = require('express')
const handlebars = require("express-handlebars")
const bodyparser = require("body-parser")
const app = express()
const admin = require("./rotas/admin")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const usuario= require("./rotas/usuario")
const passport = require('passport')
require("./config/auth")(passport)
require("./models/Postagem")
const postagens = mongoose.model("postagens")


//configurações
    //session
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
    //middleware
        app.use(passport.initialize())
        app.use(passport.session())
        app.use((req,res,next) => {
            res.locals.user = req.user || null
            next()
        })
    //bodyparser
        app.use(bodyparser.urlencoded({extended : true}))
        app.use(bodyparser.json())
    //handlebars
        app.engine("handlebars", handlebars({defaultLayout: "main.handlebars"}))
        app.set("view engine", "handlebars")
    //mongoose
    mongoose.connect("mongodb://localhost/blogapp")
    .then(() => console.log("coneção com o banco funfando"))
    .catch(() => console.log("coneção com o banco nao esta funfando"))
    //public
        app.use(express.static(path.join(__dirname,"public")))
//rotas
app.use("/admin", admin)
app.use("/usuario", usuario)
// outros

app.get("/home", (req,res) => {
    postagens.find().populate("categoria").lean().then((postagens) => 
    res.render("./home", {postagens: postagens}))
})

const porta = 3333
app.listen(porta, () => {
    console.log("servidor funfando")
})