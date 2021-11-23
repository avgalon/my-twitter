var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('Should generate correct message object', () => {
        const from = 'Jen';
        const room = 'Node JS';
        const text = 'Some msg';
        const message = generateMessage(from, room, text);

        expect(typeof message.createdDate).toBe('number');
        expect(message).toMatchObject({from, text});
    })
});