import React from 'react';
import Cover from '../components/Cover';
import { NeuButton } from '../components/Buttons';
import { useNavigate } from 'react-router';

export function WelcomeSplash(): React.JSX.Element {
    const nav = useNavigate();
    return (
        <>
            <Cover />
            <div
                id="sector-page"
                className="fixed flex justify-evenly items-center h-full w-full top-0 left-0 z-30"
                onMouseDown={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className="text-center m-32">
                    <h1 className="text-2xl">Welcome to Digital Horizons!</h1>
                    <h3 className="m-16">
                        Scroll around to find a sector to tune into. Each sector features
                        a unique musical DJ mix to listen to. The other dots you see are
                        other people listening to sectors too!
                    </h3>
                    <h3 className="m-16">
                        ⬅ If you do not want to search, use the controls on the left side
                        to also select a sector, as well as pause and play your selection.
                    </h3>
                    <div>
                        <div>
                            <input type="checkbox" /> Do not show this message again.
                            *This stores a cookie on your browser indicating you do not
                            wish to see this message, that is the only purpose and usage
                            of a cookie on this website.
                        </div>
                        <div>
                            <NeuButton onClick={() => nav('..')}>
                                Close window... and take off!
                            </NeuButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
