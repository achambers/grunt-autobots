# grunt-autobots

> A lightening fast deploy tool for Ember-CLI

##Motivation

Inspired by [Luke Melia][1]'s RailsConf 2014 presentation - [Lightning Fast Deployment of Your Rails-backed JavaScript app][2].

<sub>And the name?  Well......Transformers are just plain awesome?</sub>


##Synopsis

This plugin is designed to aid in the deployment workflow of an [Ember CLI][5] application.  The worflow is designed to follow on from a successful `ember build` command and runs as follows:

- Create an [Ember CLI][5] build
- Deploy assets to S3
- Deploy index.html to Redis
- (At some point afterwards) Activate a released index.html to be the current live version


## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-autobots --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-autobots');
```

##Usage

There are three tasks in this plugin designed to work in conjunction with each other.  Use of the plugin should go as follows:

```shell
$ ember build -e production
> Built project successfully. Stored in "dist/".

$ grunt autobots:rollout:assets
> Success
> Now run:
> grunt autobots:rollout:index

$ grunt autobots:rollout:index
> Success
>
> To Preview:
> http://<your-app-url>?key=abcd1234
>
> To Activate:
> grunt autobots:activate --key=abcd1234

$ grunt autobots:activate --key=abcd1234
> Success
>
> Release [abcd1234] successfully activated

```

NB: While [Ember CLI][5] is not specifically required, this plugin assumes the dist directory it is running against to conform to that which is output by the `ember build` command.


## "ember build -e production|development"

### Overview

While this command is not a part of this plugin, it should be run before using the plugin.  `grunt-autobots` expects a dist directory that conforms to what [Ember CLI][5] will output.  It expects to find the following directory structure:

```
.
+-- dist
|   +-- assets
|   |   +-- some.css
|   |   +-- some.js
|   |   +-- any-file-files-or-folders
|   +-- index.html
```

### Configuration

Because this plugin pushes the assets to a different location than the index.html, we need to prepend the asset locations with the host where they will be stored, in this case, S3.

Therefore, before running this command, make sure you tell the fingerprinting task of Broccoli to prepend the host.

In your Brocfile.js add this:

```js
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  fingerprint: {
    prepend: 'https://s3-eu-west-1.amazonaws.com/my-bucket/'
  }
});

module.exports = app.toTree();
```

## *grunt autobots:rollout:assets*

### Overview

This task is responsible for pushing your assets to S3.  For now, it only looks for files with a {js,css,png,gif,jpg} extension.

This task expects your assets to be located in an `assets` folder inside your specified `dist` directory.

In your project's Gruntfile, add a section named `autobots` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  autobots: {
    distDir: 'dist',
    s3: {
      accessKeyId: '1234',
      secretAccessKey: 'abcd',
      bucket: 'my-bucket'
    }
  },
});
```

### Configuration

#### distDir (optional)
Type: `String`
Default value: `'dist'`

A string value that is used to locate the files to be deployed.  As this tool is written with [Ember CLI][6] in mind, by default, it looks to the `dist` directory.

#### s3.accessKeyId (required)
Type: `String`

A string value that is the AWS access key that has access to S3.

#### s3.secretAccessKey (required)
Type: `String`

A string value that is the AWS secret that has access to S3.

#### s3.bucket (required)
Type: `String`

A string value that is used to determine which bucket to store the assets in.


## *grunt autobots:rollout:index*

### Overview

This task is responsible for pushing your index.html file to a Redis instance.  By default it will connect to Redis on the local machine, unless you specify connection details for another instance.

Once this task has been run, the version of the application can be previewed by adding the query param `?key=<some-key>` to the url of the application.

In your project's Gruntfile, add a section named `autobots` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  autobots: {
    appUrl: 'https://my-app.com',
    distDir: 'dist',
    redis: {
      host: 'jack.redistogo.com',
      post: '10728',
      password: 'bacdf3758329bdbaf5'
    }
  },
});
```

### Configuration

#### appUrl (optional)
Type: `String`
Default value: `''`

A string value that is used to notify the user of where to navigate to, to preview the latest release.

#### distDir (optional)
Type: `String`
Default value: `'dist'`

A string value that is used to locate the files to be deployed.  As this tool is written with [Ember CLI][6] in mind, by default, it looks to the `dist` directory.

#### redis.host (optional)
Type: `String`
Default value: `127.0.0.1`

A string value that is used to specify the Redis host.

#### redis.port (optional)
Type: `String`
Default value: `6379`

A string value that is used to specify the Redis port.

#### redis.password (optional)
Type: `String`
Default value: null

A string value that is used to specify the Redis password.

### Side Note

`grunt autobots:rollout:index` stores the current index.html under the key `index:<hash>`.

`<hash>` is intended to be the short SHA of the git commit that `HEAD` is currently pointing to at the time of running this task.

At this point in time `<hash>` is derived from an environment variable named `CIRCLE_SHA1`.  This is due to the fact that I am currently using this to deploy apps built by [Circle CI][6] and they make this env var available.  Therefore, in order for this to work, I'd firstly suggest deploying your application to [Circle CI][6].  If that is not an option you will either need to set this config variable or the `process.env.CIRCLE_SHA1` env var to something unique each time you run this task.

**[TODO]** - Retrieve the commit hash of `HEAD` and using this if `CIRCLE_SHA1` does not exist.


## *grunt autobots:activate*

### Overview

This task is responsible for activating an index.html entry to make it the current live version.  This task will look to the same Redis instance that `grunt autobots:rollout:index` pushed the index.html file to.

In your project's Gruntfile, add a section named `autobots` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  autobots: {
    redis: {
      host: 'jack.redistogo.com',
      post: '10728',
      password: 'bacdf3758329bdbaf5'
    }
  },
});
```

### Configuration

#### redis.host (optional)
Type: `String`
Default value: `127.0.0.1`

A string value that is used to specify the Redis host.

#### redis.port (optional)
Type: `String`
Default value: `6379`

A string value that is used to specify the Redis port.

#### redis.password (optional)
Type: `String`
Default value: null

A string value that is used to specify the Redis password.


### Command line arguments

#### --key=\<some-key\>

This command line option is required when running this task.  The `key` must correspond to the unique key of a deployed index.html file.


##Honourable Mentions

The following sites have contributed in some way, shape or form in the creation of this plugin.

- [Framework agnostic, fast zero-downtime Javascript app deployment][3]
- [Lightning Fast Deployments With Rails (in the Wild).][4]

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- [v0.0.4][10]
- [v0.0.3-alpha][9]
- [v0.0.2-alpha][8]
- [v0.0.1-alpha][7]


[1]: http://www.lukemelia.com "Luke Melia"
[2]: http://www.confreaks.com/videos/3324-railsconf-lightning-fast-deployment-of-your-rails-backed-javascript-app "Lightning Fast Deployment of Your Rails-backed JavaScript app"
[3]: https://medium.com/@feifanw/framework-agnostic-fast-zero-downtime-javascript-app-deployment-df40cf105622 "Framework agnostic, fast zero-downtime Javascript app deployment"
[4]: http://blog.abuiles.com/blog/2014/07/08/lightning-fast-deployments-with-rails/ "Lightning Fast Deployments With Rails (in the Wild)."
[5]: http://ember-cli.com "Ember CLI"
[6]: https://circleci.com/ "Circle CI"
[7]: https://github.com/achambers/grunt-autobots/releases/tag/v.0.0.1-alpha "Release v.0.0.1-alpha"
[8]: https://github.com/achambers/grunt-autobots/releases/tag/v.0.0.2-alpha "Release v.0.0.2-alpha"
[9]: https://github.com/achambers/grunt-autobots/releases/tag/v.0.0.3-alpha "Release v.0.0.3-alpha"
[10]: https://github.com/achambers/grunt-autobots/releases/tag/v.0.0.4 "Release v.0.0.4"
