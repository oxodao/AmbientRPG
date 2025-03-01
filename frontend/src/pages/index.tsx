import { Link } from "react-router-dom";

export default function IndexPage() {
    return <div className="fullsize waitingscreen">
        <Link to="/game-master" className="cp77-button">Game Master</Link>
        <Link to="/viewer" className="cp77-button">Viewer</Link>
    </div>

}