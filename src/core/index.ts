import hash from 'object-hash'

export function maxKey(k: any, ...more: any[]) {
  if (more.length === 0) {
    return null
  }
  return more.reduce(function (accumulator, currentValue) {
    const v = k(currentValue)
    if (!accumulator.v) {
      accumulator.e = currentValue
      accumulator.v = v
    } else if (v > accumulator.v) {
      accumulator.e = currentValue
      accumulator.v = v

    }
    return accumulator
  }, {}).e
}

export function selectKeys(map:Map<any,any>, keyseq: any[]):Map<any,any> {
  const ret:Map<any,any> = new Map<any, any>()
  const hashMap:Map<any, any> = new Map<any,any>()
  for (let entry of map.entries()) {
    hashMap.set(hash(entry[0]), entry[1]);
  }
  for (let key of keyseq) {
    const hk = hash(key);
    if (hashMap.has(hk)) {
      ret.set(key, hashMap.get(hk))
    }
  }
  return ret
}
