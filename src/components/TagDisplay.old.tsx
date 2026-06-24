import React from 'react';

/**
 * A simple component that takes a list of strings and turns them into
 * colorful chip style components.
 *
 * Only the chip components, does not contain a wrapping div.
 * @param props
 * @returns
 */
export function TagDisplay(props: { tags: string[] }): React.JSX.Element {
    const tags: React.JSX.Element[] = [];

    for (const tag of props.tags) {
        tags.push(
            <div className="p-1 mr-1 text-xs border-amber-400 border-2 rounded-4xl">
                {tag}
            </div>,
        );
    }

    return <>{tags}</>;
}
