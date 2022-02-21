const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Lista = require("./database/Lista");
const spawn = require("child_process").spawn;

const multer = require("multer");
let fs = require("fs");
const { body, validationResult } = require("express-validator");
const path = require('path')


var idcontato = 1;
var envioumavez = 0;
const storage = multer.diskStorage({

    destination: function(req,file,cb){
        //VERIFICA SE EXISTE A PASTA BOT, SE NÃO, CRIA.
        if(!fs.existsSync('../bot')) fs.mkdirSync('../bot')
        cb(null,"../bot/");
    },
    
    filename: function(req, file, cb){
        cb(null, idcontato + ".txt");
    }
    
});

const upload = multer({storage});

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })

// Estou dizendo para o Express usar o EJS como View engine
app.set('view engine','ejs');
app.use(express.static('public'));

// Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Rotas
app.get("/",(req,res)=>{

    Lista.findAll({ raw: true, order:[
        ['id','DESC'] // ASC = Crescente || DESC = Decrescente
    ]}).then(listas => {
        res.render("index",{
            listas: listas
        });
    });

});

app.post("/enviopython",(req,res)=>{
    //PEGO OS "LISTA.CONTATOS DIRETAMENTE DO FORM"   
    var enviopython = (typeof(req.body.lista) === 'string') ? [req.body.lista] : req.body.lista;
    console.log("aqui é a lista! "+ enviopython);
    //RETIROU O IF COM ENVIOU UMA VEZ PORQUE SE EU RETORNAR E SELECIONAR MAIS UM CHECKBOX, ELE NÃO SALVA OS CONTATOS NOVAMENTE
    enviar(enviopython)
    res.send({result: enviopython})
    // res.render("qrcode")         COMENTEI AQUI PARA NÃO PODER VER O RESULTADO
});
function enviar(enviopython){
    // VERIFICO ANTES SE O ARQUIVO EXISTE, ASSIM EVITA MENSAGEM DE ERRO
    if (fs.existsSync("../bot/pessoas.txt")){
        fs.unlink("../bot/pessoas.txt", (err4) => {
            if (err4) console.log(err4);
            else console.log("\nDeleted file: pessoas.txt");
        });
    }
    fs.writeFile('../bot/pessoas.txt',"", function (err) {
        if (err) return console.log(err);
        console.log('Hello World > helloworld.txt');
    });

   

    for (var i in enviopython){

        fs.readFile("../bot/"+enviopython[i], 'utf8' , (err, data) => {
            if (err) return console.error(err);
            console.log("este é o texto "+data)

            fs.appendFile('../bot/pessoas.txt', data + "\n", function (err5) {
                if (err5) return console.log(err5);
                console.log('Hello World > pessoas.txt');
            });
            
        });
        
    }
    
    const childpython= spawn('python',['../bot/botv2.py']);

    childpython.stdout.on('data',(data)=>{
        console.log(data);
    });
    childpython.stderr.on('data',(data)=>{
        console.error("stder "+data);
    });

    childpython.on('close',(code)=>{
        console.log("alguma coisa existe"+code);
    });
    envioumavez = 1;
    }

app.get("/minhaslistas",(req, res) => {
    Lista.findAll({ raw: true, order:[
        ['id','DESC'] // ASC = Crescente || DESC = Decrescente
    ]}).then(listas => {
        res.render("minhaslistas",{
            listas: listas
        });
    });
});

app.get("/novalista",(req, res) => {
    res.render("novalista");
});

app.get("/download/:id", (req,res)=>{
    var baixar = req.params.id
    res.download("../bot/"+baixar+".txt")
});

app.post("/salvarlista",upload.single("file"),(req, res) => {
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var contatos = idcontato + '.txt';


    Lista.create({
        titulo: titulo,
        descricao: descricao,
        contatos:contatos
    }).then(() => {
        res.redirect("/minhaslistas");
        // res.clearCookie(); ESTA DANDO PROBLEMA AO LIMPAR O HEADER
    });
    idcontato++;
});


app.get("/novalista/:id",(req ,res) => {
    var id = req.params.id;
    var rota = "/update"
    if(isNaN(id)){
        res.redirect("/minhaslistas");
    }

    Lista.findOne({
        where:{id:id}
    }).then(lista =>{
        if(lista != undefined){
            res.render("edit",{lista:lista,rota:rota})
        }
        else{
            res.redirect("/minhaslistas");
        }
    });
});

app.post("/update",upload.single("file"), (req,res)=>{

    var id = req.body.id;
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    var contatos= idcontato +".txt";

    fs.readFile("../bot/"+contatos, 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          Lista.update({titulo:titulo,descricao:descricao},{
            where:{id:id}
        }).then(()=>{
            res.redirect("/minhaslistas")
        });
        }
        else{
            Lista.findOne({
                where: {id:id}
            }).then(lista=>{
                fs.unlink("../bot/"+lista.contatos,err2=>{
                    if (err2) console.log(err2);
                    else {
                        console.log("\nDeleted file: example_file.txt");
                }});
                
            });
            
            Lista.update({titulo:titulo,descricao:descricao,contatos:contatos},{
                where:{id:id}
            }).then(()=>{
                res.redirect("/minhaslistas")
            });
            idcontato++;
            console.log(idcontato)
        }
    });

    

    
});

app.post("/deletar",upload.single("file"), (req,res)=>{

    var id = req.body.id;

    Lista.findOne({
        where: {id:id}
    }).then(lista2=>{
        fs.unlink("../"+lista2.contatos,err3=>{
            if (err3) console.log(err3);
            else {
                console.log("\nDeleted file: example_file.txt");
        }});
        
    });

    Lista.destroy({
        where:{id:id}
    })
    res.redirect("/minhaslistas")
    
});



app.listen(process.env.PORT,()=>{console.log("App rodando!");})