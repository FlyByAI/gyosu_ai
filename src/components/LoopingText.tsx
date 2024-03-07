import React, { useEffect, useState } from 'react';

type LoopingTextProps = {
    textArray: string[];
    variant?: 'scroll' | 'typed';
};

const LoopingText: React.FC<LoopingTextProps> = ({ textArray, variant = 'scroll' }) => {
    const [index, setIndex] = useState(0);
    const [animationClass, setAnimationClass] = useState('scroll-in');
    const [typedText, setTypedText] = useState('');
    const [typedIndex, setTypedIndex] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        switch (variant) {
            case 'scroll':
                interval = setInterval(() => {
                    setAnimationClass('scroll-out');
                    setTimeout(() => {
                        setIndex((prevIndex) => (prevIndex + 1) % textArray.length);
                        setAnimationClass('scroll-in');
                    }, 300);
                }, 2000);
                break;

            case 'typed':
                setTypedText('');
                setTypedIndex(0);
                interval = setInterval(() => {
                    setTypedText('');
                    setTypedIndex(0);
                    setIndex((prevIndex) => (prevIndex + 1) % textArray.length);
                }, 2000);
                break;

            default:
                break;
        }

        return () => {
            clearInterval(interval);
        };
    }, [textArray.length, variant]);

    useEffect(() => {
        let typedInterval: NodeJS.Timeout;
        if (variant === 'typed' && typedIndex < textArray[index].length) {
            typedInterval = setInterval(() => {
                setTypedText((prevText) => prevText + textArray[index][typedIndex]);
                setTypedIndex((prevIndex) => prevIndex + 1);
            }, 50);
        }
        return () => {
            clearInterval(typedInterval);
        };
    }, [textArray, index, typedIndex, variant]);

    return (
        <>
            {variant === 'scroll' ? (
                <span className={`inline-block transition-all duration-300 ease-in-out ${animationClass}`}>
                    {textArray[index]}
                </span>
            ) : (
                <span className="font-bold w-full">
                    {typedText || `${"."}`}</span>
            )}
        </>
    );
};

export default LoopingText;
