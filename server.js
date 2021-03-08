// Copyright (c) 2021 Daiyong Kim
'use strict'

import Express from 'express';
import Path from 'path';
const __dirname = Path.resolve();

  
class Server{
	constructor() {

		this.api = Express();
		this.api.use( Express.json())
            .use( Express.urlencoded({ extended: false }))
            .use( Express.static( Path.join(__dirname, '.')));

        this.api.get('/', ( request, response ) => {        
            response.sendFile('index.html', { title: 'From Demo' });
        });
        this.api.post('/api', ( request, response ) => {
            // pull info from request
            let assert = true;
            let params = request.param;
            let query = request.query;
            let data = request.data;            

            // do something
            let food = data['fav-food'];
            let bev = data['fav-beverage'];
            let takeOut = data['fav-food'];
            // respond
        });
        
		this.run();

		
	}
	run(){
		var server = this.api.listen(3000, function () {
		var host = server.address().address;
		var port = server.address().port;
		  
		console.log('Server is working : PORT - ',port);
		});

	}
}

const server = new Server();




// 'use strict'

// import Express from 'express'
// import Path from 'path'
// const __dirname = Path.resolve();
// import Http from 'http'

// const PORT = 3000;

// class Server {
//     constructor(){
//         this.api = Express();
//         this.api.use( Express.json())
//                 .use( Express.urlencoded({ extended: false }))
//                 .use( Express.static( Path.join(__dirname, '.')));

//         // Get home page (index.html)
//         this.api.get('/', ( request, response ) => {
//             //response.sendFile('index.html', { title: 'From Demo' });
//             response.sendFile('index.html', { title: 'From Demo' });
//         });
//         this.api.post('/api', ( request, response ) => {
//             // pull info from request
//             let assert = true;
//             let params = request.param;
//             let query = request.query;
//             let data = request.data;            

//             // do something
//             let food = data['fav-food'];
//             let bev = data['fav-beverage'];
//             let takeOut = data['fav-food'];


//             // respond
//         });

//         this.run();
//     }

//     run() {
//         this.api.get('port', PORT);
//         this.listener = HTTP.createServer( this.api );
//         this.listener.listen( PORT );

//         this.listener.on('listening', event => {
//             let addr = this.listener.address();
//             let bind = ((typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`);
//             console.log(`Listening on ${bind}`);
//         })
//     }
// }

// const server = new Server();