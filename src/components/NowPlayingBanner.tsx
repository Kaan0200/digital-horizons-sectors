import { observer } from 'mobx-react';
import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../stores/RootStore';

/**
 * Banner component that flies down from the top and displays the currently
 * playing mix.
 */
const NowPlayingBanner = observer(() => {
  const store = useStore();
  return (
    <AnimatePresence>
      {store.selectedId !== '' ? (
        <motion.div
          className="fixed justify-evenly w-full flex flex-row z-20 py-2"
          initial={{ top: '-80px' }}
          animate={{ top: '0px' }}
          exit={{ top: '-80px' }}
        >
          <div className="text-center bg-mint text-black p-4 rounded-md shadow-[3px_3px_0px_black]">
            Loaded Track... {store.selectedId}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
});
export default NowPlayingBanner;
