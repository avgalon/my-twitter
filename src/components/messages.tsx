import React from 'react';
import {Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import './messages.css';
import {extractFirstLetter} from "../utils/first-letter";
import {ThumbUp} from "@mui/icons-material";
import ListItemIcon from "@mui/material/ListItemIcon";
import {User} from "./onlineUsers";

export interface Message {
    id: number;
    url?: string;
    from: string;
    text: string;
    room: string;
    createdDate: string;
    likes: string [];
}

interface Props {
    messages: Message[];
    room: string;
    currentUser: User | undefined;
    likeMessage: (message: Message) => void;
}

const Messages = (props: Props) => {

    return (
        <div className="messages light-scroll">
            <div id="list">
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {props.messages.filter((message: Message) => message.room === props.room).map((message: Message, index: number) => (
                        <ListItem alignItems="flex-start" key={message.id}>
                            <ListItemAvatar>
                                <Avatar alt="Remy Sharp">{extractFirstLetter(message.from)}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={message.createdDate}
                                secondary={
                                    <React.Fragment>
                                        <Typography sx={{display: 'inline'}}>
                                            {message.from}: &nbsp;
                                        </Typography>
                                        {message.text}
                                    </React.Fragment>
                                }
                            />
                            {message.from !== props!.currentUser!.name && <ListItemIcon>
                                <ThumbUp onClick={() => props.likeMessage(message)}/>
                            </ListItemIcon>}
                            <ListItemText primary={
                                <React.Fragment>
                                    <Typography sx={{display: 'inline', lineHeight: '50px'}} />
                                    ({message.likes.length})
                                </React.Fragment>
                            }/>
                        </ListItem>
                    ))}
                </List>
            </div>
        </div>
    )
}

export default Messages;