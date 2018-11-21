# Title

## Learning Goals

- Use fetch() to send data to a remote host

## Introduction

* fetch() is a little browser in JavaScript
 * You have been using is like a browser does: retrieve a URL, follow a link
 * This corresponds to the GET action of the HTTP protocol: retrieve the
   content from a remote place
 * But what about sending data?
    * In the HTTP rptocol to _send_ data to a remote place we perform a POST
      action
    * The web page means for POST-ing data is an html `<form>`
 * In this lesson we'll configure fetch to behave like an HTML form, a
   JavaScript tool that can send data

## Use `fetch()` to Send Data To a Remote Host

### Extract Data form an HTML Form

form has : url, POST, and a key/value set of data to send
let's put that inside of fetch() API

### Place Extracted Data into fetch() Skeleton

```js
let config = {
  method: 'POST',
  body: {
    "dogName": "Byron"
    "dogBreed": "Poodle"
  }
}

fetch("url", config)
...
...

```

### Make POST Request using `fetch()`

(lab to test sending of post using a local web server)

## Conclusion

Congratulations, you can now use `fetch()` the browser inside your browser's
JavaScript environment to both:

* READ data using HTTP GET  (whose response you can put into the DOM)
* SEND data using HTTP POST (whose response you can put into the DOM)

With this we're ready to to stitch server updates (reads **and** updates) with
DOM updating and event handling, we're ready to build the "Simple Looker" from
scratch!
