const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('Should return true', () => {
        const string = 'Alon';
        const result = isRealString(string);
        expect(result).toBe(true);
    })
    it('Should return false', () => {
        const string = '     ';
        const result = isRealString(string);
        expect(result).toBe(false);
    })
});
