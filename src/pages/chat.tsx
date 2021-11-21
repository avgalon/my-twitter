import React, {ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import io, {Socket} from 'socket.io-client';
import OnlineUsers from '../components/onlineUsers';
import Messages, {Message} from '../components/messages';
import moment from 'moment';
import {useParams} from "react-router";
import SendIcon from '@mui/icons-material/Send';
import {ArrowBackIos} from "@mui/icons-material";
import {TextField} from "@mui/material";

const Chat = () => {
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMsg, setNewMsg] = useState('');
    let history = useNavigate();
    let params = useParams();

    const socketRef = useRef<Socket>(null);

    const handleSocket = useCallback(() => {
        // @ts-ignore
        socketRef.current = io('http://localhost:8080');
    }, [])
    useEffect(() => {
        handleSocket();
        const socket = socketRef.current;

        socket!.emit('join', params, function (err: any) {
            if (err) {
                history('/');
            }
        });

        socket!.on('updateUserList', function (users) {
            setUsers(users);
        });

        socket!.on('newMessage', (message: Message) => {
            const formattedTime = moment(message.createdDate).format('h:mm a');

            let newMsg: Message = {
                text: message.text,
                from: message.from,
                room: message.room,
                createdDate: formattedTime,
                id: new Date().getUTCMilliseconds(),
                likes: []
            }
            let results: Message[] = messages;
            results.push(newMsg);
            setMessages(results as never[]);

            const msgArr = (messages as Message[]).filter(message => message.room === params.room);
            if (msgArr.length > 3) {
                scrollToBottom();
            }
        });

        socket!.on('disconnect', function () {
            console.log('Connection lost from server.');
        });


        return () => {
            const param = {
                room: params.room
            }
            socket!.emit('leave', param);
            setUsers([]);
            setMessages([]);
            setNewMsg('');
        };
    }, [handleSocket, history, messages, params.room]);

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
        const newMessage = (e: FormEvent) => {
            const socket = socketRef.current;
            e.preventDefault()
            const obj = {
                'text': newMsg
            };
            socket!.emit('createMessage', obj, function (data: any) { });
            clearForm();
        }
        return (
            <div className="chat-page">
                <OnlineUsers users={users} currentUserName={params.name as string}/>
                <div className="messages-wrapper">
                    <h1>
                        <Link to="/">
                            <ArrowBackIos/>
                        </Link>
                        {params.room}
                    </h1>
                    <form onSubmit={(e) => newMessage(e)}  className="newMsgForm">
                        <TextField
                            required
                            id="outlined-required"
                            label="Type your message"
                            autoComplete="off"
                            name="newMsg"
                            value={newMsg}
                            onChange={inputUpdate.bind(this)}
                            className="join-name"
                        />
                        <button type="submit" className="newmsg-btn">
                            <SendIcon/>
                        </button>
                    </form>
                    <Messages messages={messages} room={params.room as string} />
                </div>
            </div>
        )
}
export default Chat