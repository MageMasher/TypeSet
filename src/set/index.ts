import {maxKey, selectKeys} from "../core";
import hash from 'object-hash'

export function bubbleMaxKey(k: Function, coll: any[]) {
  let max = maxKey(k, ...coll)
  let withoutMax = coll.filter(e => e !== max)
  return [max, ...withoutMax]
}

export function union(...sets: Set<any>[]) {
  if (sets.length === 0) {
    return new Set()
  }
  if (sets.length === 1) {
    return sets[0]
  }

  if (sets.length === 2) {
    let s1: Set<any> = sets[0];
    let s2: Set<any> = sets[1];
    let _union: Set<any>
    if (s1.size < s2.size) {
      _union = new Set([...s2])
      for (let e of s1) {
        _union.add(e)
      }
    } else {
      _union = new Set(s1)
      for (let e of s2) {
        _union.add(e)
      }

    }
    return _union
  }

  return bubbleMaxKey((s: Set<any>) => s.size, sets).reduce((acc: Set<any>, curr: Set<any>) => {
    for (let entry of curr.values()) {
      acc.add(entry)
    }
    return acc
  }, new Set())

}

export function intersection(...sets: Set<any>[]): Set<any> {
  if (sets.length === 0) {
    return new Set()
  }
  if (sets.length === 1) {
    return sets[0]
  }
  if (sets.length === 2) {
    const s1 = sets[0];
    const s2 = sets[1];
    if (s2.size < s1.size) {
      return intersection(s2, s1)
    } else {
      return new Set([...s1].filter(x => s2.has(x)))
    }
  }
  return bubbleMaxKey((x: Set<any>) => 0 - x.size, sets)
    .reduce((s1: Set<any>, s2: Set<any>) => {
      return intersection(s1, s2)
    })
}

export function difference(...sets: Set<any>[]): Set<any> {
  if (sets.length === 0) {
    return new Set()
  }
  if (sets.length === 1) {
    return sets[0]
  }
  if (sets.length === 2) {
    const s1 = sets[0];
    const s2 = sets[1];
    return new Set([...s1].filter(x => !s2.has(x)))
  }
  return sets.reduce((s1: Set<any>, s2: Set<any>) => {
    return difference(s1, s2)
  })
}

export function select(pred: any, xset: Set<any>) {
  return new Set([...xset].filter(pred))
}

export function project(xrel: Set<Map<any, any>>, ks: any[]) {
  return new Set(Array.from(xrel.values()).map(x => selectKeys(x, ks)));
}

export function renameKeys(map: Map<any, any>, kmap: Map<any, any>) {
  const hashKeyMap = new Map()
  const entries = kmap.entries()
  const ret = Array.from(entries).reduce(
    function (m: Map<any, any>, curr) {
      let o = curr[0]
      let n = curr[1]
      if (map.has(o)) {
        m.set(n, map.get(o))
      }
      return m
    },
    map);
  return Array.from(kmap.keys()).reduce((acc: Map<any, any>, curr: any) => {
    acc.delete(curr)
    return acc
  }, ret)
}

export function rename(xrel: Set<Map<any, any>>, kmap: Map<any, any>): Set<Map<any, any>> {
  const ret: Set<Map<any, any>> = new Set();
  const retRel = Array.from(xrel).map(m => {
    return renameKeys(m, kmap)
  })
  for (let any of retRel) {
    ret.add(any)
  }
  return ret
}

export function index(xrel: Set<Map<any, any>>, ks: any[]) {
  const accWithIndexAndRegistry = {
    index: new Map<any, Set<Map<any, any>>>(),
    registry: new Map<any, any>()
  }

  const ret = Array.from(xrel).reduce(
    (acc: any,
     // Map<Map<any, any>, Set<Map<any, any>>>,
     curr: Map<any, any>) => {
      const ik = selectKeys(curr, ks)
      const ikHash = hash(ik)

      // always replace ikHash with latest ik
      acc.registry.set(ikHash, ik)


      let v: Set<Map<any, any>>
      const ikv = acc.index.get(ikHash)
      if (ikv) {
        v = ikv
      } else {
        v = new Set()
      }
      v.add(curr)
      acc.index.set(ikHash, v)
      return acc
    },
    accWithIndexAndRegistry)

  return renameKeys(ret.index, ret.registry)
}

export function mapInvert(m: Map<any, any>) {
  return Array.from(m.entries()).reduce(
    (m: Map<any, any>, e: any[]) => {
      m.set(e[1], e[0])
      return m
    }, new Map<any, any>()
  )
}

export function join(xrel: Set<Map<any, any>>, yrel: Set<Map<any, any>>
                     // , km: Map<any, any> = new Map<any, any>()
) {
  // TODO: uncomment when support for arbitrary Key Mapping is implemented
  // if (km.size === 0) {

    // Natural Join
    if (xrel.size !== 0 && yrel.size !== 0) {
      const xrelKeys = Array.from(Array.from(xrel.values())[0].keys());
      const yrelKeys = Array.from(Array.from(yrel.values())[0].keys());

      const xrelKeyHashes = Array.from(xrelKeys).map(k => hash(k))
      const yrelKeyHashes = Array.from(yrelKeys).map(k => hash(k))

      const hashIndex = new Map()
      for (let xrelKey of xrelKeys) {
        hashIndex.set(hash(xrelKey), xrelKey)
      }
      for (let yrelKey of yrelKeys) {
        hashIndex.set(hash(yrelKey), yrelKey)
      }

      const ks = intersection(new Set([...xrelKeyHashes]), new Set([...yrelKeyHashes]))
      const ksArray = Array.from(ks).map(k => hashIndex.get(k))
      let r, s
      if (xrel.size <= yrel.size) {
        r = xrel
        s = yrel
      } else {
        r = yrel
        s = xrel
      }
      const idx: Map<Map<any, any>, Set<Map<any, any>>> = index(r, ksArray);
      const idxHash = new Map<any, any>()
      for (let e of Array.from(idx.entries())) {
        idxHash.set(hash(e[0]), e[1])
      }

      return Array.from(s).reduce((ret, x) => {
          const ik = selectKeys(x, ksArray)
          const ikHash = hash(ik)
          const has = idxHash.has(ikHash)
          const found: Set<Map<any, any>> = idxHash.get(ikHash)
          if (has) {
            return Array.from(found).reduce((acc, curr) => {
              const newRet = new Map();
              for (let currElement of curr) {
                newRet.set(hash(currElement[0]), [currElement[1]])
              }
              for (let xKey of x) {
                newRet.set(hash(xKey[0]), xKey[1])
              }

              ret.add(renameKeys(newRet, hashIndex))
              return ret
            }, ret)
          } else {
            return ret
          }
        }
        , new Set<Map<any, any>>()
      )

    } else {
      return new Set<Map<any, any>>()
    }
  // } else { // Arbitrary Key Mapping

  //   let r, s, k: Map<any, any>
  //   if (xrel.size <= yrel.size) {
  //     r = xrel
  //     s = yrel
  //     k = mapInvert(km)
  //   } else {
  //     r = yrel
  //     s = xrel
  //     k = km
  //   }
  //
  //   const ksArray = Array.from(Array.from(k).values());
  //   const idx = index(r, ksArray)
  //   const idxHash = new Map<any, any>()
  //   for (let e of Array.from(Array.from(xrel.values())[0].entries())) {
  //     idxHash.set(hash(e[0]), e[1])
  //   }
  //   //
  //   const relKeys = Array.from(k.values());
  //   const hashIndex = new Map()
  //   for (let relKey of relKeys) {
  //     hashIndex.set(hash(relKey), relKey)
  //   }
  //   //
  //   // const ksArray = Array.from(k.values());
  //   // const idx = index(r, ksArray);
  //   // const idxHash = new Map<any, any>()
  //   // for (let e of Array.from(idx.entries())) {
  //   //   idxHash.set(hash(e[0]), e[1])
  //   // }
  //
  //
  //   return Array.from(s).reduce((ret, x) => {
  //       const ik = renameKeys(selectKeys(x, Array.from(k.keys())), k);
  //       const ikHash = hash(ik)
  //       const has = idxHash.has(ikHash)
  //       const found: Set<Map<any, any>> = idxHash.get(ikHash);
  //       if (has) {
  //         return Array.from(found).reduce((acc, curr) => {
  //           const newRet = new Map();
  //           for (let currElement of curr) {
  //             newRet.set(hash(currElement[0]), [currElement[1]])
  //           }
  //           for (let xKey of x) {
  //             newRet.set(hash(xKey[0]), xKey[1])
  //           }
  //
  //           ret.add(renameKeys(newRet, hashIndex))
  //           return ret
  //         }, ret)
  //       } else {
  //         return ret
  //       }
  //     }
  //     , new Set<Map<any, any>>()
  //   )
  //
  // }
}

function isSubset() {

}

function isSuperset() {

}
