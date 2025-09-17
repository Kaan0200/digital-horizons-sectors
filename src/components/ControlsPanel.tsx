import { LucidePlay, LucideRocket, LucideVolume } from "lucide-react";
import React from "react";
import { NeuButton } from "./NueButton";



export default function ControlsPanel(): React.JSX.Element {
    return (
        <div className="fixed justify-evenly h-full left-0 top-0 flex flex-col z-20">
            <div>
                <NeuButton rectangle><LucidePlay /></NeuButton>
                <NeuButton rectangle><LucideVolume /></NeuButton>
                <NeuButton>Next</NeuButton>
            </div>
            <div>
                <NeuButton rectangle><LucideRocket /></NeuButton>
            </div>
        </div>

    )
}