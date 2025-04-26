import React from "react";
import { useNavigate } from "react-router";

interface SectorDetailProps {

}

export default function SectorDetail(props: SectorDetailProps): React.JSX.Element {
    let nav = useNavigate();
    return (
        <div
            className="w-full h-full absolute content-center"
            onClick={() => {
                nav("..");
            }}
        >
            <div
                onClick={(e) => { e.stopPropagation();}}
                className="w-80 h-80 bg-amber-600 m-auto"
            >
                This screen shows the details of the mix playing
            </div>
        </div>
    )
}
