'use strict';

import Request from './Requests.js';

export default class Editor {
    constructor() {
        //set up fields to hold data
        //the level itself is in the dom
        this.gameObjectList = [];
      
        //this._createLevel();
        this._handleDraggables();
        //Fetch the list of GameObjects
        this._populateGameObjectList()
            .then(gameObjects => {
                //build sidebar with game objects
            })
            .catch(error => { 
                this._showErrorDialogue(error)
            });

            
        //Fetch the list of levels
        this._populateLevelList();
        /*ideally 
            this.gameObjectList = new GameObjectList();
            this.gameObjectList.populate();    
        */
        //Initialize the draggable stuff...

        // Handle user save events
        $("#level-list").on('submit', event => {
            event.preventDefault();
            this._loadLevel(event);
        } );

        $("#level-info").on('change', event => {
            this._loadLevel(event)
        });

        $("#info-form").on('submit', event => {
            this._handleSubmitForm(event)
        });

        $("#object-creator").on('submit', event => {
            this._handleObjectSubmitForm(event)
        });
        
    }

    run() { }


    _showErrorDialogue(error) {
        //TODO, build a dialog system for showing error messages
        // Not found user error
        if (error == 2) { alert("User does not exits"); }

        // Load error
        alert("Data does not loaded");
    }

    _updateLevelList(levelList) {
        //do some fancy jQuery to fill in the level list.
        const $optionList = $('#level-list');
        //
        levelList.foreach(item => {
            let $option = $(`<option value="${item}">${item}</option>`);
            $optionList.addChild($option)
        })
    }

    //Save Level
    _handleSubmitForm(event) {

        event.preventDefault();

        // get form data as JS object
        let request = this._createLevel(event);

       // console.log("request" + request);

        // send data to the server....
        $.post("/api/save", request)
        .then(response => {
            let data = response.payload;
            if(!response.error){}
        });
    }

    _createLevel(event){

        let request = $(event.target).serializeArray();
        let bodyData={};

        request.forEach(element => {
            bodyData[element.name] = element.value;
        })

        let levelName = bodyData.levelName;
        let objects = this._getEditorObject(levelName);

        
        let object = {
            name: levelName,
            obstacles: bodyData.obstacles,
            cannons: bodyData.cannons,
            shots: bodyData.shots,
            type: "level",
            objects
        }
        return object;
    }

    _getEditorObject(levelName){
        
        class Level{
            constructor(){
                this.object=[];
            }
            set Payload(value){
                let my = this.__private__;
                my.payload=value;
            }
        }
        let level = new Level(levelName);


        $('#editor-area').find('div').each((index,el)=>{
            
            let url = $(el).css("background-image");
            let image = url.replace("http://127.0.0.1:3000", "");
            console.log("url " + image);
            let objectInfo=
            {
                id:index,
                left:$(el).css("left"),
                top:$(el).css("top"),
                height:$(el).css("height"),
                width:$(el).css("width"),
                objectShape:$(el).css("border-radius"),
                backgroundImage:image,
                objName:$(el).attr("id"),
                //background-size: cover
            }
            level.object.push(objectInfo);
       });

        let levelStr = JSON.stringify(level);
        console.log(levelStr)
        return levelStr;               
    }

    _populateLevelList() {

        let requestData = new Request();
        // Get user id 
        requestData.userid = $("#userid").val();
        console.log(requestData.userid);
        //post a message to the server.
        $.post('/api/get_level_list', { requestData })
            .then(theLevelList => {
                let levels =JSON.parse(theLevelList);
                console.log(levels);

                const levelList = levels.payload;         
                levelList.forEach(level=>{
                    let markup =`<option value="${level.name}">"${level.name}" </option>`;
                $("#level-list").append(markup);
            });               
        })
    }

    _loadLevel(event) {
        event.preventDefault();

        let levelName = $(event.target).serializeArray();
        let levelNameObject = [];
        levelName.forEach(element => {
            levelNameObject.name = element.value;            
        })

        let requestData = new Request();
        requestData.userid = $("#userid").val();
        requestData.type = "level"

        $.post('/api/get_level_list',{ requestData })
        .then(theLevelList => {

            let levels =JSON.parse(theLevelList);
            console.log(levels)
            const payload = levels.payload;    
            let arrayPosition = this._findArrayPosition(payload,levelNameObject.name);           

            if (arrayPosition==null){
                $("#editor-area").html("");
                return;
            }
            let fileInfo = payload[arrayPosition];
            let objectList = fileInfo.objects;
            let  objectListObjectArry = JSON.parse(objectList).object;

            console.log(objectListObjectArry);             

            let $markup = "";
            objectListObjectArry.forEach(object=>{
                $markup +=`<div draggable="true"  
                style="height: ${object.height}; 
                width: ${object.width}; 
                background-image: ${object.backgroundImage}; 
                /* Center and scale the image nicely */
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
                border-radius:${object.objectShape};
                position: absolute; 
                left: ${object.left}; 
                top: ${object.top};"></div>`;
                }); 
                $("#editor-area").html($markup);
        })

    
        //  ${object.image}
    }

    _findArrayPosition(payload,name)
    {
        let arrayPosition=0;
        while (arrayPosition<payload.length)
        {
            if (payload[arrayPosition].name==name)
            return arrayPosition;
            arrayPosition++;
        }
        
    }
    
    _populateGameObjectList() {
        return new Promise((resolve, reject) => { //params are functions too
            let requestData = new Request();

            // Get user id 
            requestData.userid = $("#userid").val();
            requestData.type = "object"
            //console.log(requestData);
            //post a message to the server.
            //do some work async
            $.post('/api/get_object_list', requestData).
                then(res => {
                let levels =JSON.parse(res);
                //console.log(levels)
                const objectList = levels.payload;    //let returned data become object list again.
                let domObject = "";                   //add the name of each object into a new list

                //console.log(objectList);
                objectList.forEach(fileItem => {
                    if (fileItem.shape==="square")
                    {         // <div name="${fileItem.name}" value="${fileItem.name}">   
                    domObject += `                                        
                        <div id= "${fileItem.name}" class = "draggable" draggable="true" 
                        style="position:relative; 
                        left:30px; 
                        height: ${fileItem.height}px; 
                        width: ${fileItem.width}px;
                        background-image: url(${fileItem.texture}); 
                        /* Center and scale the image nicely */
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: cover;
                        "></div> <br><br>
                        `       
                    }
                    else if (fileItem.shape==="round")
                    {
                        domObject += `                                        
                        <div id="box-one" class="draggable" draggable="true" 
                        style="position:relative; 
                        left:30px;
                        height: ${fileItem.height}px; 
                        width: ${fileItem.width}px;
                        background-image: url(${fileItem.texture}); 
                        /* Center and scale the image nicely */
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: cover;
                        border-radius: 50%;
                        "></div><br><br>`;    
                    }
                    else if (fileItem.shape==="triangle")
                    {
                        domObject += `                                        
                        <div id= "box-one" draggable="true" 
                        style="position:relative; 
                        left:30px;
                        background-image: url(../image/canon.png);
                        /* Center and scale the image nicely */
                        background-position: center;
                        background-repeat: no-repeat;
                        background-size: cover;
                        border-left: ${fileItem.height}px solid transparent;
                        border-right: ${fileItem.height}px solid transparent;
                        border-bottom: ${fileItem.width}px solid #999;
                        </div><br><br>`;
                        
                     
                    }
                                                       
                });
                console.log(domObject)
                $("#object-list").html(domObject);
            }).catch(error => {
                this._showErrorDialogue(error)
            })
        })
    }

    _handleDraggables(){
        $('#object-list')
            .on('mouseover',event=>{
                console.log("MouseOver");
            })
            .on('dragstart',event=>{
                
                //console.log("DragStart");

                this.$dragTarget = $(event.target);
                let height = this.$dragTarget.css("height");
                let width = this.$dragTarget.css("width");
                let bg = this.$dragTarget.css("background-image");

                //get data to transfer
                let transferData={
                    targetId:event.target.id,
                    gameParams:{
                         "height": height,
                         "width": width,
                         "background-image": bg,       
                    }
                };
                 //attach transfer data to the event
                event.originalEvent.dataTransfer.setData("text", JSON.stringify(transferData));
                event.originalEvent.dataTransfer.effectAllowed = "move";
                //grab offset
                
                //let offset={};
                this.$dragTarget.x=event.clientX - Math.floor(event.target.offsetLeft);
                this.$dragTarget.y=event.clientY - Math.floor(event.target.offsetTop);

                //old z index
                let z = this.$dragTarget.css("zIndex");
                //let z = event.target.style.zIndex;

                //what todo with zIndex?
                //console.log(z);
            })
            .on('mouseout',event=>{
                //change cursor back
            })

        $('#editor-area')
            .on('dragover',event=>{
                event.preventDefault();
            })

            .on('drop',event=>{
                event.preventDefault();

                //update the css for the dragTarget
                let left=`${event.clientX -  this.$dragTarget.x}px`;
                let top = `${event.clientY -  this.$dragTarget.y}px`;
                //this.$dragTarget.css(this._cssFrom(left,top));
                 
                //get embedded transferData
                let rawData = event.originalEvent.dataTransfer.getData("text");
                let transferData= JSON.parse(rawData);
                let $obj = $(`<div id = "${transferData}" 
                class = "draggable" draggable= "true"
                style=" height: ${transferData.gameParams.height}px;
                 width: ${transferData.gameParams.width}px;
                 </div>  `)

                let $el = $(` <div></div>`);

                let clone=this.$dragTarget.clone();
                clone.css( this._cssFrom(left,top ));
                $(`#editor-area`).append( clone );
  
        })
    }

    _cssFrom(left,top){
        return{
            position:"absolute",
            margin:"0px",
            left,
            top,
        }
    }
    //send Object Editor result to server
    _handleObjectSubmitForm(event) {

        event.preventDefault();
        // get form data as JS object
        let request = $(event.target).serializeArray();
        console.log(request);
        console.log(request[0].value);

        

        let bodyData = {
            type:'object',
            texture : "./images/" + request[0].value + ".png"
        };

        request.forEach(element => {
            bodyData[element.name] = element.value;
        })

       // bodyData += {name : "texture", value : "./data/objects/" + bodyData[name] + ".png"}
       
        $.post("/api/save_object", bodyData, this.handleServerResponse)
    };

    
}