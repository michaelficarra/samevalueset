const SetIteratorPrototype = Object.getPrototypeOf((new Set)[Symbol.iterator]());

function createSetIterator(iterable) {
  let iterator = iterable[Symbol.iterator]();
  return {
    __proto__: SetIteratorPrototype,
    next() {
      return iterator.next();
    },
  };
}

function isMinusZero(x) {
  return Object.is(-0, x);
}

const call = Function.prototype.call.bind(Function.prototype.call);

export default class SameValueSet extends Set {
  constructor(iterable = []) {
    super();
    this.before = new Set;
    this.after = new Set;
    this.containsMinusZero = false;
    for (let x of iterable) {
      this.add(x);
    }
  }

  add(value) {
    if (isMinusZero(value)) {
      this.containsMinusZero = true;
    } else if (this.containsMinusZero) {
      if (!this.before.has(value)) {
        this.after.add(value);
      }
    } else {
      this.before.add(value);
    }
    return this;
  }

  clear() {
    this.containsMinusZero = false;
    this.before.clear();
    this.after.clear();
    return;
  }

  delete(value) {
    if (isMinusZero(value)) {
      if (this.containsMinusZero) {
        this.containsMinusZero = false;
        for (let a of this.after) {
          this.before.add(a);
        }
        this.after.clear();
        return true;
      }
      return false;
    }
    if (this.before.delete(value)) {
      return true;
    }
    return this.after.delete(value);
  }

  entries() {
    return createSetIterator([
      ...this.before.entries(),
      ...(this.containsMinusZero ? [[-0, -0]] : []),
      ...this.after.entries(),
    ]);
  }

  forEach(callbackfn, thisArg = void 0) {
    for (let a of this.before) {
      call(callbackfn, thisArg, a, a, this);
    }
    if (this.containsMinusZero) {
      call(callbackfn, thisArg, -0, -0, this);
    }
    for (let a of this.after) {
      call(callbackfn, thisArg, a, a, this);
    }
    return;
  }

  has(value) {
    if (isMinusZero(value)) {
      return this.containsMinusZero;
    }
    return this.before.has(value) || this.after.has(value);
  }

  map(f, thisArg = void 0) {
    let out = new SameValueSet;
    for (let a of this) {
      out.add(call(f, thisArg, a, a, this));
    }
    return out;
  }

  get size() {
    return this.before.size + +this.containsMinusZero + this.after.size;
  }

  values() {
    return createSetIterator([
      ...this.before,
      ...(this.containsMinusZero ? [-0] : []),
      ...this.after,
    ]);
  }
}

let values = Object.getOwnPropertyDescriptor(SameValueSet.prototype, 'values');
Object.defineProperty(SameValueSet.prototype, 'keys', values);
Object.defineProperty(SameValueSet.prototype, Symbol.iterator, values);
Object.defineProperty(SameValueSet.prototype, Symbol.toStringTag, {
  value: 'SameValueSet',
  writable: false,
  enumerable: false,
  configurable: true,
});
