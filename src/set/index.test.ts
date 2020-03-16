import {
  bubbleMaxKey,
  difference,
  index,
  intersection, join,
  mapInvert,
  project,
  rename,
  renameKeys,
  select,
  union
} from "../set";

const identity = (x: any) => x;

describe('set functions', function () {

  describe('bubbleMaxKey', function () {
    it('should move the element e with the largest value k(v) to the front of the collection', function () {

      console.log(bubbleMaxKey(identity, [1, 3, 4]));

      expect(bubbleMaxKey(identity, [1, 3, 4])).not.toBe(null)
      expect(bubbleMaxKey(identity, [1, 3, 4])).toEqual([4, 1, 3])
    });
  })

  describe('union', function () {
    it('should return an empty set when given no arguments', function () {
      let u: Set<any> = union()
      expect(u.size).toBe(0)
    });

    it('should return a single set if given a single set', function () {
      let theSet = new Set<any>([1, 2, 3]);
      let u: Set<any> = union(theSet)
      expect(u.size).toBe(3)
      expect(u).toStrictEqual(theSet)
    });

    it('should return the union when given two sets', function () {
      let s1 = new Set<any>([1, 2, 3]);
      let s2 = new Set<any>([3, 4, 5]);
      let u: Set<any> = union(s1, s2)
      expect(u.size).toBe(5)
      expect(u.has(1)).toBeTruthy()
      expect(u.has(2)).toBeTruthy()
      expect(u.has(3)).toBeTruthy()
      expect(u.has(4)).toBeTruthy()
      expect(u.has(5)).toBeTruthy()
      expect(u.has(6)).toBeFalsy()
    });

    it('should return the union when given four sets', function () {
      let s1 = new Set<any>([1, 2, 3]);
      let s2 = new Set<any>([3, 4, 5]);
      let s3 = new Set<any>([6, 7, 8]);
      let s4 = new Set<any>([9, 10, 11]);
      let u: Set<any> = union(s1, s2, s3, s4)
      expect(u.size).toBe(11)
      for (let i = 1; i < 12; i++) {
        expect(u.has(i)).toBeTruthy()
      }

    });


  });

  describe('intersection', function () {
    it('should return an empty set when given no arguments', function () {
      let u: Set<any> = intersection()
      expect(u.size).toBe(0)
    });

    it('should return a single set if given a single set', function () {
      let theSet = new Set<any>([1, 2, 3]);
      let u: Set<any> = intersection(theSet)
      expect(u.size).toBe(3)
      expect(u).toStrictEqual(theSet)
    });

    it('should return the intersection when given two sets', function () {
      let s1 = new Set<any>([1, 2, 3]);
      let s2 = new Set<any>([3, 4, 5]);
      let u: Set<any> = intersection(s1, s2)
      expect(u.size).toBe(1)
      expect(u.has(1)).toBeFalsy()
      expect(u.has(2)).toBeFalsy()
      expect(u.has(3)).toBeTruthy()
      expect(u.has(4)).toBeFalsy()
      expect(u.has(5)).toBeFalsy()
      expect(u.has(6)).toBeFalsy()
    });

    it('should return the intersection when given four sets', function () {
      let s1 = new Set<any>([1, 2, 3, 5]);
      let s2 = new Set<any>([3, 4, 5, 1]);
      let s3 = new Set<any>([6, 7, 8, 3]);
      let s4 = new Set<any>([9, 10, 11, 3]);
      let u: Set<any> = intersection(s1, s2, s3, s4)
      expect(u.size).toBe(1)
      for (let i = 1; i < 12; i++) {
        if (i === 3) {
          expect(u.has(i)).toBeTruthy()
        } else {
          expect(u.has(i)).toBeFalsy()
        }
      }

    });

  })

  describe('difference', function () {
    it('should return an empty set when given no arguments', function () {
      let u: Set<any> = difference()
      expect(u.size).toBe(0)
    });

    it('should return a single set if given a single set', function () {
      let theSet = new Set<any>([1, 2, 3]);
      let u: Set<any> = difference(theSet)
      expect(u.size).toBe(3)
      expect(u).toStrictEqual(theSet)
    });

    it('should return the difference when given two sets', function () {
      let s1 = new Set<any>([1, 2, 3]);
      let s2 = new Set<any>([3, 4, 5]);
      let u: Set<any> = difference(s1, s2)
      expect(u.size).toBe(2)
      expect(u.has(1)).toBeTruthy()
      expect(u.has(2)).toBeTruthy()
      expect(u.has(3)).toBeFalsy()
      expect(u.has(4)).toBeFalsy()
      expect(u.has(5)).toBeFalsy()
      expect(u.has(6)).toBeFalsy()
    });

    it('should return the difference when given four sets', function () {
      let s1 = new Set<any>([1, 2, 3, 5]);
      let s2 = new Set<any>([3, 4, 5, 1]);
      let s3 = new Set<any>([6, 7, 8, 3]);
      let s4 = new Set<any>([9, 10, 11, 3]);

      let u: Set<any> = difference(s1, s2, s3, s4)
      expect(u.size).toBe(1)
      // expect(u.has(1)).toBeTruthy;
      expect(u.has(2)).toBeTruthy();
      // expect(u.has(3)).toBeTruthy;
      expect(u.has(4)).toBeFalsy();
      expect(u.has(5)).toBeFalsy();
      expect(u.has(6)).toBeFalsy();
      expect(u.has(7)).toBeFalsy();
      expect(u.has(8)).toBeFalsy();
      expect(u.has(9)).toBeFalsy();
      expect(u.has(10)).toBeFalsy();
      expect(u.has(11)).toBeFalsy();
    });

  })

  describe('select', function () {
    it('should return an empty set when given an empty set', function () {
      let u: Set<any> = select(identity, new Set())
      expect(u.size).toBe(0)
    });

    it('should return a single set if given a single set', function () {
      let theSet = new Set<any>([1, 2, 3, 4]);
      let u: Set<any> = select(identity, theSet)
      expect(u.size).toBe(4)
      expect(u).toEqual(theSet)
    });

  })

  describe('project', function () {
    it('should return an empty set when given an empty set', function () {
      let u: Set<any> = project(new Set(), [])
      expect(u.size).toBe(0)
    });

    it('should return a single set if given a single set', function () {
      const m1 = new Map()
      const m2 = new Map()
      const m3 = new Map()
      const m4 = new Map()
      m1.set("id", 1);
      m1.set("age", 1);
      m1.set("name", "1")

      m2.set("id", 2);
      m2.set("age", 2);
      m2.set("name", "2")

      m3.set("id", 3);
      m3.set("age", 3);
      m3.set("name", "3")

      m4.set("id", 4);
      m4.set("age", 4);
      m4.set("name", "4")
      let theSet = new Set<any>([m1, m2, m3, m4]);
      let u: Set<any> = project(theSet, ["id", "age"])
      expect(u.size).toBe(4)
      m1.delete("name")
      m2.delete("name")
      m3.delete("name")
      m4.delete("name")
      expect(u).toEqual(new Set([m1, m2, m3, m4]))
    });

  })

  describe('renameKeys', function () {
    it('should return an empty map when given an empty map', function () {
      const ret = renameKeys(new Map<any, any>(), new Map<any, any>());
      expect(ret).toEqual(new Map<any, any>())
    });

    it('should rename all keys in kmap, when present in map m, leaving other keys in m unaffected', function () {
      const kmap = new Map<any, any>()
      kmap.set("r1", "renamed1")
      kmap.set("r2", "renamed2")
      kmap.set("r3", "renamed3")

      const map = new Map<any, any>()
      map.set("r1", "v1")
      // map.set("r2", "v2")
      map.set("r3", "v3")
      map.set("r4", "v4")

      const ret: Map<any, any> = renameKeys(map, kmap);

      const expected = new Map<any, any>()
      expected.set("renamed1", "v1")
      expected.set("renamed3", "v3")
      expected.set("r4", "v4")

      console.log("Ret:");
      console.log(ret);
      console.log("Expected");
      console.log(expected);

      expect(ret).toEqual(expected)
      expect(ret.has("r2")).toBeFalsy()
    });
  });

  describe('rename', function () {
    it('should return an empty rel when given an empty rel', function () {
      const ret = rename(new Set<Map<any, any>>(), new Map<any, any>());
      expect(ret.size).toBe(0)
    });

    it('should rename all maps in xrel with keys in kmap', function () {
      const kmap = new Map<any, any>()
      kmap.set("r1", "renamed1")
      kmap.set("r2", "renamed2")
      kmap.set("r3", "renamed3")

      const map1 = new Map<any, any>()
      map1.set("r1", "v1")
      // map1.set("r2", "v2")
      map1.set("r3", "v3")
      map1.set("r4", "v4")

      const map2 = new Map<any, any>()
      map2.set("r1", "v1")
      map2.set("r2", "v2")
      // map2.set("r3", "v3")
      map2.set("r4", "v4")

      const xrel: Set<Map<any, any>> = new Set()
      xrel.add(map1)
      xrel.add(map2)

      const ret: Set<Map<any, any>> = rename(xrel, kmap);

      expect(ret.size).toEqual(2)

      const expectedMap1 = new Map<any, any>()
      expectedMap1.set("renamed1", "v1")
      expectedMap1.set("renamed3", "v3")
      expectedMap1.set("r4", "v4")

      const expectedMap2 = new Map<any, any>()
      expectedMap2.set("renamed1", "v1")
      expectedMap2.set("renamed2", "v2")
      expectedMap2.set("r4", "v4")

      const expected = new Set()
      expected.add(expectedMap1)
      expected.add(expectedMap2)
      expect(ret).toEqual(expected)
    });
  })

  describe('index', function () {
    it('should return an empty index when given empty an empty xrel', function () {
      const kmap = new Map<any, any>()
      kmap.set("r1", "renamed1")
      kmap.set("r2", "renamed2")
      kmap.set("r3", "renamed3")

      const xrel: Set<Map<any, any>> = new Set()

      const ret = index(xrel, ["r1", "r4"]);
      expect(ret.size).toEqual(0)
    });

    it('should return an index when given xrel and ks', function () {
      const kmap = new Map<any, any>()
      kmap.set("r1", "renamed1")
      kmap.set("r2", "renamed2")
      kmap.set("r3", "renamed3")


      const map1 = new Map<any, any>()
      map1.set("r1", "v1")
      // map1.set("r2", "v2")
      map1.set("r3", "v3")
      map1.set("r4", "v4")

      const map2 = new Map<any, any>()
      map2.set("r1", "v1")
      map2.set("r2", "v2")
      // map2.set("r3", "v3")
      map2.set("r4", "v4")

      const map3 = new Map<any, any>()
      map3.set("x1", "v1")
      map3.set("x2", "v2")
      // map3.set("x3", "v3")
      map3.set("x4", "v4")

      const map4 = new Map<any, any>()

      const map5 = new Map<any, any>()
      map5.set("x3", "v3")
      map5.set([1, 2, 3], "v4")


      const map6 = new Map<any, any>()
      map6.set("x3", "v3")
      map6.set([1, 2, 3], "v4")
      map6.set("r1", "v1")
      map6.set("r2", "v2")
      // map6.set("r3", "v3")
      map6.set("r4", "v4")

      const xrel: Set<Map<any, any>> = new Set()
      xrel.add(map1)
      xrel.add(map2)
      xrel.add(map3)
      xrel.add(map4)
      xrel.add(map5)
      xrel.add(map6)

      const ret = index(xrel, ["r1", "r4", [1, 2, 3]]);
      console.log(ret);

    });
  });

  describe('mapInvert', function () {
    it('should invert a map', function () {
      const map6 = new Map<any, any>()
      map6.set("x3", "v3")
      map6.set([1, 2, 3], "v4")

      const expected = new Map<any, any>()
      expected.set("v3", "x3")
      expected.set("v4", [1, 2, 3])

      expect(mapInvert(map6)).toEqual(expected)
    });
  });

  describe('join', function () {
    it('should join on two rels with common keys and values', function () {
      const m1 = new Map()
      m1.set("id", 1)
      m1.set({foo: "xyz"}, 1)
      m1.set("flavor", "spicy")

      const m2 = new Map()
      m2.set("id", 2)
      m2.set({foo: "xyz"}, 2)
      m2.set("flavor", "sweet")

      const xrel = new Set([m1, m2])

      const m3 = new Map()

      m3.set("id", 1)
      m3.set({foo: "xyz"}, 1)
      m3.set("color", "blue")

      const m4 = new Map()
      m4.set("id", 2)
      m4.set({foo: "xyz"}, 2)
      m4.set("color", "blue")

      const yrel = new Set([m3, m4])

      console.log(join(xrel, yrel));
    });

    // it('should allow arbitrary join keys', function () {
    //   const m1 = new Map()
    //   m1.set("id", 1)
    //   m1.set({foo: "xyz"}, 1)
    //   m1.set("flavor", "spicy")
    //
    //   const m2 = new Map()
    //   m2.set("id", 2)
    //   m2.set({foo: "xyz"}, 2)
    //   m2.set("flavor", "sweet")
    //
    //   const xrel = new Set([m1, m2])
    //
    //   const m3 = new Map()
    //
    //   m3.set("the_id", 1)
    //   // m3.set({bar: "abc"}, 1)
    //   m3.set("color", "blue")
    //
    //   const m4 = new Map()
    //   m4.set("the_id", 2)
    //   // m4.set({bar: "abc"}, 2)
    //   m4.set("color", "blue")
    //
    //   const yrel = new Set([m3, m4])
    //
    //   const keyMap = new Map()
    //   keyMap.set("id", "the_id")
    //   keyMap.set({foo: "xyz"}, {bar: "abc"})
    //   console.log(join(xrel, yrel, keyMap));
    // });
  })
});
