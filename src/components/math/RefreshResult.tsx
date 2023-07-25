import React, { useState } from 'react';
import RefreshIcon from '../../svg/RefreshIcon';

interface RefreshResultProps {
    problem: string;
    setChat: (value: string) => void;
    index: number | null;
}

const RefreshResult: React.FC<RefreshResultProps> = ({ problem, setChat, index }) => {

    const handleClick = () => {
        document.getElementById(`ai-chat-textbox-${index}`)?.focus()
        setChat(`Change this problem: ${problem}`);
    }

    return (
        <button onClick={handleClick}><RefreshIcon /> </button>
    )
}

export default RefreshResult;
