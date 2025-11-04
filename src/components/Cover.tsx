import React from 'react';

/**
 * Simple, multipurpose "cover" component that creates a layer of non-click
 * grey to focus the user on the current window.
 * @returns Single JSX Node, does not wrap content
 */
export default function Cover(): React.JSX.Element {

    return <div
        id="cover"
        className="fixed w-full h-full top-0 left-0 opacity-50 bg-stone-900 z-10"
        onMouseDown={(e) => {
            e.stopPropagation();
        }}
    />
}