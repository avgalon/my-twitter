class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const user = {id, name, room, following: [], followers: []};
        this.users.push(user);
        return user;
    }


    removeUser(id) {
        const user = this.getUser(id);

        if(user){
            this.users = this.users.filter(user => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(room) {
        return this.users.filter((user) => user.room === room);
        /*const namesArr = users.map(user => user.name);
        return namesArr*/
    }

    followUser(followerUserId, followingUserId){
        const userToFollow = this.users.filter((user) => user.id === followingUserId)[0];
        userToFollow.followers.push(followerUserId);
        const FollowingUser = this.users.filter((user) => user.id === followerUserId)[0];
        FollowingUser.following.push(followingUserId);
    }

    unfollowUser(followerUserId, followingUserId){
        const userToFollow = this.users.filter((user) => user.id === followingUserId)[0];
        const followerIndex = userToFollow.followers.indexOf(followerUserId);
        userToFollow.followers.splice(followerIndex, 1);

        const FollowingUser = this.users.filter((user) => user.id === followerUserId)[0];
        const FollowingUserIndex = FollowingUser.following.indexOf(followingUserId);
        FollowingUser.following.splice(FollowingUserIndex, 1);
    }

    getUserFollowers(userId) {
        return this.users.filter((user) => user.id === userId)[0].followers;
    }

}

module.exports = { Users }