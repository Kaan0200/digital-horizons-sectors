import {
  LucideAnchor,
  LucideArrowBigUpDash,
  LucidePause,
  LucidePlay,
  LucideRocket,
} from 'lucide-react';
import React from 'react';
import { observer } from 'mobx-react';
import { Mixes, MixID } from '../assets/mixes';
import { Menu } from '@base-ui-components/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../stores/RootStore';
import { NavigateFunction, useNavigate } from 'react-router';

interface NueButtonProps {
  rectangle?: boolean;
  children?: React.JSX.Element | string;
  onClick?: () => void;
  toggled?: boolean;
}

export const NeuButton = (props: NueButtonProps): React.JSX.Element => {
  return (
    <div className="flex items-center justify-center m-2">
      <button
        onClick={props.onClick}
        className={
          `font-medium bg-plum-500 text-white w-fit transition-all rounded-md shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] 
                hover:translate-y-[3px]` + (props.rectangle ? ' p-4' : ' px-6 py-2')
        }
      >
        {props.children}
      </button>
    </div>
  );
};

export const UnloadButton = observer(() => {
  const store = useStore();
  if (store.selectedId !== '') {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <NeuButton rectangle onClick={() => store.stop()}>
            <LucideArrowBigUpDash />
          </NeuButton>
        </motion.div>
      </AnimatePresence>
    );
  } else {
    return null;
  }
});

export const PlayButton = observer(() => {
  const store = useStore();

  if (store.selectedId !== '') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <NeuButton
          rectangle
          onClick={() => {
            store.play(store.selectedId);
          }}
        >
          <div>{store.isPlaying ? <LucidePause /> : <LucidePlay />}</div>
        </NeuButton>
      </motion.div>
    );
  } else {
    return null;
  }
});

/**
 * Button that moves the user-view back to having the sector
 * as close to the middle of the screen as it can get.
 */
export const ReturnButton = observer(
  (props: { onClick: (nav: NavigateFunction, id: MixID) => void }) => {
    const nav = useNavigate();
    const store = useStore();

    if (store.selectedId !== '') {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <NeuButton
            rectangle
            onClick={() => props.onClick(nav, store.selectedId as MixID)}
          >
            <LucideAnchor />
          </NeuButton>
        </motion.div>
      );
    }
  },
);

/**
 * Button that opens a menu letting the user go to sectors
 *
 * [Implements Base UI](https://base-ui.com/react/components/menu)
 */
export const SectorsListButton = observer(
  (props: { onClick: (nav: NavigateFunction, id: MixID) => void }) => {
    const nav = useNavigate();
    const store = useStore();

    const menuItems = Mixes.map((mix, idx) => {
      const selectedDot = store.selectedId === mix.id ? <span>X</span> : null;

      return (
        <Menu.Item
          key={idx}
          className="px-4 cursor-pointer hover:bg-plum-600"
          onClick={() => props.onClick(nav, mix.id)}
        >
          {mix.id} - {mix.name} {selectedDot}
        </Menu.Item>
      );
    });

    return (
      <Menu.Root>
        <Menu.Trigger
          className={`w-fit font-medium bg-plum-500 text-white  transition-all rounded-md shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] 
                hover:translate-y-[3px] p-4 m-4`}
        >
          <LucideRocket />
        </Menu.Trigger>
        <Menu.Portal>
          <Menu.Backdrop />
          <Menu.Positioner side="right">
            <Menu.Popup className="py-4 bg-plum-500 font-medium text-white transition-all rounded-md shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px]">
              {menuItems}
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
    );
  },
);
