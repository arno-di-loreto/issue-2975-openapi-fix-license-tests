
This repository holds a demonstration of the problem described in [Issue #2975 (The mutually-exclusive url and identifier properties of License object are optional in specification and required in schema)](https://github.com/OAI/OpenAPI-Specification/issues/2975) and proposes various solutions.

Everything is done with a test suite looping on all `*schema.yaml` file in `schemas`, the first one being the original schema of the OpenAPI Specification.
It checks that all documents in `samples/valid` and `sampled/invalid` are respectively valid and invalid according to the selected schema.
The code is an adaptation of the `test.js` script of the OpenAPI Specification github repository.

# Installation

```
npm install
```

# Run

```
npm run test
```
