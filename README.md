# grunt-autobots

> A lightening fast deploy tool for Ember-CLI

##Motivation

Inspired by [Luke Melia][1]'s RailsConf 2014 presentation - [Lightning Fast Deployment of Your Rails-backed JavaScript app][2].

This tool is explicitly designed to be used in conjunction with an [Ember CLI][5] application.

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

## The "autobots:rollout:index" task

### Overview
In your project's Gruntfile, add a section named `autobots` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  autobots: {
  },
});
```

### Options

#### appUrl (optional)
Type: `String`
Default value: `''`

A string value that is used to notify the user of where to navigate to, to preview the latest release.

#### distDir (optional)
Type: `String`
Default value: `'dist'`

A string value that is used to locate the files to be deployed.  As this tool is specifically written to be used with an [Ember CLI][6] application, by default, it looks to the `dist` directory.

#### hash (optional)
Type: `String`
Default value: `'<%= process.env.CIRCLE_SHA1 =>'`

A string value that is used to make up the unique key that the index.html file will be stored against in Redis.
If this value is not provided by the user, autobots:rollout:index will look for the `process.env.CIRCLE_SHA1` variable.  Therefore, alternatively, you can the `CIRCLE_SHA1` environment variable.

**Why `CIRCLE_SHA1`?** - Because I'm deploying my apps from [Circle CI][6] currently and that env var contains the current git hash.

**[TODO]** - Retrieve the commit hash of `HEAD` and using this if `CIRCLE_SHA1` does not exist.

#### redis (optional)
Type: `Object`

##### redis.host
Type: `String`
Default value: `127.0.0.1`

##### redis.port
Type: `String`
Default value: `6379`

##### redis.password
Type: `String`
Default value: null


### Usage Examples

#### General Options
In this example, the general options describe where the dist directory is located and what the app url is.

```js
grunt.initConfig({
  autobots: {
    distDir: 'output/dist',
    appUrl: 'http://optimusprime.com'
  },
});
```

#### Redis Options
In this example, the `redis` options describe how to connect to the Redis server.

```js
grunt.initConfig({
  autobots: {
    redis: {
      host: 'jack.redistogo.com',
      port: '10753',
      password: 'c6463bda4249fbcad86688'
    }
  },
});
```

##Honourable Mentions

The following sites have contributed in some way, shape or form in the creation of this tool.

- [Framework agnostic, fast zero-downtime Javascript app deployment][3]
- [Lightning Fast Deployments With Rails (in the Wild).][4]

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_

[1]: http://www.lukemelia.com "Luke Melia"
[2]: http://www.confreaks.com/videos/3324-railsconf-lightning-fast-deployment-of-your-rails-backed-javascript-app "Lightning Fast Deployment of Your Rails-backed JavaScript app"
[3]: https://medium.com/@feifanw/framework-agnostic-fast-zero-downtime-javascript-app-deployment-df40cf105622 "Framework agnostic, fast zero-downtime Javascript app deployment"
[4]: http://blog.abuiles.com/blog/2014/07/08/lightning-fast-deployments-with-rails/ "Lightning Fast Deployments With Rails (in the Wild)."
[5]: http://ember-cli.com "Ember CLI"
[6]: https://circleci.com/ "Circle CI"
