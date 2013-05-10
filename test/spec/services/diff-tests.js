
describe('diff difference / merge', function() {

  var difference;

  beforeEach(function() {

    module('sharedobject');
    inject(function(diff) {
      difference = diff.difference;
    });

  });

  it('registers correctly with angular', function() {
    expect(difference).to.be.a('function');
  });

  describe('difference', function() {

    it('produces diffs without adds or deletes', function() {
      var obj1 = {
        foo: 'bar',
        baz: [ 1, 2, 3 ],
        active: true
      };
      var obj2 = {
        foo: 'bar',
        baz: [ 1, 2 ],
        active: false,
      };

      var diff = difference(obj1, obj2);
      var expected = {
        baz: [1, 2],
        active: false
      };

      expect(diff).to.eql(expected);
    });

    it('produces deep, nested diffs without adds or deletes', function() {
      var obj1 = {
        foo: 'bar',
        herp: {
          herp: {
            herp: 'derp'
          }
        },
        something: {
          something: {
            something: 'dark side'
          }
        },
        baz: [ 1, 2, 3 ],
        active: true
      };
      var obj2 = {
        foo: 'bar',
        something: {
          something: {
            something: 'all of them'
          }
        },
        herp: {
          herp: {
            herp: 'derp'
          }
        },
        baz: [ 1, 2 ],
        active: false,
      };

      var diff = difference(obj1, obj2);
      var expected = {
        baz: [1, 2],
        active: false,
        something: {
          something: {
            something: 'all of them'
          }
        }
      };

      expect(diff).to.eql(expected);
    });

    it('produces diffs with adds', function() {
      var obj1 = {
        foo: 'bar',
        baz: [ 1, 2, 3 ],
        active: true
      };
      var obj2 = {
        foo: 'bar',
        baz: [ 1, 2 ],
        active: false,
        newProp: 'oh noes!'
      };
      var expected = {
        baz: [1, 2],
        active: false,
        newProp: 'oh noes!'
      };

      var diff = difference(obj1, obj2);
      expect(diff).to.eql(expected);
    });

    it('produces diffs with delete', function() {
      var obj1 = {
        foo: 'bar',
        baz: [ 1, 2, 3 ],
        answer: 42,
        active: true
      };
      var obj2 = {
        foo: 'bar',
        baz: [ 1, 2 ],
        active: false
      };
      var expected = {
        baz: [1, 2],
        active: false,
        answer: undefined
      };

      var diff = difference(obj1, obj2);
      expect(diff).to.eql(expected);
    });
    
  });

});