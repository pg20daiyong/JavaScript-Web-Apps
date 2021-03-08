// Copyright (c) 2021 Daiyong Kim
'use strict'

export default class App{
    constructor(){
        // set up fields to hold date

        // set up event handler for form submit
        $("#fav-form").on('submit', event => this.handleSubmitForm( event ));
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
        $.post("http://127.0.0.1:3000/api", requestData, this.handleServerResponse )
        // OK
        $.post("http://127.0.0.1:3000/api", bodyData, this.handleServerResponse )
        // OK
        $.post("http://127.0.0.1:3000/api", params, this.handleServerResponse )
    }

    handleServerResponse( data ) {}

    run(){
 
    }
}
