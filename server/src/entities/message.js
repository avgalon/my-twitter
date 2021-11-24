const moment = require('moment');

const generateMessage = (from, room, text) => {
    return {
        from,
        room,
        text,
        createdDate: moment().valueOf()
    }
};
module.exports = {generateMessage};