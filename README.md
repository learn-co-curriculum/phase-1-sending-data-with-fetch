# Sending Data with Fetch

## Learning Goals

- Use `fetch()` to send data to a remote host
- Handle the response from a successful request
- Handle errors from an unsuccessful request

## Introduction

If you think about it, `fetch()` is a little browser in your browser. You tell
`fetch()` to go to a URL by passing it an argument e.g.
`fetch("https://flatironschool.com")` and it makes a network request. You
chain calls to `fetch()` with `then()`. Each `then()` call takes a callback
function as its argument, based on actions in the callback function, we can
display the content, update it, or inject it into the DOM.

This is a lot like browsing the web: you change the URL in the URL bar, or you
follow a link and those actions tell the browser to go somewhere else and get
the data. A technical way to describe that is: "The browser implements an HTTP
`GET` to retrieve the content at a URL." It's also 100% technically correct to
say "`fetch()` uses an HTTP `GET` to retrieve the content specified by a URL."

The browser also provides a helpful model for understanding what _sending_ data
from the browser looks like. We know this as an HTML _form_. Technically
speaking, HTML forms "use an HTTP `POST` to send content gathered in `<input>`
elements to a specified URL" It's also 100% technically correct to say
"`fetch()` uses an HTTP `POST` to send content gathered in a JavaScript `Object`

HTML forms are still widely used, but with `fetch()`, we have more detailed
control of the request. Using `fetch()`, we can actually _override_ the normal
behavior of an HTML form, capturing any user input, packaging it up with
the appropriate request information and sending it out.

Our focus this lesson will be to learning how to send data using `fetch()`.

## Introduce the JSON Server

To help us practice sending `fetch()` requests, this lab comes with a dependency
called [`json-server`][json-server]. The JSON Server allows us to start a fake
RESTful API within our lab folder, giving us the ability to send both GET and
POST requests and to persist and receive data.

Install it by executing `npm install -g json-server`.  To start up JSON Server,
run `json-server --watch db.json` in your terminal.

Once the server is running, you'll see a list of available resource paths:

```bash
Resources
  http://localhost:3000/dogs
  http://localhost:3000/cats
  http://localhost:3000/users
  http://localhost:3000/robots
```

These endpoints each provide different sets of data. Since it is mimicking a
RESTful API, sending a request to 'http://localhost:3000/dogs' will return all
records in the database for dogs, while 'http://localhost:3000/dogs/1' will
return the dog with the id of 1.

Some example data is already present, stored in `db.json`. If the JSON
server is running, you can also visit any of the above resources in a browser to
see the data.

The tests in this lab do not need JSON Server to be running, but if you would
like to run tests while also running the server, open a second tab in your
terminal.

## Analyze Data Sent in an HTML Form

Let's take a look at a `<form>` (_see `sample_form.html` in this repo_):

```html
<form action="http://localhost:3000/dogs" method="POST">
  <label> Dog Name: <input type="text" name="dogName" id="dogName" /></label><br />
  <label> Dog Breed: <input type="text" name="dogBreed" id="dogBreed" /></label><br />
  <input type="submit" name="submit" id="submit" value="Submit" />
</form>
```

The key components as far as sending data to the server are:

- The destination URL as defined in the `action` attribute of the `<form>` tag
- The HTTP verb to use as defined in the `method` attribute of the `<form>` tag
- The key / value data about the inputs in the fields `dogName` and `dogBreed`

We should expect that our "mini-browser," `fetch()` will need those same bits
of information in order to send data to the server. Let's place this data
inside our `form()` skeleton.

> **Note**: if you have the JSON server running and open `sample_form.html`,
> you will be able to submit the form and successfully POST data to the JSON
> server database, `db.json`. Try it out!

## Construct a POST Request Using `fetch()`

Sending a POST request with `fetch()` is more complicated than what we've seen
up to this point. It still takes a `String` representing the desintation URL as
the first argument, as always. But as we will see below, `fetch()` can also take
a JavaScript `Object` (`{}`) as the _second_ argument. This `Object` can be
given certain [properties][p] with certain values in order to change `fetch()`'s
default behavior.

```js
fetch(destinationURL, configurationObject);
```

The `configurationObject` contains three core components that are needed for
standard POST requests.

### Add the HTTP Verb

So far, comparing to an HTML form, we've only got the destination URL
('http://localhost:3000/dogs' in this case). The next thing we need is to
include the HTTP verb. By default, the verb is GET, which is why we can send
simple GET requests with _only_ a destination URL. To tell `fetch()` that this
is a POST request, we need to add a `method` key to our `configurationObject`:

```js
configurationObject = {
  method: "POST"
};
```

### Add Headers

The second piece we need to include is some _metadata_ about the actual data we
want to send. This metadata is in the form of [_headers_][headers]. Headers are
sent just ahead of the actual data payload of our POST request. They contain
information about the data being sent.

One very common header is [`"Content-Type"`][content-type]. `"Content-Type"` is
used to indicate what format the data being sent is in. With JavaScript's
`fetch()`, [JSON][json] is the most common format we will be using. We want to
make sure that the destination of our POST request knows this. To do this, we'll
include the `"Content-Type"` header:

```js
configurationObject = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};
```

Each individual header is stored as a key/value pair inside an object. This
object is assigned to the `headers` key as seen above.

When sending data, the server at the destination URL will send back a response,
often including data that the sender of the `fetch()` request might find useful.
Just like `"Content-Type"` tells the destination server what type of data we're
sending, it is also good practice to tell the server what data format we
_accept_ in return.

To do this, we add a second header, [`"Accept"`][accept], and assign it to
`"application/json"` as well:

```js
configurationObject = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
};
```

There are many other [headers][headers] available for particular uses. Some are
used to send credentials or user authentication keys. Others are used to send
cookies containing user info. `"Content-Type"` and `"Accept"` are two that we'll
see the most throughout the remainder of this course.

Servers may reject requests without the specific headers the server is
configured to expect.

### Add Data

We now have the destination URL, our HTTP verb, and headers that include
information about the data we're sending. The last thing to add is the _data_
itself.

Data being sent in `fetch()` must be stored in the `body` of the
`configurationObject`:

```js
configurationObject = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: /* Your data goes here */
};
```

There is a catch here to be aware of - when data is exchanged between a client
(your browser, for instance), and a server, the data is sent as _text_. Whatever
data we're assigning to the `body` of our request needs to be a string.

#### Use `JSON.stringify()` to Convert Objects to Strings

When sending data using `fetch()`, we often send multiple pieces of information
in one request. In our code, we often organize this information using
objects. Consider the following object, for instance:

```js
{
  dogName: "Byron",
  dogBreed: "Poodle"
}
```

This object contains two related pieces of information, a dog's name and breed.
Let's say we want to send the data in this object to a server. We can't simply
assign it to `body`, as it isn't a string. Instead, we convert it to JSON.
The object above, converted to JSON would look like this:

```json
"{"dogName":"Byron","dogBreed":"Poodle"}"
```

Here, using JSON has enabled us to preserve the key/value pairs of our object
within the string. When sent to a server, the server will be able to take this
string and convert it back into key/value pairs in whatever language the server
is written in.

Fortunately, JavaScript comes with a built in method for converting objects to
strings, `JSON.stringify()`. By passing an object in, `JSON.stringify()` will
return a string, formatted and ready to send in our request:

```js
configurationObject = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    dogName: "Byron",
    dogBreed: "Poodle"
  })
};
```

## Send the POST Request

We've got all the pieces we need. Putting it all together, we get:

```js
fetch("http://localhost:3000/dogs", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify({
    dogName: "Byron",
    dogBreed: "Poodle"
  })
});
```

With the JSON server running, if you open up `sample_form.html` or `index.html`,
you can use the above to successfully send a POST request and persist data to
`db.json`.

Obviously, we don't have to define everything inside of one anonymous `Object`.
We could also write (they're exactly the same!):

```js
let formData = {
  dogName: "Byron",
  dogBreed: "Poodle"
};

let configObj = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(formData)
};

fetch("http://localhost:3000/dogs", configObj);
```

**Note**: As a security precaution, most modern websites block the ability to
use `fetch()` in console while on their website, so if you are testing out
code in browser, make sure to be on a page like `index.html` or
`sample_form.html`.

## Handling What Happens After

Just like when we use `fetch()` to send GET requests, we have to handle
responses to `fetch()`. As mentioned before, servers will send a
[Response][response] that might include useful information. To access this
information, we use a series of calls to `then()` which are
given function _callbacks_.

Building on the previous implementation we might write the following:

```js
let formData = {
  dogName: "Byron",
  dogBreed: "Poodle"
};

let configObj = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(formData)
};

fetch("http://localhost:3000/dogs", configObj)
  .then(function(response) {
    return response.json();
  })
  .then(function(object) {
    console.log(object);
  });
```

Notice that the first `then()` is passed a callback function that takes in
`response` as an argument. This is a [`Response`][response] object, representing
what the destination server sent back to us. This object has a built in method,
`json()`, that converts the _body_ of the response from JSON to a plain old
JavaScript object. The result of `json()` is returned and made available in the
_second_ `then()`. In this example, whatever `response.json()` returns will be
logged in `console.log(object)`.

Sending the example above to our JSON server, once the request is successfully
resolved, we would see the following log:

```js
{dogName: "Byron", dogBreed: "Poodle", id: 6} // Your ID will vary depending
```

The JSON server is sending back the data we sent, along with a new piece of
data, an `id`, created by the server.

### When Things Go Wrong: Using `catch()`

When something goes wrong in a `fetch()` request, JavaScript will look down the
chain of `.then()` calls for something very similar to a `then()` called a
`catch()`.

When something goes wrong in a `fetch()`, the next `catch()` is called so that
error work can be performed. Say for instance, we forgot to add the HTTP verb to
our POST request, and the `fetch()` defaults to GET. By including a `catch()`
statement, JavaScript doesn't fail silently:

```js
let formData = {
  dogName: "Byron",
  dogBreed: "Poodle"
};

// method: "POST" is missing from the object below
let configObj = {
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  body: JSON.stringify(formData)
};

fetch("http://localhost:3000/dogs", configObj)
  .then(function(response) {
    return response.json();
  })
  .then(function(object) {
    console.log(object);
  })
  .catch(function(error) {
    alert("Bad things! Ragnarők!");
    console.log(error.message);
  });
```

Sent to our JSON server from a page like `index.html`, we would receive an
alert window pop-up and a logged message:

```text
Failed to execute 'fetch' on 'Window': Request with GET/HEAD method cannot have body.
```

While `catch()` may not stop _all_ silent errors, it is useful to have as a way
to gracefully handle unexpected results. We can use it, for instance, to display
a message in the DOM for a user, rather than leave them with nothing.

## Challenge

It's time to practice writing your own POST request using `fetch()`. In
`index.js`, write a method, `submitData`, that takes two strings arguments, one
representing a user's name and the other representing a user's email.

The first two tests mirror the behavior of the JSON server. As you write your
solution, keep the server running to test your code. Open `index.html` in a
browser to gain access to your `submitData` function in console.

**Note**: The tests in this lab need access to the `fetch()` request inside
`submitData`. In order to give them access, write you solution so that
`submitData` _returns_ the `fetch()`. This will not change the behavior of
your `fetch()`.

### Test 1 - Send Data

In `submitData`, write a valid POST request to `http://localhost:3000/users`
using `fetch()`. This request should include:

- The destination URL
- Headers for 'Content-Type' and 'Accept' set to 'application/json'
- A body with the name and email passed in as arguments to `submitData`. These
  should be assigned to `name` and `email` keys within an object. This object
  should then be stringified.

### Test 2 - Handle the Response

On a successful POST request, expect the server to respond with a
[`Response`][response] object. Just like we saw earlier in the dog example, the
`body` property of this response will contain the data from the POST request
along with a newly assigned _id_.

Use a `then()` call to access the `Response` object and use its built in
`json()` method to parse the contents of the `body` property. Use a _second_
`then()` to access this newly converted object. From this object, find the new
id and append this value to the DOM.

Using `index.html` and the JSON server, if your code is successful, calling
`submitData` in the console should cause an id number to appear on the page.

### Test 3 - Handle Errors

For this final test, after the two `then()` calls on your `fetch()` request,
add a `catch()`.

When writing the callback function for your `catch()`, expect to receive an
object on error with a property, `message`, containing info about what went
wrong. Append this message to the DOM when `catch()` is called.

### Test 4 - Return the Fetch Chain

An amazing feature of `fetch()` is that if you _return_ it, _other_ functions
can tack-on _their own_ `then()` and `catch()` calls. While we won't explore
this amazing idea in this lesson, let's learn good habits and be sure to return
the `fetch()` chain from our `submitData` function.

## Conclusion

Congratulations! You can now use `fetch()`: the browser inside your browser's
JavaScript environment to both:

- READ data using HTTP GET (whose response you can put into the DOM)
- SEND data using HTTP POST (whose response you can put into the DOM)

With this we're ready to to stitch server updates (reads **and** updates) with
DOM updating and event handling. We're almost ready to build the "Simple
Liker" from scratch!

[json-server]: https://github.com/typicode/json-server
[p]: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters
[json]: https://www.json.org/
[headers]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers
[content-type]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
[accept]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
[jsonstringify]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
[jsonobject]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON
