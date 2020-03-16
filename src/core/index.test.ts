import {maxKey, selectKeys} from './index';

const identity = (x: any) => x;

describe('maxKey', function () {
  it('should return null when given only k', function () {

    var maxKey1 = maxKey(identity);
    expect(maxKey1).toBe(null)
  })
  it('should return the entity e with the largest of k(e)', function () {

    var maxKey1 = maxKey(identity, 1);
    expect(maxKey1).toBe(1)

    var maxKey1 = maxKey(identity, 1, 2, 3);
    expect(maxKey1).toBe(3)

    var maxKey1 = maxKey((a: any) => {
      Math.pow(a, 2)
    }, 1, 2, 3);
    expect(maxKey1).toBe(3)

    var maxKey1 = maxKey((a: any) => {
      Math.pow(a, 2)
    }, 1, 2, -3);
    expect(maxKey1).toBe(-3)
  });
})


describe('selectKeys', function () {
  it('should return an empty map when none of the keyseq keys are present in the map', function () {
    var map = new Map();
    map.set("foo", "bar")
    map.set("bin", "baz")
    var ret = selectKeys(map, [1, 2, 3]);
    expect(ret.size).toEqual(0)
  });

  it('should return all keys present in keyseq from input map, regardless of type', function () {
    var map = new Map();
    map.set("foo", "bar")
    map.set("bin", "baz")
    map.set(2, "boo")
    var ret = selectKeys(map, [1, 2, 3, "foo"]);
    expect(ret.size).toEqual(2)
    expect(ret.get("foo")).toEqual("bar")
    expect(ret.get(2)).toEqual("boo")
  });

});
