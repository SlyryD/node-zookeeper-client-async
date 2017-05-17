const assert = require('chai').assert;
const zk = require('../');

describe('The AsyncClient', function () {

    let client = zk.createAsyncClient('127.0.0.1:2181');

    before(async function () {
        await client.connectAsync();
        await client.createAsync('/test');
    });

    it('should be able to retrieve node data if there is data', async function () {
        // arrange
        let path = `/test/test-${parseInt(Math.random() * 10000)}`;
        await client.createAsync(path, Buffer.from('hello'));

        // act
        var data = await client.getDataAsync(path);

        // assert
        assert.isObject(data);
        assert.isObject(data.stat);
        assert.instanceOf(data.data, Buffer);
        assert.equal(data.data.toString('utf8'), "hello");
    });

    it('should be able to retrieve null data if there is no data', async function () {
        // arrange
        let path = `/test/test-${parseInt(Math.random() * 10000)}`;
        await client.createAsync(path);

        // act
        var data = await client.getDataAsync(path);

        // assert
        assert.isObject(data);
        assert.isObject(data.stat);
        assert.isNotOk(data.data);
    });

    it('should be able to retrieve null if there is no node', async function () {
        // arrange
        let path = `/test/test-${parseInt(Math.random() * 10000)}`;

        // act
        var data = await client.getDataAsync(path);

        // assert
        assert.isNotOk(data);
    });

    after(async function () {
        await client.rmrfAsync('/test');
        await client.closeAsync();
    });
});
