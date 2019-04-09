require( './setup' );
const chai = require( 'chai' );
const spies = require( 'chai-spies' );
const nock = require( 'nock' );
chai.use( spies );

describe( "submitData()", () => {
  let rando
  let xhr, requests
  beforeEach( function () {
    window.fetch = require( 'node-fetch' );

    rando = Math.ceil( Math.random() * 1000 )



    chai.spy.on( window, 'fetch' );
    window.onerror = undefined;

  } );

  it( "makes a POST request to /user with a name and email", async () => {
    nock( 'http://localhost:3000' )
      .post( '/users' )
      .reply( 201, function ( uri, requestBody ) {
        return {
          id: rando,
          name: requestBody.name,
          email: requestBody.email,
        }
      } );

    let name = "Steve"
    let email = "steve@steve.com"

    await submitData( name, email )

    expect( window.fetch, "A fetch to the API was not found" )
      .to.have.been.called.with( 'http://localhost:3000/users' );
    expect( window.fetch )
      .to.have.been.called.exactly( 1 );

  } )

  it( "handles the POST request response, retrieves the new id value and appends it to the DOM", async function () {
    nock( 'http://localhost:3000' )
      .post( '/users' )
      .reply( 201, function ( uri, requestBody ) {
        return {
          id: rando,
          name: requestBody.name,
          email: requestBody.email,
        }
      } );

    let name = "Sam"
    let email = "sam@sam.com"

    await submitData( name, email )

    expect( document.body.innerHTML )
      .to.include( rando )
  } );

  it( "handles a failed POST request using catch, appends the error message to the DOM", async function () {
    let message = 'Unauthorized Access'
    nock( 'http://localhost:3000' )
      .post( '/users' )
      .replyWithError( {
        message: message,
        code: '401',
      } )

    let name = "Jim"
    let email = "jim@jim.com"

    await submitData( name, email )
    expect( document.body.innerHTML )
      .to.include( message )
  } )
} )
