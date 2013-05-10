
describe('diff difference / merge', function() {

  var difference, merge;

  beforeEach(function() {

    module('sharedobject');
    inject(function(diff) {
      difference = diff.difference;
      merge = diff.merge;
    });

  });

  it('registers correctly with angular', function() {
    expect(difference).to.be.a('function');
    expect(merge).to.be.a('function');
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

  describe('merge', function() {

    it('adds properties', function() {
      var obj = {
      };
      var diff = {
        foo: 'bar'
      };
      var expected = {
        foo: 'bar'
      };

      expect(merge(obj, diff)).to.eql(expected);
    });

    it('preserves unchanged properties', function() {
      var obj = {
        baz: true
      };
      var diff = {
        foo: 'bar'
      };
      var expected = {
        foo: 'bar',
        baz: true
      };

      expect(merge(obj, diff)).to.eql(expected);
    });

    it('overwrites changed properties', function() {
      var obj = {
        baz: true
      };
      var diff = {
        foo: 'bar',
        baz: false
      };
      var expected = {
        foo: 'bar',
        baz: false
      };

      expect(merge(obj, diff)).to.eql(expected);
    });

    it('works deeply', function() {
      var obj = {
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
      var diff = {
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

      var expected = {
        foo: 'bar',
        herp: {
          herp: {
            herp: 'derp'
          }
        },
        something: {
          something: {
            something: 'all of them'
          }
        },
        baz: [ 1, 2 ],
        active: false
      };

      expect(merge(obj, diff)).to.eql(expected);
    });

    it('removes deleted properties', function() {
      var obj = {
        foo: 'bar',
        baz: true
      };
      var diff = {
        foo: undefined,
        baz: false
      };
      var expected = {
        baz: false
      };

      expect(merge(obj, diff)).to.eql(expected);
    });

    it('removes deleted properties deeply', function() {
      var obj = {
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
      var diff = {
        foo: 'bar',
        something: {
          something: {
            something: undefined
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

      var expected = {
        foo: 'bar',
        herp: {
          herp: {
            herp: 'derp'
          }
        },
        something: {
          something: {
          }
        },
        baz: [ 1, 2 ],
        active: false
      };
      var result = merge(obj, diff);

      expect(result).to.eql(expected);
    });
  });

});

