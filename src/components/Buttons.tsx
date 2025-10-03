import {
  LucideAnchor,
  LucideArrowBigUpDash,
  LucidePause,
  LucidePlay,
  LucideRocket,
} from 'lucide-react';
import { useStore } from '../main';
import React from 'react';
import { observer } from 'mobx-react';
import { Mixes } from '../assets/mixes';
import { Menu } from '@base-ui-components/react';

interface NueButtonProps {
  rectangle?: boolean;
  children?: React.JSX.Element | string;
  onClick?: () => void;
}

export const NeuButton = (props: NueButtonProps): React.JSX.Element => {
  return (
    <div className="flex items-center justify-center m-2">
      <button
        onClick={props.onClick}
        className={
          `font-medium bg-plum text-white w-fit transition-all rounded-md shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] 
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
      <NeuButton
        rectangle
        onClick={() => {
          store.selectedId = '';
          store.isPlaying = false;
        }}
      >
        <LucideArrowBigUpDash />
      </NeuButton>
    );
  } else {
    return null;
  }
});

export const PlayButton = observer(() => {
  const store = useStore();

  if (store.selectedId !== '') {
    return (
      <NeuButton
        rectangle
        onClick={() => {
          store.play(store.selectedId);
        }}
      >
        <div>{store.isPlaying ? <LucidePause /> : <LucidePlay />}</div>
      </NeuButton>
    );
  } else {
    return null;
  }
});

export const ReturnButton = observer(() => {
  const store = useStore();

  if (store.selectedId !== '') {
    return (
      <NeuButton
        rectangle
        onClick={() => {
          // move view back to sector on map
        }}
      >
        <LucideAnchor />
      </NeuButton>
    );
  }
});

/**
 * Button that opens a menu letting the user go to sectors
 *
 * [Implements Base UI](https://base-ui.com/react/components/menu)
 */
export const SectorsListButton = observer(() => {
  const store = useStore();

  const menuItems = Mixes.map((mix, idx) => {
    const selectedDot = store.selectedId === mix.id ? <span>X</span> : null;

    return (
      <Menu.Item key={idx} className="cursor-pointer">
        {mix.id} - {mix.name} {selectedDot}
      </Menu.Item>
    );
  });

  return (
    <Menu.Root>
      <Menu.Trigger
        className={`w-fit font-medium bg-plum text-white  transition-all rounded-md shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] 
                hover:translate-y-[3px] p-4 m-4`}
      >
        <LucideRocket />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Backdrop />
        <Menu.Positioner side="right">
          <Menu.Popup className="p-4 bg-plum font-medium text-white transition-all rounded-md shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px]">
            {menuItems}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
});
