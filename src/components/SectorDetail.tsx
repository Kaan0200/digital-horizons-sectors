import React from "react";
import { useNavigate } from "react-router";



export default function SectorDetail(): React.JSX.Element {
    const nav = useNavigate();
    return (
        <div
            className="flex content-center absolute"
            onClick={() => {
                nav("..");
            }}
        >
            <div
                onClick={(e) => { e.stopPropagation();}}
                className="w-80 h-80 bg-amber-600 absolute"
            >
                This screen shows the details of the mix playing
                <button>Play Me</button>
            </div>
        </div>
    )
}
