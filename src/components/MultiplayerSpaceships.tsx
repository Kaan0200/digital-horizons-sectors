import { REALTIME_LISTEN_TYPES, RealtimeChannel } from '@supabase/supabase-js';
import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
//import { cloneDeep } from 'lodash';
import { useStore } from '../stores/RootStore';
import { Coordinates, Payload } from '../types';
import supabase from '../supabase';

// Generate a random user id
const userId = nanoid();

const LATENCY_THRESHOLD = 400;
const MAX_ROOM_USERS = 50;
const MAX_DISPLAY_MESSAGES = 50;
const MAX_EVENTS_PER_SECOND = 10;
const X_THRESHOLD = 25;
const Y_THRESHOLD = 35;

const MultiplayerSpaceships = observer((): React.JSX.Element => {
  const store = useStore();
  useEffect(() => {
    const messageChannel: RealtimeChannel = supabase.channel(`chat_messages:${roomId}`);

    // Listen for cursor positions from other users in the room
    messageChannel.on(
      REALTIME_LISTEN_TYPES.BROADCAST,
      { event: 'POS' },
      (payload: Payload<{ user_id: string } & Coordinates>) => {
        const userId = payload!.payload!.user_id;
        const existingUser = store.userStore.users.get(userId);

        if (existingUser) {
          const x =
            (payload?.payload?.x ?? 0) - X_THRESHOLD > window.innerWidth
              ? window.innerWidth - X_THRESHOLD
              : payload?.payload?.x;
          const y =
            (payload?.payload?.y ?? 0 - Y_THRESHOLD) > window.innerHeight
              ? window.innerHeight - Y_THRESHOLD
              : payload?.payload?.y;

          store.userStore.users.set(userId, { ...existingUser, ...{ x, y } });
          //users = cloneDeep(users);
        }

        //store.userStore.users = users;
      },
    );
  });

  const finalCursors = new Array<React.JSX.Element>();

  store.userStore.users.forEach((user) => {
    finalCursors.push(<>{user.color}</>);
  });

  return <div>{finalCursors} multi multi mulit</div>;
});

export default MultiplayerSpaceships;
