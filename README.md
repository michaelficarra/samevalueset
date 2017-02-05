SameValue Set
=============


## About

ECMAScript [sets](https://tc39.github.io/ecma262/#sec-set-objects)
(objects created with the [Set constructor](https://tc39.github.io/ecma262/#sec-set-constructor))
use an algorithm called [SameValueZero](https://tc39.github.io/ecma262/#sec-samevaluezero)
to compare elements when eliminating duplicate entries. SameValueZero does not equate any distinguishable
ECMAScript values except two: `0` and `-0`. This choice of algorithm is problematic because it prevents
us from implementing a sensible `map` operation. It is generally agreed upon that any `map` function
should obey the identity and composition laws. However, we can construct a case where the composition law
is violated:

```js
let set = new Set([0, 1]),
  f = x => 1 / x,
  g = x => x ? -0 : x;

// a simple map implementation
Set.prototype.map = f => {
  let out = new Set;
  for (let a of this) out.add(f(a));
  return out;
}

// positive and negative zero are equated under SameValueZero, so one is eliminated
set.map(g); // Set { 0 }

// a lawful map implementation requires the following two lines to be interchangeable
set.map(g).map(f); // Set { 1/0 }
set.map(x => f(g(x))); // Set { 1/0, -1/0 }
```

SameValue sets use [SameValue](https://tc39.github.io/ecma262/#sec-samevalue) as the comparison algorithm
for elimination. The SameValue algorithm does not equate *any* distinguishable ECMAScript values.

```js
let set = new SameValueSet([0, 1]),
  f = x => 1 / x,
  g = x => x ? -0 : x;

// positive and negative zero are not equated under SameValue, so neither is eliminated
set.map(g); // SameValueSet { 0, -0 }

// for SameValueSet, the following two lines are interchangeable
set.map(g).map(f); // SameValueSet { 1/0, -1/0 }
set.map(x => f(g(x))); // SameValueSet { 1/0, -1/0 }
```


## Installation

```sh
npm install samevalueset
```


## Usage

```js
import SameValueSet from "samevalueset";
let emptySet = new SameValueSet;
let set = new SameValueSet(anythingIterable);
```

SameValue sets inherit from `Set`, so everything on `Set.prototype` is available.
Additionally, `SameValueSet.prototype.map` produces a new SameValue set with the given
function applied to every element in the target SameValue set.


## Contributing

* Open a GitHub issue with a description of your desired change. If one exists already, leave a message stating that you are working on it.
* Fork this repo and clone the forked repo.
* Install dependencies with `npm install`.
* Build and test in your environment with `npm run build && npm test`.
* Create a feature branch. Make your changes. Add tests.
* Build and test in your environment with `npm run build && npm test`.
* Make a commit that includes the text "fixes #*XX*" where *XX* is the GitHub issue.
* Open a Pull Request on GitHub.


## License

3-clause BSD. See [LICENSE](./LICENSE).
