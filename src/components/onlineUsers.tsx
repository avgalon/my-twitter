import {Avatar, Button, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import React from "react";
import avatar from '../assets/avatar.png'
import ListItemIcon from '@mui/material/ListItemIcon';
import {FollowTheSigns} from "@mui/icons-material";

export interface User {
    name: string;
    id: string;
    room: string;
    following: string[];
    followers: string[];
}

interface Props {
    users: User [];
    currentUserName: string
}

const OnlineUsers = (props: Props) => {

    const followUser = (userToFollow: string) => {
        const currentUser = props.users.find(user => user.name === props.currentUserName);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser!.id, follow: userToFollow })
        };
        fetch('http://localhost:8080/follow', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }

    const unfollowUser = (userToFollow: string) => {
        const currentUser = props.users.find(user => user.name === props.currentUserName);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser!.id, unfollow: userToFollow })
        };
        fetch('http://localhost:8080/unfollow', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }

    return (
        <div className="activeUsers">
            <div id="users">
                <List sx={{ width: '95%', bgcolor: 'background.paper' }}>
                    {props.users.map((user: User, index: number) => (
                        <ListItem alignItems="flex-start" key={user.id}>
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src={avatar}/>
                            </ListItemAvatar>
                            <ListItemText primary={
                                <React.Fragment>
                                    <Typography sx={{display: 'inline', lineHeight: '50px'}} />
                                    {user.name}
                                </React.Fragment>
                            }/>
                            {props.currentUserName !== user.name && <ListItemIcon>
                                <Button
                                    onClick={() => user.followers.length === 0 ? followUser(user.id) : unfollowUser(user.id)}
                                    variant="contained">
                                    {user.followers.length === 0 ? 'Follow' : 'Unfollow'}
                                </Button>
                            </ListItemIcon>}
                            <ListItemText primary={
                                <React.Fragment>
                                    <Typography sx={{display: 'inline', lineHeight: '50px'}} />
                                    ({user.followers.length})
                                </React.Fragment>
                            }/>
                        </ListItem>))}
                        </List>
            </div>

        </div>
    )
}

export default OnlineUsers;