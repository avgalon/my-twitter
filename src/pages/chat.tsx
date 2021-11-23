import React, {ChangeEvent, FormEvent, SyntheticEvent, useCallback, useEffect, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import io, {Socket} from 'socket.io-client';
import OnlineUsers, {User} from '../components/onlineUsers';
import Messages, {Message} from '../components/messages';
import moment from 'moment';
import {useParams} from "react-router";
import SendIcon from '@mui/icons-material/Send';
import {Box, Tab, Tabs, TextField} from "@mui/material";

import TabPanel from '../components/tab-panel';

import "../assets/scroll.css";
import "./chat.css";


const Chat = () => {
    const serverURL = 'http://localhost:8080';
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [correntTab, setCorrentTab] = React.useState(0);

    const handleChange = (event: SyntheticEvent<Element, Event>, newValue: any) => {
        setCorrentTab(newValue);
    };
    let history = useNavigate();
    let params = useParams();

    const socketRef = useRef<Socket>(null);

    const handleSocket = useCallback(() => {
        // @ts-ignore
        socketRef.current = io(serverURL);
    }, [])

    useEffect(() => {
        handleSocket();
        const socket = socketRef.current;
        window.addEventListener("beforeunload", onPageUnload);

        return () => {
            window.removeEventListener("beforeunload", onPageUnload);
            const param = {
                room: params.room
            }
            socket!.emit('leave', param);
            setUsers([]);
            setMessages([]);
            setNewMsg('');
        };
    }, [handleSocket, params.room])

    useEffect(() => {
        const socket = socketRef.current;

        socket!.emit('join', params, function (err: any) {
            if (err) {
                history('/');
            }
        });

        socket!.on('updateUserList', (users) => {
            setUsers(users);
        });

        socket!.on('newMessage', (message: Message) => {
            const formattedTime = moment(message.createdDate).format('h:mm a');

            let newMsg: Message = {
                text: message.text,
                from: message.from,
                room: message.room,
                createdDate: formattedTime,
                id: Date.now() + Math.random(),
                likes: []
            }
            // @ts-ignore
            setMessages((messages) => [newMsg, ...messages]);
        });

        socket!.on('disconnect', () => {
            history('/');
            console.log('Connection lost from server.');
        });
    },[]);

    const onPageUnload = (event: BeforeUnloadEvent) => {
        const socket = socketRef.current;
        event.preventDefault();
        socket!.emit('leave', { room: params.room });
        event.returnValue = '';
    }

        const clearForm = () => {
            setNewMsg('');
        }

        const newMessageTextChange = (event: ChangeEvent<HTMLElement>) => {
            setNewMsg((event.target as HTMLInputElement).value);
        }

        const newMessage = (e: FormEvent) => {
            const socket = socketRef.current;
            e.preventDefault()
            const obj = {
                text: newMsg
            };
            socket!.emit('createMessage', obj, function (data: any) { });
            clearForm();
        }

        const getCurrentUser = (): User | undefined => {
            return users.find((user: User) => user.name === params.name as string);
        }

    const likeMessage = (message: Message) => {
        if(message.likes.findIndex(like => like === params.name as string) < 0) {
            const newMessages = messages.map((msg: Message) => {
                if (msg.id !== message.id) {
                    return msg;
                }
                return {...msg, likes: [...msg.likes, params.name]}
            });
            // @ts-ignore
            setMessages(newMessages)
        }
    }

    const getIdsAsProps = (index: number) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    const getMyFeeds = () => {
        return messages.filter((message: Message) => message.from === params.name as string).sort((messageA: Message, messageB: Message) => messageB.likes.length - messageA.likes.length);
    }

    return (
            <div className="layout">
                <div className="feed">
                    <form className="newMsgForm">
                        <TextField
                            required
                            id="outlined-required"
                            label="Type your message"
                            autoComplete="off"
                            name="newMsg"
                            value={newMsg}
                            onChange={(event) => newMessageTextChange(event)}
                            className="join-name"
                        />
                        <button className="newmsg-btn" onClick={(e) => newMessage(e)}>
                            <SendIcon/>
                        </button>
                    </form>
                    <Messages messages={messages} currentUser={getCurrentUser()} room={params.room as string} likeMessage={likeMessage} />
                </div>
                <div className="users">
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={correntTab} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Online Users" {...getIdsAsProps(0)} />
                            <Tab label="My Feeds" {...getIdsAsProps(1)} />
                            <Tab label="All Feeds" {...getIdsAsProps(2)} />
                        </Tabs>
                    </Box>
                    <div className="tabs-content-wrapper light-scroll">
                        <TabPanel value={correntTab} index={0}>
                            <OnlineUsers users={users} currentUserName={params.name as string}/>
                        </TabPanel>
                        <TabPanel value={correntTab} index={1}>
                            <Messages messages={getMyFeeds()} currentUser={getCurrentUser()} room={params.room as string} likeMessage={likeMessage} />
                        </TabPanel>
                        <TabPanel value={correntTab} index={2}>
                            <Messages messages={messages} currentUser={getCurrentUser()} room={params.room as string} likeMessage={likeMessage} />
                        </TabPanel>
                    </div>
                </div>
            </div>
        )
}
export default Chat