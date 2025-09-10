import React, { JSX, useEffect } from "react";
import { useState } from "react";

interface SpaceViewProps {
    children: Array<JSX.Element>;
}

export default function SpaceView(props: SpaceViewProps): JSX.Element {
    const [state, setState] = useState();
    const _windowRef: React.RefObject<HTMLDivElement | null> = React.createRef();

    useEffect(() => {
        _windowRef.current?.scrollTo({
            "behavior": "smooth",
            left: _windowRef.current.clientWidth / 2,
            top: _windowRef.current.clientHeight / 2

        })
    })

    return (
        <div className="flex flex-wrap flex-row" ref={_windowRef}>
            {props.children}
        </div>
    )
}
