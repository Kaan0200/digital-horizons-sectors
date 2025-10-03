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
  //const store = useStore();

  return (
    <NeuButton rectangle>
      <LucideRocket />
    </NeuButton>
  );
});
