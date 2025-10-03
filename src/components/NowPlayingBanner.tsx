import { observer } from 'mobx-react';
import React from 'react';
import { useStore } from '../main';

const NowPlayingBanner = observer(() => {
  const store = useStore();
  return store.selectedId !== '' ? (
    <div className="fixed justify-evenly w-full top-0 flex flex-row z-20 py-2">
      <div className="text-center bg-mint text-black p-4 rounded-md shadow-[3px_3px_0px_black]">
        Loaded Track... {store.selectedId}
      </div>
    </div>
  ) : null;
});
export default NowPlayingBanner;
