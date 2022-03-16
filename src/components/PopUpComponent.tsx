import { Dialog, Transition } from '@headlessui/react';
import React, { useState } from 'react';

interface IPopUp {
  isOpen: boolean;
  openFunction: (isOpen: boolean) => void;
  children: any;
}

const PopUpComponent = ({ isOpen, openFunction, children }: IPopUp) => {
  return (
    <Transition
      show={isOpen}
      enter='transition duration-100 ease-out'
      enterFrom='transform scale-95 opacity-0'
      enterTo='transform scale-100 opacity-100'
      leave='transition duration-75 ease-out'
      leaveFrom='transform scale-100 opacity-100'
      leaveTo='transform scale-95 opacity-0'
    >
      <Dialog
        open={isOpen}
        onClose={() => openFunction(false)}
        className='fixed inset-0 z-10 overflow-y-auto'
      >
        <div className='flex items-center justify-center min-h-screen'>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
          <div className='relative h-full px-5 py-3 mx-auto bg-white rounded'>
            {children}
            <div className='mt-4 text-center'>
              <button
                className='px-4 py-2 font-bold text-black transition all; rounded hover:bg-cameo-pink mr-2'
                onClick={() => openFunction(false)}
              >
                Gå tilbake
              </button>
              <button className='btn-sm' onClick={() => openFunction(false)}>
                Velg sted
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PopUpComponent;
