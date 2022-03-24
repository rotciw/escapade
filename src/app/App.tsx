import React from 'react';
import { Route, Routes } from 'react-router-dom';
import '../base.css';
import { GameContextProvider } from '../contexts/gameContext';
import CreatingGameView from '../views/host/creatingGameView';
import BaseGameView from '../views/shared/baseGameView';
import LobbyView from '../views/shared/lobbyView';
import UserCreationView from '../views/player/userCreationView';
import InGameView from '~/views/player/inGameView';
import { TimeContextProvider } from '~/contexts/timerContext';

const App: React.FC = () => {
  return (
    <div className='h-screen overflow-auto text-alice-blue font-inter bg-colorful-blue selection:bg-[#6BDBA5]'>
      <GameContextProvider>
        <TimeContextProvider>
          <Routes>
            <Route path='/' element={<BaseGameView />} />
            {/* can be an unique string path later on */}
            <Route path='/customize' element={<UserCreationView />} />
            <Route path='/create' element={<CreatingGameView />} />
            <Route path='/lobby' element={<LobbyView />} />
            <Route path='/game' element={<InGameView />} />
          </Routes>
        </TimeContextProvider>
      </GameContextProvider>
    </div>
  );
};

export default App;
