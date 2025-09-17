import { LucideX } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';
import { NeuButton } from './NueButton';

export default function SectorDetail(): React.JSX.Element {
  function selectMix() { }

  const nav = useNavigate();
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
        className="fixed flex justify-evenly items-center h-full w-full top-0 left-0 z-40"
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
            <h2 className="text-2xl">SET TITLE</h2>
            <div onClick={() => nav('/')}><LucideX /></div>
          </div>
          <div className="px-4 flex">
            <div className="mr-4 w-48 h-48 border-4 rounded-md">image</div>
            <div className="w-110 h-48 border-4 rounded-md">description</div>
          </div>
          <div className="pt-4">
            <NeuButton onClick={() => selectMix()}>PLAY TRANSMISSION</NeuButton>
          </div>
        </div>
      </div>
    </>
  );
}
