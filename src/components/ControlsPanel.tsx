import React from "react";


export default function ControlsPanel() {

    return (
        <div className="fixed top-0 left-0 flex flex-col">
            <NeuButton>Play</NeuButton>
            <NeuButton>Vol</NeuButton>
            <NeuButton>Next</NeuButton>
        </div>
    )
}

interface NueButtonProps {
    children?: React.JSX.Element | string;
}

export const NeuButton = (props: NueButtonProps) => {
    return (
        <div className="flex items-center justify-center m-2">
            <button className="px-6 py-2 font-medium bg-indigo-500 text-white w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
                {props.children}
            </button>
        </div>
    );
};