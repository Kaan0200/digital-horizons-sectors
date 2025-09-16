import React from "react";
import { NeuButton } from "./NueButton";


export default function ControlsPanel() {
    return (
        <div className="fixed justify-evenly h-full left-0 top-0 flex flex-col z-20">
            <div>
                <NeuButton>Play</NeuButton>
                <NeuButton>Vol</NeuButton>
                <NeuButton>Next</NeuButton>
            </div>
            <div>
                <NeuButton>Mixes</NeuButton>
            </div>
        </div>

    )
}