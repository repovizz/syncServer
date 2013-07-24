LabStream Framework
====================

This project uses Bower for managing client-side dependencies, NPM for managing server-side and test dependencies and Grunt for putting everything together. The tests are run with QUnit.

The code is organized as follows:

* `client` contains all the client-side code, including javascript, CSS and HTML.
	* `client/vendor` contains all client-side dependencies. It is automatically generated when running the install task.
	* `client/js` contains all javascript AMD modules that are used in the client.
	* `client/css` contains all custom CSS files.
	* `client/html` contains all html templates that underscore will use.
	* `client/static` contains other client-side dependencies.
* `public` contains all _built_ client-side code. It is automatically generated when running the build task.
* `node_modules` contains all npm modules. It is automatically generated when running the install task.
* `shared` contains files used by both client and server, mainly configuration.
* `test` contains unit tests for both client and server. Test are managed with various Grunt tasks, as detailed below.