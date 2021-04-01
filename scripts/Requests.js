// Copyright (C) 2021 Gabriel Zamora
'use strict';

export default class Requests {
    constructor(error = 0, errorMsg = "No Error") {
        this.name = ""
        this.userid = "", // eg pg20daiyong
        this.type =""
        this.payload = {}
    }

    /* //Response expected
    "name": "requested entity name",
    "payload": "JSONString" // actual data in JSON format 
    "bytes": "actual bytes read",
    "error": 0*/

    ok() {

        // Set to values representing true
        this.error = 0; // Error is false
        this.errorMsg = "No Error"

        return this;

    }

    error(code = 0, msg = "No Error") {

        this.error = code;
        this.errorMsg = msg;

        return this
    }
}