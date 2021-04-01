// Copyright (c) 2021 Daiyong Kim
'use strict'

export default class Reply{
    constructor(error = 0, errMsg = "No Error") {
        this.__private__ = {
            name: "",
            bytes: 0,
            payload: [],
            object: [],
            error,
            errMsg
        }
    }

    /* //Response expected
    "name": "requested entity name",
    "payload": "JSONString" // actual data in JSON format 
    "bytes": "actual bytes read",
    "error": 0*/

    set payload(value) {
        // Data
        let my = this.__private__;
        my.payload = value;
    }

    ok() {

        // Set to values representing true
        let my = this.__private__;
        my.error = 0; // Error is false
        my.errMsg = "No Error"

        return this;

    }

    error(code = 0, msg = "No Error") {

        let my = this.__private__;
        my.error = code;
        my.errMsg = msg;

        return this
    }

    serialize() {

        return JSON.stringify(this.__private__);
    }
}