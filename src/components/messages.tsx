import React from 'react';
import {Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography} from "@mui/material";
import './messages.css';
import {extractFirstLetter} from "../utils/first-letter";
import {ThumbUp} from "@mui/icons-material";
import ListItemIcon from "@mui/material/ListItemIcon";

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
}

const Messages = (props: Props) => {
    return (
        <div className="messages">
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
                            <ListItemIcon>
                                <ThumbUp />
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
            </div>
        </div>
    )
}

export default Messages;