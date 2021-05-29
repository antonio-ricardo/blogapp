require("../models/Postagem")
const mongoose = require("mongoose")
const postagens = mongoose.model("postagens")


module.exports = {
    eAdmin: function(req, res, next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next()
        }
        postagens.find().lean().populate("categoria").then((postagens) => {
            res.render("./home", {error: "você não é um ademiro!", postagens:postagens})
        })   

    } 
}