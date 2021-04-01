// Copyright (c) 2021 Daiyong Kim
'use strict';

import Express from 'express'
import Path from 'path'
const __dirname = Path.resolve();
import HTTP from 'http'
import FileSystem from 'fs-extra';
import fsExtra from 'fs-extra'
import { readFileSync } from 'fs';
import Reply from './scripts/Reply.js';
const PORT = 3000;
var userIdExists = false;
class Server {
    constructor() {
        this.api = Express();
        this.api.use(Express.json())
            .use(Express.urlencoded({ extended: false }))
            .use(Express.static(Path.join(__dirname, '.')));

        this.api.get('/', ( request, response ) => {        
            response.sendFile('editor.html', { title: 'From Demo' });
        });
        this.api.get('/editor', (request, response) => {
            //Get editor pàge
            response.sendFile(Path.join(__dirname, 'editor.html'));
        });
        this.api.get('/draggable', (request, response) => {
            //Get editor pàge
            response.sendFile(Path.join(__dirname, 'draggable.html'));
        });
        this.api.post('/api', ( request, response ) => {
            // pull info from request
            //console.log(request);
            let assert = true;
            let params = request.params;
            let query = request.query;
            let data = request.body;   
            // do something
  
            let food = data['fav-food'];
            let bev = data['fav-beverage'];
            let takeOut = data['fav-take-out'];

            // respond
        });

        //get level list
        this.api.post('/api/get_level_list', (request, response) => {
            // Request params
            // {
            //     "userid": <valid vfs username>, eg pg15student
            // }
            let data = request.body; //Data attached as a Json structure
            let reply = new Reply(1, "Don't use data");

            // check username and
            // find directory and files

            this._checkUserId(data.userid);
            if(userIdExists != true){
                reply.error(2, "User does not exist");
                response.send(reply.serialize());
                return;
            }
            //Error Response
            // Condition: If 'userid' does not exist.
            // {
            //     "error": 1+ // Greater than zero on error
            // }


            let dirName = './data/levels';

            
            let result = {
                payload:[]
            }             
            FileSystem.readdir(dirName) 
            .then(fileNames => {
                // go through all the files
                fileNames.forEach(fileName => { 
                    let filePath = dirName + "/" + fileName
                    let fileItem = readFileSync(filePath)       // read the file 
                    let inFile = String(fileItem)   
                    //console.log(inFile)
                    let file = JSON.parse(inFile)               //make them back to be object
                    result.payload.push(file)                   // add to the files              
                })

                reply.payload = result.payload;
                response.send(reply.ok().serialize());      //send to client.            
            }) 

            // Success Response
            // {
            //     "payload": [
            //         { name: "level_name": filename: "actual_filename.json"}',
            //         { name: "level_name": filename: "actual_filename.json"}',
            //     ],
            //     "error": 0
            // }

            

        });
        
        this.api.post('/api/get_load', (request, response) => {

            // Request params
            // {
            //     "userid": <valid vfs username>, eg pg15student
            // }
            //let data =JSON.parse(JSON.stringify(request.body)); //Data attached as a Json structure
            let data = request.body;
            let reply = new Reply(1, "Don't use data");
            //console.log("===========================");
            //console.log(data.requestData.userid);
           
            
            // check username and
            // find directory and files

            this._checkUserId(data.requestData[userid]);
            if(userIdExists != true){
                reply.error(2, "User does not exist");
                response.send(reply.serialize());
                return;
            }
            //Error Response
            // Condition: If 'userid' does not exist.
            // {
            //     "error": 1+ // Greater than zero on error
            // }

            //let type = request.body;


            let dirName = './data';

            if (data.requestData[type]=='object')
                dirName += '/objects';
            if (data.requestData[type]=='level')
                dirName += '/levels';
            
                console.log(dirName);
            let result = {
                payload:[]
            }  
            
            //console.log(dirName)
            
            FileSystem.readdir(dirName) 
             .then(fileNames => {
                 fileNames.forEach(fileName => { // go through all the file name
                let filePath = dirName + "/" + fileName
                let fileItem = readFileSync(filePath) // read the file 
                let rawFile = String(fileItem) //turn them into string
                let file = JSON.parse(rawFile) //make them back to be object
                result.payload.push(file) // add to the file list
                // console.log('mytag fileList',payload);                
                })

                reply.payload = result.payload;
                response.send(reply.ok().serialize());      //send it back.       
            })          
        });
        //get object list
        this.api.post('/api/get_object_list', (request, response) => {

            // Error Response
            // Condition : If 'userid' does not exist.
            // {
            //     "error": 1+ // Greater than zero on error
            // }   
            let data = request.body;
            let reply = new Reply(1, "Don't use data");
            
            console.log(data);

            // this._checkUserId(data.userid);
            // if(userIdExists != true){
            //     reply.error(2, "User does not exist");
            //     response.send(reply.serialize());
            //     return;
            // }

            // Success Response
            // {
            //     "payload": [
            //         { name: "object_name": filename: "actual_filename.json"}',
            //         { name: "object_name": filename: "actual_filename.json"}',
            //     ], 
            //     "error": 0 
            // } 
            let dirName = './data/objects';

            // if (data.requestData[type]=='object')
            //     dirName += '/objects';
            // if (data.requestData[type]=='level')
            //     dirName += '/levels';
            
                console.log(dirName);
            let result = {
                payload:[]
            }  
            
            //console.log(dirName)
            
            FileSystem.readdir(dirName) 
             .then(fileNames => {
                 fileNames.forEach(fileName => { // go through all the file name
                let filePath = dirName + "/" + fileName
                let fileItem = readFileSync(filePath) // read the file 
                let rawFile = String(fileItem) //turn them into string
                let file = JSON.parse(rawFile) //make them back to be object
                result.payload.push(file) // add to the file list
                //console.log('mytag fileList',result.payload);                
                })

                reply.payload = result.payload;
                response.send(reply.ok().serialize());      //send it back.       
            })    
        });

        //save 
        this.api.post('/api/save', (request, response) => {
            // Request params
            // {
            //     "userid": "valid vfs username", // eg pg15student
            //     "name": "filename", // name of entity, no spaces, no extension
            //     "type": "object" | "level", // one of these two key strings
            //     "payload": "JSONString" // actual data in JSON format 
            // } 

            let data = request.body;
            //let data = JSON.parse(JSON.stringify(request.body));
            
            let reply = new Reply(1, "Don't use data");
            
            console.log(data)
            // this._checkUserId(data.userid);
            // if(userIdExists != true){
            //     reply.error(2, "User does not exist");
            //     response.send(reply.serialize());
            //     return;
            // }

            let levelName = data.name
           
            if (!levelName) {
                reply.error(2, "Level name does not exist");
                response.send(reply.serialize());
                return;
            }

            let isNewFile = true;
            let folder="./data/levels/";

         
            var fileAddress = `${folder}${levelName}.json`;
            fsExtra.writeJson(fileAddress, data, err => {
                if (err) return console.error(err)
                console.log('success!')
            })

            //add data to the game object list
            let result = {
                error: 0,
            }
            response.send(JSON.stringify(result));

            // this._checkUserId(data.userid);
            // if(userIdExists != true){
            //     reply.error(2, "User does not exist");
            //     response.send(reply.serialize());
            //     return;
            // }


            // Success Response
            // {
            //     "name": "requested entity name",
            //     "bytes": "actual bytes written",
            //     "error": 0
            // }   
            // Error Response
            // Condition: If 'userid' does not exist or file could not be written to the server.
            // {
            //     "error": 1+ // Greater than zero on error
            // }    
        });

        //load
        this.api.post('/api/load', (request, response) => {
        });
        
		this.run();

	}

    _checkUserId(userid) {
        // Open some file
        let directory = "./data/users";

        // Search inside the folder for the file names
        FileSystem.readdirSync(`${directory}`).forEach(element => {
            if (userid + ".json" != element) {
                userIdExists = false;
            }
            return userIdExists = true;
        });
    }

	run(){
  
        this.api.set('port', PORT);

        this.listener = HTTP.createServer(this.api);
        this.listener.listen(PORT);

        this.listener.on('listening', event => {

            let addr = this.listener.address();
            let bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
            //Conditional  (expr ? val if true : val if fale)
            console.log(`Listening on ${bind}`);
        })		
    }
}

const server = new Server();