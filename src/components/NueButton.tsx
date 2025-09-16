import React from 'react';

interface NueButtonProps {
    children?: React.JSX.Element | string;
    onClick?: () => void;
}

export const NeuButton = (props: NueButtonProps): React.JSX.Element => {
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