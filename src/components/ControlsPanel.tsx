import React from "react";


export default function ControlsPanel() {

    return (
        <div className="fixed left-0 top-0 flex flex-col z-20">
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

interface NueButtonProps {
    children?: React.JSX.Element | string;
    onClick?: () => void;
}

export const NeuButton = (props: NueButtonProps) => {
    return (
        <div className="flex items-center justify-center m-2">
            <button onClick={props.onClick}
                className="px-6 py-2 font-medium bg-plum text-white w-fit transition-all rounded-md shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
            >
                {props.children}
            </button>
        </div>
    );
};