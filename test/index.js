var should = require('chai').should()
  , request = require('supertest')
  , Sut = require('../lib');

describe('Server', function() {
	
  before(function() {
    var sut = new Sut('server', __dirname + '/fixtures/apps');
    
    sut.configure();
    
    this.request = request(sut.app.callback());
  });
  
  describe('Routing', function() {
    it('should return 200 for GET /users', function(done) {
      this.request.get('/users').expect(200, done);
    });
    
    it('should return 404 for GET /users/123', function(done) {
      this.request.get('/users/123').expect(404, done);
    });
    
    it('should return 404 for POST /users', function(done) {
      this.request.post('/users').expect(405, done);
    });
    
    it('should return 404 for GET /user', function(done) {
      this.request.get('/user').expect(404, done);
    });    
    
    it('should return 200 for GET /groups', function(done) {
      this.request.get('/groups').expect(200, done);
    });
    
    it('should return 200 for POST /groups', function(done) {
      this.request.post('/groups')
      .send({ name: 'john' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({ name: 'john' })
      .expect(200, done);
    });
  });	
});

describe('Server with multiple apps', function() {
	
  before(function() {
    var sut = new Sut('server', __dirname + '/fixtures/apps');
    
    sut
    .configure()
    .mount(__dirname + '/fixtures/more')
    .prepare();

    this.request = request(sut.app.callback());
  });
 
  describe('Routing', function() {
    it('should return 200 for GET /roles', function(done) {
      this.request.get('/roles').expect(200, done);
    });
    
    it('should return 200 for GET /users', function(done) {
      this.request.get('/users').expect(200, done);
    });
  });	
});
