export function GameOverComponent(props: {restart: () => void}) {
    return (
        <>
            <h1>Game Over, Man</h1>
            <button onClick={props.restart}>Start Over</button>
        </>
    )
}