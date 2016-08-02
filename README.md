Utilities for Development
===

[![Build Status](https://travis-ci.org/zinoy/dev-utility.svg?branch=master)](https://travis-ci.org/zinoy/dev-utility)

Experimental utilities for development.

About
---

This [AngularJS](http://angularjs.org/) project was created by [Yeoman](http://yeoman.io/) and use [Gulp](http://gulpjs.com/) as build tool. You can easily develop, test, build and publish it by execute very simple command.

Theme designed by [INSPINIA](https://wrapbootstrap.com/theme/inspinia-responsive-admin-theme-WB0R5L90S).

Getting Started
---

To run this project you will need a node instaled in your environment. If you don't have a node.js please go to this site http://nodejs.org and download and install proper version.

Next you will need to install gulp

```sh
$ npm install --g gulp
```

Next you will need to install bower

```sh
$ npm install --g bower
```

And after that go to project's root directory and run those commands to get all dependencies:

```sh
$ npm install
$ bower install
```

In China, you may prefer to use [cpn](http://npm.taobao.org/) instead. Make sure you installed __Node.js__ first, then execute commands as below:

```sh
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
$ cnpm install
```

Launch a browser sync server

```sh
$ gulp serve
```

Gulp commands
---

Gulp file is based on angular gulp generator (https://github.com/Swiip/generator-gulp-angular). There are few main task that you can do:

* `gulp` or `gulp build` to build an optimized version of your application in `/dist`
* `gulp serve` to launch a browser sync server on your source files
* `gulp serve:dist` to launch a server on your optimized application
* `gulp test` to launch your unit tests with Karma
* `gulp test:auto` to launch your unit tests with Karma in watch mode
* `gulp protractor` to launch your e2e tests with Protractor
* `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files

In bower.js file there are specify needed resources for Seed Project.