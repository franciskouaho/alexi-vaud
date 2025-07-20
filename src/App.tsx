import React from 'react';
import { HomePage } from './components/HomePage';
import { GameMap } from './components/GameMap';
import { Mission } from './components/Mission';
import { useGameState } from './hooks/useGameState';

function App() {
  const {
    gameState,
    isLoading,
    error,
    updatePlayerData,
    navigateToPage,
    startMission,
    completeMission,
    addAttempt,
    showHint,
  } = useGameState();

  const handleStartGame = async (pseudo: string, email: string) => {
    await updatePlayerData(pseudo, email);
    navigateToPage('map');
  };

  const handleSelectMission = (missionId: number) => {
    startMission(missionId);
  };

  const handleCompleteMission = () => {
    completeMission(gameState.currentMission);
  };

  const handleBackToMap = () => {
    navigateToPage('map');
  };

  const handleBackToHome = () => {
    navigateToPage('home');
  };

  const handleAddAttempt = () => {
    addAttempt(gameState.currentMission);
  };

  const handleShowHint = () => {
    showHint(gameState.currentMission);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto mb-4" />
          <p className="text-blue-800 font-medium">Chargement…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="bg-white/80 p-8 rounded-2xl shadow-xl max-w-md text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-4">Erreur</h2>
          <p className="text-red-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  switch (gameState.currentPage) {
    case 'home':
      return <HomePage onStartGame={handleStartGame} />;

    case 'map':
      return (
        <GameMap
          completedMissions={gameState.completedMissions}
          onSelectMission={handleSelectMission}
          onBackToHome={handleBackToHome}
          playerName={gameState.playerData.pseudo}
        />
      );

    case 'mission':
      return (
        <Mission
          missionId={gameState.currentMission}
          attempts={gameState.missionAttempts[gameState.currentMission] || 0}
          hintsShown={gameState.hintsShown[gameState.currentMission] || 0}
          onComplete={handleCompleteMission}
          onBack={handleBackToMap}
          onAttempt={handleAddAttempt}
          onShowHint={handleShowHint}
        />
      );

    default:
      return <HomePage onStartGame={handleStartGame} />;
  }
}

export default App;
