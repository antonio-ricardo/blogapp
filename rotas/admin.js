const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const categoria = mongoose.model("categorias")
require("../models/Postagem")
const postagens = mongoose.model("postagens")
const {eAdmin} = require("../helpers/eAdmin")


router.get("/", eAdmin, (req,res) => {
    categoria.find().lean().then((categoria) => {res.render("admin/index", {categorias : categoria})}).catch(() => console.log("houve um erro"))
    
})

router.get("/categorias", eAdmin, (req,res) => res.render("admin/categorias"))

router.post("/categorias/nova", eAdmin, async (req,res) => {
    var error = []
     

    if(!req.body.nome || typeof req.body.nome == undefined || typeof req.body.nome == null){
        error.push({texto: "Nome invalido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || typeof req.body.slug == null){
        error.push({texto: "Slug invalido"})
    }
    if(req.body.nome.length < 2){
        error.push({texto: " O nome da categoria é muito pequeno"})
    }
    if(error.length > 0){ 
        res.render("admin/categorias", {erros: error})
    }
    
    else{ 
        try{
            const createdCategory = {
                nome: req.body.nome,
                slug: req.body.slug
            };
            new categoria(createdCategory).save()
            return res.redirect("/admin/")
        } catch (error) {
            console.log("Deu erro: ", error)
            return;
        }
    }
})

router.get("/edicaodecategoria/:id", eAdmin, (req,res) => {
    categoria.findOne({_id: req.params.id}).lean().then((categoria) => {
        res.render("admin/edicao", {categoria: categoria})
})
}
)

router.post("/edicao", eAdmin, (req,res) => {
    categoria.findOne({_id: req.body.id}).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug
        categoria.save().then(() => res.redirect("/admin/"))
    }).catch((error) => console.log("DEU MERDA PAE " + error))
})

router.post("/deletarcategoria", eAdmin, (req,res) =>{
    categoria.remove({_id: req.body.id}).then(() => res.redirect("/admin/"))
})

router.get("/postagens", eAdmin, (req,res) => {
    categoria.find().lean().then((categoria) => {
        res.render("admin/postagens", {categoria: categoria})
    })
})

router.post("/postagens/nova", eAdmin, (req,res) =>{
    var erros = []

    if(!req.body.titulo){
        erros.push({texto: "nome invalido"})
    }
    if(!req.body.slug){
        erros.push({texto: "slug invalido"})
    }
    if(!req.body.descricao){
        erros.push({texto: "descricao invalida"})
    }
    if(!req.body.conteudo){
        erros.push({texto: "conteudo invalido"})
    }
    if(req.body.categoria == "0"){
        erros.push({texto: "nenhuma categora selecionada"})
    }

    if(erros.length > 0){
        res.render("admin/postagens", {erros: erros})
    }
    else{
        const createdpost = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }

        new postagens(createdpost).save().then(res.redirect("/admin/postlist"))
    }
})

router.get("/postlist", eAdmin, (req,res) => {
    postagens.find().populate("categoria").lean().then((postagens) => 
    res.render("admin/postlist", {postagens: postagens}))
})

router.get("/postagens/edit/:id", eAdmin, (req,res) => {
    postagens.findOne({_id: req.params.id}).lean()
    .then((postagens) => {categoria.find().lean().then((categoria) => res.render("admin/edicaopost", {postagens: postagens, categoria:categoria}))})})
   
router.post("/postagens/editada", eAdmin, (req,res) => {
    postagens.findOne({_id: req.body.id}).then((postagens) => {
        postagens.titulo = req.body.titulo,
        postagens.slug = req.body.slug,
        postagens.descricao = req.body.descricao,
        postagens.conteudo = req.body.conteudo,
        postagens.categoria = req.body.categoria,
        postagens.save().then(res.redirect("/admin/postlist"))
    })

})

router.post("/postagens/deletar", eAdmin, (req,res) => {
    postagens.deleteOne({_id: req.body.id}).then(res.redirect("/admin/postlist"))
})

router.get("/lerpostagem/:id", eAdmin, (req,res) => {
    postagens.findOne({_id: req.params.id}).lean().then((postagens) =>{
        res.render("admin/lerpostagem", {postagens: postagens})
    })
})

router.get("/categolist", eAdmin, (req,res) =>{
    categoria.find().lean().then((categoria) => {               
        res.render("admin/categolist", {categoria:categoria})
    })
})

router.get("/postfind/:id", eAdmin, (req,res) => {
    postagens.find({categoria: req.params.id}).lean().then((postagens) =>
        res.render("admin/postfind", {postagens: postagens})
    )
})
module.exports = router 