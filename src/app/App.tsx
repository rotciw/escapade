import React from 'react';
import FirebaseTest from '../components/firebaseTest';
import '../base.css';

const App: React.FC = () => {
  return (
    <div className='min-h-screen text-black font-inter bg-colorful-blue'>
      <FirebaseTest />
      <button className='btn-lg'>Send inn svar</button>
      <button className='btn-sm'>Start</button>
    </div>
  );
};

export default App;
