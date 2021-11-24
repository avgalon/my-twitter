class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        const user = {id, name, room, following: [], followers: []};
        this.users.push(user);
        return user;
    }

    removeUserByName(name) {
        const user = this.getUserByName(name);

        if(user){
            this.users = this.users.filter(user => user.name !== name);
        }

        return user;
    }

    getUserByName(name) {
        return this.users.filter((user) => user.name === name)[0];
    }

    removeUserById(id) {
        const user = this.getUserById(id);

        if(user){
            this.users = this.users.filter(user => user.id !== id);
        }

        return user;
    }

    getUserById(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(room) {
        return this.users.filter((user) => user.room === room);
    }

    followUser(followerUserId, followingUserId){
        const userToFollow = this.users.find((user) => user.id === followingUserId);
        if (userToFollow.followers.find(follower => follower === followerUserId) === undefined) {
            userToFollow.followers.push(followerUserId);
            const FollowingUser = this.users.find((user) => user.id === followerUserId);
            FollowingUser.following.push(followingUserId);
        }
    }

    unfollowUser(followerUserId, followingUserId){
        const userToUnfollow = this.users.find((user) => user.id === followingUserId);
        const unfollowerIndex = userToUnfollow.followers.indexOf(followerUserId);

        if (unfollowerIndex >= 0) {
            userToUnfollow.followers.splice(unfollowerIndex, 1);

            const FollowingUser = this.users.find((user) => user.id === followerUserId);
            const FollowingUserIndex = FollowingUser.following.indexOf(followingUserId);
            FollowingUser.following.splice(FollowingUserIndex, 1);
        }
    }
}

module.exports = { Users }