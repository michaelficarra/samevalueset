// TODO: preserve insertion order for enumeration

function isMinusZero(x) {
  return Object.is(-0, x);
}

let call = Function.prototype.call.bind(Function.prototype.call);

export default class SameValueSet extends Set {
  constructor(iterable, ...rest) {
    super(iterable, ...rest);
    this.containsMinusZero = false;
  }

  add(value, ...rest) {
    if (isMinusZero(value)) {
      this.containsMinusZero = true;
    } else {
      super.add(value, ...rest);
    }
  }

  clear(...rest) {
    this.containsMinusZero = false;
    super.clear(...rest);
  }

  delete(value, ...rest) {
    if (isMinusZero(value)) {
      this.containsMinusZero = false;
    } else {
      super.delete(value, ...rest);
    }
  }

  entries(...rest) {
    if (this.containsMinusZero) {
      return [[-0, -0], ...super.entries(...rest)];
    }
    return super.entries(...rest);
  }

  forEach(callbackfn, thisArg, ...rest) {
    if (this.containsMinusZero) {
      call(callbackfn, thisArg, -0, -0, this);
    }
    super.forEach(callbackfn, thisArg, ...rest);
  }

  has(value) {
    if (isMinusZero(value)) {
      return this.containsMinusZero;
    }
    return super.has(value);
  }

  get size() {
    if (this.containsMinusZero) {
      return super.size + 1;
    }
    return super.size;
  }

  values() {
    if (this.containsMinusZero) {
      return [-0, ...super.values(...rest)];
    }
    return super.values(...rest);
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
