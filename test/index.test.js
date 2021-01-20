const {getResult} = require('../index');
const assert = require('assert');

describe("index.js test", () => {

    it('test getResult logic', () => {
        const clicks = [{ "ip":"22.22.22.22", "timestamp":"3/11/2016 02:02:58", "amount": 7.00 },
        { "ip":"11.11.11.11", "timestamp":"3/11/2016 02:12:32", "amount": 6.50 },
        { "ip":"11.11.11.11", "timestamp":"3/11/2016 02:13:11", "amount": 7.25 },
        { "ip":"44.44.44.44", "timestamp":"3/11/2016 02:13:54", "amount": 8.75 },];
        const result = [{ "ip":"44.44.44.44", "timestamp":"3/11/2016 02:13:54", "amount": 8.75 }];
        assert.equal(getResult(clicks), JSON.stringify(result));
    });

});
