# cardano_api

The project is created on purpose to try automate API testing

## Tests

To run tests install the environment `nvm use` and run one of commands `npm run test-preprod` or `npm run test-preview`.

It will run **all tests** on the selected network.

### Runnig a single test

if you want to run a single test it is necessary to use the commands `npm run test-preprod-run-one` or `npm run test-preview-run-one` with adding a test name.

Example:

We have tests like this:

```javascript
describe('test suite', ()=>{
  it('test 1', () =>{
    console.log('test 1');
  });
  it('test 2', () =>{
    console.log('test 2');
  });
  it('test 3', () =>{
    console.log('test 3');
  });
});
```

To run the test "test 2" on the preprod network you need to use the command:

```shell
npm run test-preprod-run-one "test 2"
```

or for the preview network it will be like this:

```shell
npm run test-preview-run-one "test 2"
```
