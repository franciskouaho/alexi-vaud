import React from 'react';
import { MapPin, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import { Location } from '../types/game';

interface GameMapProps {
  completedMissions: boolean[];
  onSelectMission: (missionId: number) => void;
  onBackToHome: () => void;
  playerName: string;
}

const locations: Location[] = [
  { id: 1, name: "Parc de Verdure", coordinates: { x: 25, y: 30 }, isUnlocked: true, isCompleted: false },
  { id: 2, name: "Casino", coordinates: { x: 45, y: 45 }, isUnlocked: false, isCompleted: false },
  { id: 3, name: "Le Majestic", coordinates: { x: 35, y: 65 }, isUnlocked: false, isCompleted: false },
  { id: 4, name: "L'Atelier des Cousins", coordinates: { x: 65, y: 35 }, isUnlocked: false, isCompleted: false },
  { id: 5, name: "L'Église", coordinates: { x: 75, y: 70 }, isUnlocked: false, isCompleted: false }
];

export const GameMap: React.FC<GameMapProps> = ({ 
  completedMissions, 
  onSelectMission, 
  onBackToHome,
  playerName 
}) => {
  const getLocationStatus = (locationId: number) => {
    const isCompleted = completedMissions[locationId - 1];
    const isUnlocked = locationId === 1 || completedMissions[locationId - 2];
    
    return { isCompleted, isUnlocked };
  };

  const getNextUnlockedLocation = () => {
    return completedMissions.findIndex(completed => !completed) + 1;
  };

  const allMissionsCompleted = completedMissions.every(completed => completed);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-2 text-blue-700 hover:text-blue-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            <h1 className="text-2xl font-bold text-blue-900">
              Carte de Châtelaillon-Plage
            </h1>
            <div className="text-blue-700">
              Bonjour, {playerName}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white/70 rounded-xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Progression</span>
            <span className="text-sm text-blue-600">
              {completedMissions.filter(Boolean).length}/5 missions
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(completedMissions.filter(Boolean).length / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="relative bg-gradient-to-br from-amber-100 to-yellow-200 rounded-3xl p-8 shadow-2xl border-4 border-white/50">
          {/* Map Background - Simulated Châtelaillon */}
          <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-green-200 via-yellow-100 to-blue-200 rounded-2xl overflow-hidden">
            {/* Coastline simulation */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-300 to-transparent opacity-60"></div>
            
            {/* Location pins */}
            {locations.map((location) => {
              const { isCompleted, isUnlocked } = getLocationStatus(location.id);
              
              return (
                <div
                  key={location.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                  style={{
                    left: `${location.coordinates.x}%`,
                    top: `${location.coordinates.y}%`
                  }}
                >
                  <button
                    onClick={() => isUnlocked && onSelectMission(location.id)}
                    className={`relative group ${
                      isUnlocked 
                        ? 'hover:scale-110 cursor-pointer' 
                        : 'cursor-not-allowed opacity-50'
                    } transition-all duration-200`}
                    disabled={!isUnlocked}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : isUnlocked
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500'
                        : 'bg-gray-400'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : isUnlocked ? (
                        <MapPin className="w-6 h-6 text-white" />
                      ) : (
                        <Lock className="w-6 h-6 text-white" />
                      )}
                    </div>
                    
                    {/* Location label */}
                    <div className={`absolute top-14 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap shadow-md ${
                      isCompleted
                        ? 'bg-green-100 text-green-800'
                        : isUnlocked
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {location.name}
                    </div>

                    {/* Pulse animation for next available mission */}
                    {isUnlocked && !isCompleted && location.id === getNextUnlockedLocation() && (
                      <div className="absolute inset-0 rounded-full animate-ping bg-orange-400 opacity-30"></div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center">
            {allMissionsCompleted ? (
              <div className="bg-green-100 border border-green-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-green-800 mb-4 text-center">
                  🎉 Félicitations, explorateur de l'ombre !
                </h2>
                <p className="text-lg font-semibold text-green-800 mb-3 text-center">
                  Tu fais partie des tout premiers à avoir bouclé l'enquête à Châtelaillon.
                </p>
                <p className="text-green-700 mb-4 text-center font-medium">
                  Ton avis peut tout changer.
                </p>
                <p className="text-green-700 mb-6 text-center">
                  Aide-nous à faire évoluer l'aventure en répondant à <strong>ce questionnaire ultra rapide</strong> :
                </p>
                <div className="text-center">
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSfhWhAvLUypDcPnaRbI0YTc3tK7XXrnp5Y4Tnphf3ikZ1gPug/viewform?usp=header"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
                  >
                    👉 Donner mon avis
                  </a>
                </div>
                </div>
            ) : (
              <div className="bg-blue-100 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  Mission suivante
                </h3>
                <p className="text-blue-700">
                  Clique sur le marqueur orange pour commencer ta prochaine aventure !
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};