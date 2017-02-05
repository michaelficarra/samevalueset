import * as assert from 'assert';
import SameValueSet from '../';

describe('unit tests', () => {
  describe('constructor', () => {
    it('supports zero arguments', () => {
      let set = new SameValueSet;
      assert.deepStrictEqual([], Array.from(set));
    });

    it('supports basic iterable', () => {
      let values = [0, 1, 2, 3];
      let set = new SameValueSet(values);
      assert.deepStrictEqual(values, Array.from(set));
    });

    it('supports -0', () => {
      let values = [-3, -2, -1, -0, 1, 2, 3];
      let set = new SameValueSet(values);
      assert.deepStrictEqual(values, Array.from(set));
    });

    it('supports positive and -0', () => {
      let values = [-3, -2, -1, 0, -0, 1, 2, 3];
      let set = new SameValueSet(values);
      assert.deepStrictEqual(values, Array.from(set));
    });

    it('supports negative and positive zero', () => {
      let values = [-3, -2, -1, -0, 0, 1, 2, 3];
      let set = new SameValueSet(values);
      assert.deepStrictEqual(values, Array.from(set));
    });

    it('supports duplicates', () => {
      let set = new SameValueSet([2, 2, 1, -0, 0, 1, 2, 2]);
      assert.deepStrictEqual([2, 1, -0, 0], Array.from(set));
    });
  });

  describe('clear', () => {
    it('clears everything', () => {
      let set = new SameValueSet([-3, -2, -1, 0, -0, 1, 2, 3]);
      assert.equal(void 0, set.clear());
      assert.deepStrictEqual([], Array.from(set));
    });
  });

  describe('delete', () => {
    it('supports basic sets', () => {
      let set = new SameValueSet([0, 1, 2, 3]);
      assert.equal(false, set.delete(4));
      assert.deepStrictEqual([0, 1, 2, 3], Array.from(set));
      assert.equal(true, set.delete(1));
      assert.deepStrictEqual([0, 2, 3], Array.from(set));
    });

    it('supports -0', () => {
      let set = new SameValueSet([-3, -2, -1, -0, 1, 2, 3]);
      assert.equal(false, set.delete(0));
      assert.deepStrictEqual([-3, -2, -1, -0, 1, 2, 3], Array.from(set));
      assert.equal(true, set.delete(-0));
      assert.deepStrictEqual([-3, -2, -1, 1, 2, 3], Array.from(set));
      assert.equal(false, set.delete(-0));
      assert.deepStrictEqual([-3, -2, -1, 1, 2, 3], Array.from(set));
    });

    it('supports positive and -0', () => {
      let set = new SameValueSet([-3, -2, -1, 0, -0, 1, 2, 3]);
      assert.equal(true, set.delete(0));
      assert.deepStrictEqual([-3, -2, -1, -0, 1, 2, 3], Array.from(set));
      assert.equal(false, set.delete(0));
      assert.deepStrictEqual([-3, -2, -1, -0, 1, 2, 3], Array.from(set));
      assert.equal(true, set.delete(-0));
      assert.deepStrictEqual([-3, -2, -1, 1, 2, 3], Array.from(set));
    });

    it('supports negative and positive zero', () => {
      let set = new SameValueSet([-3, -2, -1, -0, 0, 1, 2, 3]);
      assert.equal(true, set.delete(-0));
      assert.deepStrictEqual([-3, -2, -1, 0, 1, 2, 3], Array.from(set));
      assert.equal(true, set.delete(0));
      assert.deepStrictEqual([-3, -2, -1, 1, 2, 3], Array.from(set));
    });
  });

  describe('entries', () => {
    it('supports basic sets', () => {
      let set = new SameValueSet([0, 1, 2]);
      assert.deepStrictEqual([[0, 0], [1, 1], [2, 2]], Array.from(set.entries()));
    });

    it('supports -0', () => {
      let set = new SameValueSet([-2, -1, -0, 0, 1, 2]);
      assert.deepStrictEqual([[-2, -2], [-1, -1], [-0, -0], [0, 0], [1, 1], [2, 2]], Array.from(set.entries()));
    });
  });

  describe('forEach', () => {
    it('supports basic sets', () => {
      let n = 0;
      let set = new SameValueSet([0, 1, 2, 3]);
      set.forEach((a, b, c) => {
        assert.equal(a, n);
        assert.equal(b, a);
        assert.equal(c, set);
        ++n;
      });
      assert.equal(n, 4);
    });

    it('passes appropriate this value', () => {
      let n = 0, sentinel = {};
      let set = new SameValueSet([0]);
      set.forEach(function () {
        assert.equal(this, sentinel);
        ++n;
      }, sentinel);
      assert.equal(n, 1);
    });

    it('supports -0', () => {
      let n = 0;
      let values = [-2, -1, -0, 0, 1, 2];
      let set = new SameValueSet(values);
      set.forEach((a, b, c) => {
        assert.equal(a, values[n]);
        assert.equal(b, a);
        assert.equal(c, set);
        ++n;
      });
      assert.equal(n, 6);
    });
  });

  describe('has', () => {
    it('supports basic sets', () => {
      let set = new SameValueSet([0, 1, 2]);
      assert.equal(false, set.has(-1));
      assert.equal(true, set.has(0));
      assert.equal(true, set.has(1));
      assert.equal(true, set.has(2));
      assert.equal(false, set.has(3));
      assert.equal(false, set.has(-0));
    });

    it('works in presence of -0', () => {
      let set = new SameValueSet([-2, -1, -0, 1, 2]);
      assert.equal(false, set.has(-3));
      assert.equal(true, set.has(-2));
      assert.equal(true, set.has(-1));
      assert.equal(false, set.has(0));
      assert.equal(true, set.has(1));
      assert.equal(true, set.has(2));
      assert.equal(false, set.has(3));
    });

    it('supports -0', () => {
      let set = new SameValueSet([-2, -1, -0, 1, 2]);
      assert.equal(true, set.has(-0));
    });
  });

  describe('map', () => {
    it('supports id', () => {
      let values = [-2, -1, -0, 0, 1, 2];
      let set = new SameValueSet(values);
      assert.deepStrictEqual(values, Array.from(set.map(x => x)));
    });

    it('applies the function', () => {
      let values = [-2, -1, -0, 0, 1, 2];
      let set = new SameValueSet(values);
      let succ = x => x + 1;
      assert.deepStrictEqual(
        Array.from(new SameValueSet(values.map(succ))),
        Array.from(set.map(succ))
      );
    });

    it('preserves composition', () => {
      let values = [-2, -1, -0, 0, 1, 2];
      let set = new SameValueSet(values);
      let f = x => 1 / x;
      let g = x => x ? -0 : x;
      assert.deepStrictEqual(
        Array.from(set.map(g).map(f)),
        Array.from(set.map(x => f(g(x))))
      );
    });

    it('passes appropriate this value', () => {
      let n = 0, sentinel = {};
      let set = new SameValueSet([0]);
      set.map(function () {
        assert.equal(this, sentinel);
        ++n;
      }, sentinel);
      assert.equal(n, 1);
    });
  });

  describe('size', () => {
    it('supports empty sets', () => {
      let set = new SameValueSet();
      assert.equal(0, set.size);
    });

    it('supports basic sets', () => {
      let set = new SameValueSet([0, 1, 2]);
      assert.equal(3, set.size);
    });

    it('supports -0', () => {
      let set = new SameValueSet([3, 1, -0, 2, 4]);
      assert.equal(5, set.size);
    });
  });

  describe('aliases', () => {
    it('aliases values as keys', () => {
      assert.equal(SameValueSet.prototype.keys, SameValueSet.prototype.values);
    });

    it('aliases values as Symbol.iterator', () => {
      assert.equal(SameValueSet.prototype[Symbol.iterator], SameValueSet.prototype.values);
    });
  });

  describe('inheritance', () => {
    it('inherits from Set', () => {
      assert.ok(new SameValueSet instanceof Set);
    });

    it('produces real SetIterator objects', () => {
      let SetIteratorPrototype = Object.getPrototypeOf((new Set)[Symbol.iterator]());
      assert.equal(Object.getPrototypeOf((new SameValueSet)[Symbol.iterator]()), SetIteratorPrototype);
    });
  });
});
