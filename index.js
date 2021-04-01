// Copyright (c) 2021 Daiyong Kim
'use strict'

import App from './scripts/App.js';
import Editor from './scripts/Editor.js';

// main
(function Main() {
    $(document).ready(event => {
        const app = new App();
        const editor = new Editor();
        app.run();
    });
})();