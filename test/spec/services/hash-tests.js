
describe('hash', function() {

  var _hash;

  beforeEach(function() {

    module('sharedobject');
    inject(function(hash) {
      _hash = hash;
    });

  });

  it('registers correctly', function() {
    expect(_hash).to.be.a('function');
  });

  it('produces a hash for a string', function() {
    expect(_hash('this is a string')).to.be.a('number');
  });

  it('produces a hash for an object', function() {
    expect(_hash({ foo: 'this is a string' })).to.be.a('number');
  });

  it('produces a hash for an array', function() {
    expect(_hash([0, true, 'this is a string'])).to.be.a('number');
  });

  it('produces hashes that seem different (this test is sooo lame... I am actually just trusting someone elses code)', function() {
    var hash1 = _hash('this is a string');
    var hash2 = _hash({ foo: 'this is a string' });
    var hash3 = _hash([0, true, 'this is a string']);

    expect(hash1).to.not.equal(hash2).and.not.equal(hash3);
  });

});