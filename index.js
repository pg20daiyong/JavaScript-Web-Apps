// Copyright (c) 2021 Daiyong Kim
'use strict'

import App from './scripts/App.js';

// main
(function Main() {
    $(document).ready(event => {
        const app = new App();
        app.run();
    });
})();