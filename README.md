# node-zookeeper-client-async
A promises wrapper over [https://github.com/alexguan/node-zookeeper-client](https://github.com/alexguan/node-zookeeper-client)

For the most part it has each method included in the original node-zookeeper-client, with
each method with a callback having an additional `Async` variant (e.g. `createAsync`).

The symantics are slightly different in that operations on nonexistant nodes typically do
not reject (i.e. return an error), but rather resolve `null`.

## Documentation
For more specific information see [the documentation](https://cilliemalan.github.io/node-zookeeper-client-async)


## Example
```javascript
const zk = require('node-zookeeper-client-async');


(async function main() {
    const client = zk.createAsyncClient("127.0.0.1:2181");

    // connect to the server
    await client.connectAsync();
    console.log('connected!');

    // create a node
    const rootPath = await client.mkdirpAsync('/test');
    console.log(`created ${rootPath}`)

    // add some ephemeral nodes
    await client.createAsync('/test/counter-', Buffer.from('first'), null, zk.CreateMode.EPHEMERAL_SEQUENTIAL);
    await client.createAsync('/test/counter-', Buffer.from('second'), null, zk.CreateMode.EPHEMERAL_SEQUENTIAL);

    // list the nodes
    const nodes = await client.getChildrenAsync('/test');

    // print stuff to console
    console.log(`${rootPath} has the children:`)
    await Promise.all(nodes.map(async node => {
        const data = await client.getDataAsync(`/test/${node}`);
        console.log(`  ${node}: ${data.data}`);
    }));

    // delete everything
    await client.rmrfAsync(rootPath);

    // shut down
    await client.closeAsync();
    console.log('disconnected');
})();
```

Console output:
```
~/node-zookeeper-client-async$ node example.js
connected!
created /test
/test has the children:
  counter-0000000000: first
  counter-0000000001: second
disconnected
```




