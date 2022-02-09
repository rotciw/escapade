import React from 'react';
import FirebaseTest from '../components/firebaseTest';
import CharacterCreation from '../components/characterCreation';
import '../base.css';

const App: React.FC = () => {
  return (
    <div className='font-inter'>
      {/* <FirebaseTest /> */}
      <div className='h-40'></div>
      <CharacterCreation />
    </div>
  );
};

export default App;
