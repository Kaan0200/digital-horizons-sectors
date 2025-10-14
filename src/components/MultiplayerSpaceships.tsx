import { RealtimeChannel } from '@supabase/supabase-js';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { useStore } from '../stores/RootStore';
import { Coordinates, Payload } from '../types';
import supabase from '../supabase';
import { nanoid } from 'nanoid';

// Generate a random user id
const userId = nanoid();

const X_THRESHOLD = 25;
const Y_THRESHOLD = 35;

/**
 * React Component that connects to, receives from supabase store
 * before drawing the updates
 */
const MultiplayerSpaceships = observer((): React.JSX.Element => {
    const store = useStore();

    /**
     * function called when receiving a supabase broadcast
     * @param payload
     */
    function locationReceived(payload: Payload<{ user_id: string } & Coordinates>) {
        const userId = payload!.payload!.user_id;
        const existingUser = store.userStore.users.get(userId);

        const x =
            (payload?.payload?.x ?? 0) - X_THRESHOLD > window.innerWidth
                ? window.innerWidth - X_THRESHOLD
                : payload?.payload?.x;
        const y =
            (payload?.payload?.y ?? 0 - Y_THRESHOLD) > window.innerHeight
                ? window.innerHeight - Y_THRESHOLD
                : payload?.payload?.y;

        if (existingUser) {
            store.userStore.users.set(userId, {
                ...existingUser,
                ...{ x, y },
            });
        } else {
            store.userStore.users.set(userId, {
                color: '',
                hue: '',
                x,
                y,
            });
        }
    }

    useEffect(() => {
        // variables
        let intervalCounter = 0;
        const intervalThrottle = 20;

        // join channel
        const messageChannel: RealtimeChannel = supabase.channel(`location`);

        // subscribe to channel
        messageChannel
            .on('broadcast', { event: 'POS' }, (payload) => locationReceived(payload))
            .subscribe();

        // named function lives here to access both messageChannel and both window.event spaces
        function setMouseEvent(e: MouseEvent) {
            // throttle how many events to send
            if (intervalCounter >= intervalThrottle) {
                // grab data, send message
                const [x, y] = [e.clientX, e.clientY];
                messageChannel.send({
                    type: 'broadcast',
                    event: 'POS',
                    payload: { user_id: userId, x, y },
                });

                intervalCounter = 0; // reset throttle
            } else {
                intervalCounter++;
            }
        }

        window.addEventListener('mousemove', setMouseEvent);

        // useEffect() clean up
        return () => {
            window.removeEventListener('mousemove', setMouseEvent);

            supabase.removeChannel(messageChannel);
        };
    });

    const finalCursors = new Array<React.JSX.Element>();

    store.userStore.users.forEach((user) => {
        finalCursors.push(
            <div
                className="fixed h-4 w-4 bg-amber-300"
                style={{ top: `${user.x}px`, right: `${user.y}px` }}
            >
                {user.color}
            </div>,
        );
    });

    return (
        <div>
            <div className="fixed">
                <div>{finalCursors.length}</div>
            </div>
            {finalCursors}
        </div>
    );
});

export default MultiplayerSpaceships;
