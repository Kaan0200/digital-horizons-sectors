import {
  LucideAnchor,
  LucideArrowBigUpDash,
  LucidePause,
  LucidePlay,
  LucideRocket,
} from 'lucide-react';
import { useStore } from '../../main';
import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { Mixes } from '../../assets/mixes';
import { Menu } from '@base-ui-components/react';
import styles from './Buttons.module.css';

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
          store.isPlaying = !store.isPlaying;
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

export const SectorsListButton = observer(() => {
  const store = useStore();

  const menuItems = Mixes.map((mix, idx) => {
    const selectedDot = store.selectedId === mix.id ? <div>X</div> : null;

    return (
      <Menu.Item key={idx}>
        {mix.id} - {mix.name} {selectedDot}
      </Menu.Item>
    );
  });

  return (
    <Menu.Root>
      <Menu.Trigger>
        <LucideRocket />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Backdrop />
        <Menu.Positioner>
          <Menu.Popup className={styles.Popup}>{menuItems}</Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
});
