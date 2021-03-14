import { useEffect, useRef } from "react";

export function GameOverComponent(props: {restart: () => void}) {
    const startOverButton = useRef<HTMLButtonElement>(null);

    useEffect(() => {
       startOverButton.current?.focus(); 
    }, []);
    return (
        <>
            <h1>Game Over, Man</h1>
            <button onClick={props.restart} ref={startOverButton}>Start Over</button>
        </>
    )
}