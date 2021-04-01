// Copyright (c) 2021 Daiyong Kim
'use strict'

export default class App{
    constructor(){
        // set up fields to hold data

        // set up event handler for form submit
        $("#fav-form").on('submit', event => this.handleSubmitForm( event ));
        dragElement(document.getElementById("mydiv"));
        function dragElement(elmnt) {
            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            if (document.getElementById(elmnt.id + "header")) {
              /* if present, the header is where you move the DIV from:*/
              document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
            } else {
              /* otherwise, move the DIV from anywhere inside the DIV:*/
              elmnt.onmousedown = dragMouseDown;
            }
          
            function dragMouseDown(e) {
              e = e || window.event;
              e.preventDefault();
              // get the mouse cursor position at startup:
              pos3 = e.clientX;
              pos4 = e.clientY;
              document.onmouseup = closeDragElement;
              // call a function whenever the cursor moves:
              document.onmousemove = elementDrag;
            }
          
            function elementDrag(e) {
              e = e || window.event;
              e.preventDefault();
              // calculate the new cursor position:
              pos1 = pos3 - e.clientX;
              pos2 = pos4 - e.clientY;
              pos3 = e.clientX;
              pos4 = e.clientY;
              // set the element's new position:
              elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
              elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
              console.log(elmnt.style.top);
              console.log(elmnt.style.left);
            }
          
            function closeDragElement() {
              /* stop moving when mouse button is released:*/
              document.onmouseup = null;
              document.onmousemove = null;
            }
          }
    }

    

    handleSubmitForm(event){
        event.preventDefault();

        // Do form type things ...
        let params = $(event.target).serialize();
        
        // get form data as JS object
        let request = $(event.target).serializeArray();
        console.log(request);
        let bodyData = {};
        request.forEach( element =>{
            bodyData[element.name] = element.value;
        })
        let requestData = JSON.stringify( bodyData );
        // send data to the server....
        $.post("/api", requestData, this.handleServerResponse )
        // OK
        $.post("/api", bodyData, this.handleServerResponse )
        // OK
        $.post("/api", params, this.handleServerResponse )
    }

    handleServerResponse( data ) {}

    run(){
 
    }
}
