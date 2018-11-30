const helpers = require('./helpers');
const chai = require( 'chai' );
const spies = require( 'chai-spies' );
const nock = require( 'nock' );
const verlain = "Lbh unir orra nqqrq gb gur thrfg obbx";

chai.use( spies );

describe("index.js", () => {
  beforeEach(function() {
    window.fetch = require( 'node-fetch' );

    nock( 'http://guestbook.example.com' )
      .post( '/register' )
      .reply( 200, {
        "message": global.rot13(verlain),
      });

    nock( 'http://guestbook.example.com' )
      .post( '/register-error' )
      .reply(404);

    chai.spy.on( window, 'fetch' );
    window.onerror = undefined;
  });

  it("makes a request to /register with a name and a message", async () => {
    let message = await registerSelf();

    expect(window.fetch, "A fetch to the API was not found" ).to.have.been.called.with( 'http://guestbook.example.com/register' );
    expect(window.fetch ).to.have.been.called.exactly( 1 );
    expect(message).to.eq(global.rot13(verlain));
  })

  it("processes the returned JSON and extracts the value of the 'message' key", async function() {
    let message = await registerSelf();
    expect(message).to.eq(global.rot13(verlain));
  });

  it("processes a bad request and returns a sad face", async function() {
    let message = await errorSelf();
    expect(message).to.eq(":(");
  });
})
