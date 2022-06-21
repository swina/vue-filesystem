const express = require('express')
const app = express()
const port = 9000
const fs = require('fs-extra')
const path = require('path')
const bodyParser = require("body-parser");
const dree = require('dree')
const multer = require('multer')
var cors = require('cors')
require('dotenv').config()

//Dree Options
const options = {
    followLinks: true,
    depth: 5,
    exclude: [/node_modules/,/.git/],
    sorted:false
};
var destination

const ROOT_PATH = process.env.VITE_APP_ROOT_PATH || '/app/demo/'

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({limit: '50mb'}));
app.use(cors())



var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log ( req.body )
        cb(null, tmp )
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })



// get filesystem structure 
// @name : paths
app.get ( '/tree/:name' , async ( req , res ) => {
    let dirToScan = ROOT_PATH + req.params.name || ROOT_PATH 
    console.log ( path.resolve ( dirToScan ) )
    try {
        const tree = await dree.scan ( path.resolve ( dirToScan ) , options )
        console.log  ( tree )
        res.json ( tree )
    } catch (err) {
        res.json ( { error: err } )
    }
})

// get root filesystem structure 
// @name : paths
app.get ( '/root' , async ( req , res ) => {
    let dirToScan = ROOT_PATH
    console.log ( path.resolve ( dirToScan ) )
    try {
        const tree = await dree.scan ( path.resolve ( dirToScan ) ,  options )
        console.log  ( tree )
        res.json ( tree )
    } catch (err) {
        res.json ( { error: err } )
    }
})

// load file
// @req.query.path : full file path
app.get('/file' , async ( req , res ) => {
    console.log ( fs.existsSync ( req.query.path ) )
    if ( req.query.path && path.resolve ( req.query.path ) && fs.existsSync ( req.query.path ) ){
        const rawdata = await fs.readFileSync ( path.resolve ( req.query.path ) , 'utf-8' )
        try {
            res.json ( rawdata )
        } catch ( err ){
            res.json ( { error: 'not found' , err: err } )
        }
    } else {
        res.json ( { error: 'not found' } )
    }
})

app.get('/fileExists' , async ( req,res) => { 
    const exists = await fs.exists ( path.resolve ( req.query.path ) ) 
    if ( exists ){
        res.json ( { success: true } )
    } else { 
        res.json ( { success: false })
    }
})

app.get('/' , ( req, res ) => {
    console.log ( req.ip )
    const rawdata = require( path.resolve ( current ) + '/config.json' )
    res.json ( rawdata )
})

//move file
//@req.query.source : file source full path
//@req.query.target : folder target full path
//@req.query.filename : filename
app.get ('/move' , ( req, res ) => {
    //if ( fs.statSync( req.query.target ).isDirectory() ){
    if ( fs.statSync( req.query.target ).isDirectory() && path.resolve ( req.query.source ) ){    
        try {
            fs.move ( path.resolve ( req.query.source ) , path.resolve ( req.query.target ) + '/' + req.query.filename )
            res.json ( { message: 'File moved' } )
        } catch (err){
            console.log ( 'move error ' , err )
            res.json ( { message: err } )
        }
    } else {
        res.json ( { message: 'Drag to a folder' } )
    }
})

//delete file
//@req.query.path : full path to delete
app.get ( '/delete' , ( req , res ) => {
    if ( path.resolve ( req.query.path ) ){
        fs.removeSync ( path.resolve ( req.query.path ) )
        res.json ( { message: 'Item deleted' } )
    }
})

//rename file
//@req.query.path : full path to rename to
//@req.query.name : name of the new file
//@req.query.source : full path of the file to rename to
app.get ( '/rename' , async ( req , res ) => {
    let source = path.resolve ( req.query.path + req.query.source )
    let target = path.resolve ( req.query.path ) + '/' + req.query.name
    if ( source ){
        await fs.copySync ( source , target )
        await fs.removeSync ( source )
        res.json ( { message: 'Item renamed' } )
    }
})



// save file
// @body.path = file full path (required)
app.post('/file/save' , (req, res) => {
    let stream = fs.writeFileSync( path.resolve ( req.body.path ) , req.body.data.data )
    console.log ( 'save file => ' , req.body.path   )
    //res.send ( req.body )
    res.json ( { message: 'File saved' } )
})


// add folder to path root
// @body.path = file full path (required)
app.get('/folder/add' , (req, res) => {
    console.log ( req.query.context , req.query.name )
    let dir = req.query.context + '/' + req.query.name 
    //let dir = req.query.name
    console.log ( dir )
    if ( !fs.existsSync( path.resolve(dir) )){
        fs.ensureDir ( dir )
        //fs.mkdirSync(dir);
        res.json({success:true})
    } else {
        res.json({success:false})
    }
})



//set the active project
// @body.data = json data (required)
app.post('/current' , (req, res) => {
    let stream = fs.createWriteStream( path.resolve ( current ) + '/config.json' )
    stream.once('open', function(fd) {
        stream.write(JSON.stringify(req.body.data));
        stream.end();
    });
    res.send ( req.body )
})

app.post('/upload-single', upload.single('file'), function (req, res, next) {
    // req.file is the `profile-file` file
    // req.body will hold the text fields, if there were any
    var filename = req.file.filename;
    fs.move ( tmp + '/' + filename , req.body.path + '/' + filename )
    return res.send('ok')
})

app.listen(port,'0.0.0.0',(err)=>{
    if ( err ){
        console.log ( err )
    } else {
        console.log("server is listening on port " , port );
    }
})