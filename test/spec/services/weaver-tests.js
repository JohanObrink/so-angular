
describe('weaver', function() {

  var _weave, lists;

  beforeEach(function() {
    module('soApp');

    inject(function(weave) {
      _weave = weave;
    });

    lists = [
      [ 'a0', 'a1', 'a2', 'a3', 'a4', 'a5' ],
      [ 'b0', 'b1' ],
      [ 'c0', 'c1', 'c2' ]
    ];
  });

  it('exists', function() {
    expect(_weave).to.be.a('function');
  });

  it('weaves arrays correctly', function() {
    var result = _weave(lists);

    expect(result).to.be.instanceof(Array);
    expect(result).to.have.length(11);
    expect(result.join(' ')).to.equal('a0 c0 a1 b0 a2 c1 a3 b1 a4 c2 a5');

  });

  it('limits result length to total if supplied', function() {
    var result = _weave(lists, 5);

    expect(result).to.have.length(5);
    expect(result.join(' ')).to.equal('a0 c0 a1 b0 a2');
  });
});