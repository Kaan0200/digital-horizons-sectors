import React from "react";
import { useNavigate } from "react-router";

export default function SectorDetail(): React.JSX.Element {
    const nav = useNavigate();
    return (
        <>
            <div id="cover" className="fixed w-full h-full top-0 left-0 opacity-50 bg-stone-900 z-10">

            </div>
        <div
            id="sector-page"
            className="fixed top-[40%] left-[40%] translate-[-40%] z-40"
            onClick={() => {
                nav("..");
            }}
        >
                <div onClick={(e) => { e.stopPropagation(); }}
                    className="w-180 h-80 bg-stone-900 absolute rounded-md shadow-[3px_3px_0px_black]"
                >
                    <div className="flex justify-between">
                        <h2>SET TITLE</h2>
                        <div onClick={() => nav("/")}>X</div>
                    </div>
                    <div className="flex">
                        <div className="w-60 h-60 border-4 rounded-md">
                            image
                        </div>
                        <div className="w-120 h-60 border-4 rounded-md">
                            description
                        </div>
                    </div>
            </div>
            </div>
        </>
    )
}
