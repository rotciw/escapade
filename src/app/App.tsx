import React from 'react';
import FirebaseTest from '../components/firebaseTest';
import '../base.css';

const App: React.FC = () => {
  return (
    <div className='text-black font-inter'>
      <FirebaseTest />
      <button className='btn-primary'>Send inn svar</button>
    </div>
  );
};

export default App;
