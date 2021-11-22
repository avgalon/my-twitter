import React, {ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io, {Socket} from 'socket.io-client';
import OnlineUsers, {User} from '../components/onlineUsers';
import Messages, {Message} from '../components/messages';
import moment from 'moment';
import {useParams} from "react-router";
import SendIcon from '@mui/icons-material/Send';
import {ArrowBackIos} from "@mui/icons-material";
import {Box, Button, Drawer, Tab, Tabs, TextField} from "@mui/material";

import "./chat.css";

const Chat = () => {
    const serverURL = 'http://localhost:8080';
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    const [menuOpen, setMenuOpen] = useState(true);
    const [correntTab, setCorrentTab] = React.useState(0);

    const handleChange = (event: ChangeEvent<HTMLElement>, newValue: number) => {
        setCorrentTab(newValue);
    };
    let history = useNavigate();
    let params = useParams();

    const socketRef = useRef<Socket>(null);

    const handleSocket = useCallback(() => {
        // @ts-ignore
        socketRef.current = io(serverURL);
    }, [])

  /*  // @ts-ignore
    useEffect(() => {
        const newSocket: Socket = io(serveURL);
        // @ts-ignore
        setSocket(newSocket);
        return () => newSocket.close();
    }, [setSocket]);*/

    useEffect(() => {
        handleSocket();
        const socket = socketRef.current;
        return () => {
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
            console.log('messages');
            const formattedTime = moment(message.createdDate).format('h:mm a');

            let newMsg: Message = {
                text: message.text,
                from: message.from,
                room: message.room,
                createdDate: formattedTime,
                id: new Date().getUTCMilliseconds(),
                likes: []
            }
            //let results: Message[] = [...messages, newMsg];
            //results.push(newMsg);
            // @ts-ignore
            setMessages((messages) => [...messages, newMsg]);

            const msgArr = (messages as Message[]).filter(message => message.room === params.room);
            if (msgArr.length > 3) {
                // scrollToBottom();
            }
        });

        socket!.on('disconnect', () => {
            history('/');
            console.log('Connection lost from server.');
        });
    },[]);

        const scrollToBottom = () => {
            // selectors
            const listHeight = document.querySelector<HTMLElement>('.messages #list ul');
            const messagesList = document.querySelector<HTMLElement>('.messages #list');
            const newMessage = document.querySelector<HTMLElement>('.messages #list ul li:last-child');
            // heights
            const messagesWrapperHeight = listHeight!.clientHeight;
            const clientHeight = messagesList!.clientHeight;
            const scrollTop = messagesList!.scrollTop;
            const scrollHeight = messagesList!.scrollHeight;
            const newMessageHeight = newMessage!.offsetHeight;
            const lastMessageHeight = (newMessage!.previousSibling as HTMLElement)!.offsetHeight;

            if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
                document!.querySelector('#list')!.scrollTo(0, messagesWrapperHeight)
            }

        }

        const clearForm = () => {
            setNewMsg('');
        }
        const inputUpdate = (event: ChangeEvent<HTMLElement>) => {
            const name = (event.target as HTMLInputElement).name;
            const value = (event.target as HTMLInputElement).value;
            switch (name){
                case 'newMsg':
                    setNewMsg(value);
                    break;
                default:
                    throw `Unhandled input ${name}`;
            }
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

        const getCurrentUserId = (): string => {
            const currentUser = users.find((user: User) => user.name === params.name as string);
            return currentUser ? (currentUser as User).id : '';
        }

    const toggleDrawer = (open?: boolean) => (event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent<HTMLElement>).key === 'Tab' || (event as React.KeyboardEvent<HTMLElement>).key === 'Shift')) {
            return;
        }

        setMenuOpen(open === undefined ? !menuOpen : open);
    };

    const likeMessage = (messageId: number) => {
        const newMessages = messages.map((message: Message) => {
            if (message.id !== messageId){
                return message;
            }
            return {...message, likes: [...message.likes, params.name]}
        });
        // @ts-ignore
        setMessages(newMessages)
        //messageToBLiked!.likes.push(props.currentUserId);
    }

    const a11yProps = (index: number) => {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

        return (
            <div className="layout">
                <div className="menu">
                    <Button onClick={toggleDrawer()}>{'menu'}</Button>
                    <Drawer
                        anchor={'left'}
                        open={menuOpen}
                        onClose={toggleDrawer(false)}
                        hideBackdrop={true}
                    >
                        <div className="menu-content">
                            <ul>
                                <li>
                            <Link to={`chat/${params.name as string}/General`}>
                                Main Page
                            </Link>
                                </li>
                            <li>
                            <Link to={`/feeds/${params.name as string}`}>
                                Personal Feed
                            </Link>
                            </li>
                            <li>
                            <Link to={`/feeds/${params.name as string}`}>
                                Global Feed
                            </Link>
                            </li>
                            <li>
                            <Link to="/">
                                Go back to join
                            </Link>
                            </li>
                            <li>
                            <label onClick={toggleDrawer()}>
                                <ArrowBackIos></ArrowBackIos> Close menu
                            </label>
                            </li>
                            </ul>
                        </div>
                    </Drawer>

                </div>
                <div className="feed">
                    <form  className="newMsgForm">
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
                    <Messages messages={messages} currentUserId={getCurrentUserId()} room={params.room as string} likeMessage={likeMessage} />
                </div>
                <div className="users">
                   {/* <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={correntTab} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Item One" {...a11yProps(0)} />
                            <Tab label="Item Two" {...a11yProps(1)} />
                            <Tab label="Item Three" {...a11yProps(2)} />
                        </Tabs>
                    </Box>*/}
                    <OnlineUsers users={users} currentUserName={params.name as string}/>
                </div>

                {/*<OnlineUsers users={users} currentUserName={params.name as string}/>
                <div className="messages-wrapper">
                    <h1>
                        <Link to="/">
                            <ArrowBackIos/>
                        </Link>
                        {params.room}
                    </h1>
                    <form  className="newMsgForm">
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
                    <Messages messages={messages} currentUserId={getCurrentUserId()} room={params.room as string} />
                </div>*/}
            </div>
        )
}
export default Chat