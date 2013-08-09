LabStream Framework
====================

This project uses Bower for managing client-side dependencies, NPM for managing server-side and test dependencies and Grunt for putting everything together. The tests are run with QUnit.

To run the app. make sure that you have installed node.js and redis. Then, run `npm install`, and `node app` to start serving it. Check the configuration files for fine-tuning.

The code is organized as follows:

* `client` contains client-side code not ready for production (i.e. not contatenated or minified).
	* `client/js` contains all custom javascript code
	* `client/css` contains all stylesheets
	* `client/vendor` contains all external libraries, that include both javascript and CSS code. It is automatically generated when running the install task.
* `config` contains configuration files, some of them shared between client and server.
* `lib` contains the server-side javascript backend, which talks to the database, processes queries, etc.
* `node_modules` contains all npm modules. It is automatically generated when running the install task.
* `public` contains production-ready client-side assets, such as icons.
* `dist` contains compiled client-side assets. It is automatically generated when running the built task by compiling the files under `client`, but we add it to version control for convenience. It is only guaranteed to be updated on tagged commits (releases).
* `test` contains unit tests for both client and server code.
* `views` contains the handlebars templates that the server uses to render html.