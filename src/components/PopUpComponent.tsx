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
          <div className='relative px-5 py-3 mx-auto bg-white rounded'>{children}</div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PopUpComponent;
