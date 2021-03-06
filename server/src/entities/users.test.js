const {Users} = require('./users');

describe('Users', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Alon',
            room: 'General'
        },
        {
            id: '2',
            name: 'Harel',
            room: 'General'
        },
        {
            id: '3',
            name: 'Lior',
            room: 'General'
        }]
    });

    it('Should add new user', () => {
        const users = new Users();
        const newUser = {
            id: '123',
            name: 'Joe',
            room: 'General'
        }
        const resUser = users.addUser(newUser.id, newUser.name, newUser.room);
        expect(users.getUserList(newUser.room).findIndex(user => user.id === newUser.id)).toEqual(users.users.length - 1);
    });

    it('Should return names in General', () => {
        const userList = users.getUserList('General').map(user => user.name);
        expect(userList).toEqual(['Alon', 'Harel', 'Lior']);
    });

    it('Should find user', () => {
        const userID = '2';
        const user = users.getUserById(userID);
        expect(user.id).toBe(userID);
    });

    it('Should remove user', () => {
        const userID = '1';
        const user = users.removeUserById(userID);
        expect(user.id).toBe(userID);
        expect(users.users.length).toBe(2);
    });

});