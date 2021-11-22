import React, {ChangeEvent, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {TextField} from "@mui/material";
import "./join.css";

const Join = () => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const defaultRoom = 'General';
    let history = useNavigate();

    useEffect(() => {
        setRoom(defaultRoom);
    },[]);

    const clearForm = () => {
        setName('');
        setRoom('');
    }
    const inputUpdate = (event: ChangeEvent<HTMLElement>) => {
        const name = (event.target as HTMLInputElement).name;
        const value = (event.target as HTMLInputElement).value;
        switch (name){
            case 'room':
                setRoom(value);
                break;
            case 'name':
                setName(value);
                break;
            default:
                throw `Unhandled input ${name}`;
        }
    }

    const onTextChanged = (event: ChangeEvent<HTMLElement>) => {
        setName((event.target as HTMLInputElement).value);
    }

    const join = () => {
        if (name && room) {
            history(`/chat/${name}/${room}`);
        }
    }

    return (
            <form onSubmit={() => join()} className="form-input">
                <TextField
                    required
                    id="outlined-required"
                    label="Name"
                    autoComplete="off"
                    name="name"
                    value={name}
                    onChange={(event) => onTextChanged(event)}
                    className="join-name"
                />
                <button type="submit" className="join-button">
                    Join
                </button>
            </form>
    )

}
export default Join;