import React, { useState, useEffect } from 'react';

const Editor = () => {
    const [content, setContent] = useState('');
    const [cursorPosition, setCursorPosition] = useState(0);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onmessage = (event) => {
            if (event.data.startsWith('updateDocumentContent')) {
                const newContent = event.data.substring(20);
                setContent(newContent);
            } else if (event.data.startsWith('updateCursorPosition')) {
                const newCursorPosition = JSON.parse(event.data.substring(20));
                setCursorPosition(newCursorPosition);
            }
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleContentChange = (event) => {
        setContent(event.target.value);
        const socket = new WebSocket('ws://localhost:8080');
        socket.send(`updateDocumentContent ${event.target.value}`);
    };

    const handleCursorPositionChange = (event) => {
        setCursorPosition(event.target.selectionStart);
        const socket = new WebSocket('ws://localhost:8080');
        socket.send(`updateCursorPosition ${event.target.selectionStart}`);
    };

    return (
        <div>
            <textarea
                value={content}
                onChange={handleContentChange}
                onSelect={handleCursorPositionChange}
            />
            <div>
                <span>Cursor Position: {cursorPosition}</span>
            </div>
        </div>
    );
};

export default Editor;
