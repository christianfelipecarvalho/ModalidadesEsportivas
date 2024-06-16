import { Alert, AlertTitle } from '@mui/material';
import React, { useEffect, useState } from 'react';

const AlertMessage = ({ severity, title, message }) => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        if(!message){
            setOpen(false);
            return;
        }
        setOpen(true);
        
        const timer = setTimeout(() => {
            setOpen(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [message]); 


    return (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '1000',  }}>
           {open && ( 
                <Alert 
                    variant='filled' 
                    severity={severity} 
                    style={{backgroundColor: severity === 'success' ? '#41a56d' : severity === 'error' ? '#ff0000ae' : '#f4a261'}}
                    onClose={() => setOpen(false)} 
                >
                    <AlertTitle>{title}</AlertTitle>
                    {message}
                </Alert>
            )}
        </div>
    )
}

export default AlertMessage;
