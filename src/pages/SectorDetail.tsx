import { LucideX } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { NeuButton } from '../components/Buttons';
import { useStore } from '../stores/RootStore';
import { Mixes } from '../assets/mixes';
import { observer } from 'mobx-react';

/**
 * React Router Page representing the user viewing the details
 * of a mix/sector.
 *
 * This page is loaded via router, so it is detached from the App
 * but it uses a Mobx Singleton Store to communicate state.
 */
export const SectorDetail = observer((): React.JSX.Element => {
  const store = useStore();
  const nav = useNavigate();
  const currentID = location.pathname.slice(1);
  const currentMix = Mixes.find((mix) => mix.id === currentID);

  return (
    <>
      <div
        id="cover"
        className="fixed w-full h-full top-0 left-0 opacity-50 bg-stone-900 z-10"
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      />

      <div
        id="sector-page"
        className="fixed flex justify-evenly items-center h-full w-full top-0 left-0 z-30"
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-180 p-4 bg-stone-950 absolute rounded-md shadow-[3px_3px_0px_black]"
        >
          <div className="p-4 flex justify-between">
            <h2 className="text-4xl" style={{ fontFamily: 'NeueHumanist' }}>
              {currentMix?.name}
            </h2>
            <div onClick={() => nav('/')}>
              <LucideX />
            </div>
          </div>
          <div className="px-4 flex">
            <div className="mr-4 w-48 h-48 border-4 rounded-md">image</div>
            <div className="w-110 h-48 border-4 rounded-md">{currentMix?.desc}</div>
          </div>
          <div className="pt-4">
            {store.isPlaying && store.selectedId === currentID ? (
              <NeuButton onClick={() => store.play(currentID)} toggled>
                TRANSMITTING...
              </NeuButton>
            ) : (
              <NeuButton onClick={() => store.play(currentID)}>
                PLAY TRANSMISSION
              </NeuButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default SectorDetail;
