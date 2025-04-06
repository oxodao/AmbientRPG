import { Link } from "react-router-dom";

export default function IndexPage({theme}: {theme: string}) {
    return <div className={`fullsize waitingscreen ${theme}`}>
        <h1>Ambient-RPG</h1>
        <div className="menu">
            <Link to="/game-master" className="button">Game Master</Link>
            <Link to="/viewer" className="button">Viewer</Link>
        </div>
    </div>
}