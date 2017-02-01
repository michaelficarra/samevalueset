// TODO: create real SetIterator objects

function isMinusZero(x) {
  return Object.is(-0, x);
}

let call = Function.prototype.call.bind(Function.prototype.call);

export default class SameValueSet extends Set {
  constructor(iterable) {
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
        return true;
      }
      return false;
    }
    if (this.before.delete(value)) {
      return true;
    }
    if (!this.containsMinusZero) {
      return false;
    }
    return this.after.delete(value);
  }

  entries() {
    if (this.containsMinusZero) {
      return [...this.before.entries(), [-0, -0], ...this.after.entries()];
    }
    return [...this.before.entries(), ...this.after.entries()];
  }

  forEach(callbackfn, thisArg = void 0) {
    this.before.forEach(callbackfn, thisArg);
    if (this.containsMinusZero) {
      call(callbackfn, thisArg, -0, -0, this);
    }
    this.after.forEach(callbackfn, thisArg);
    return;
  }

  has(value) {
    if (isMinusZero(value)) {
      return this.containsMinusZero;
    }
    return this.before.has(value) || this.after.has(value);
  }

  get size() {
    return this.before.size + (this.containsMinusZero ? 1 : 0) + this.after.size;
  }

  values() {
    if (this.containsMinusZero) {
      return [...this.before.values(), -0, ...this.after.values()];
    }
    return [...this.before.values(), ...this.after.values()];
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
