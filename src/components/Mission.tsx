import React, { useState, useEffect } from 'react';
import { ArrowLeft, Lightbulb, CheckCircle, XCircle, HelpCircle, MapPin, QrCode, Camera } from 'lucide-react';
import { Mission as MissionType } from '../types/game';
import { missions } from '../data/missions';
import { PuzzleGame } from './PuzzleGame';

interface MissionProps {
  missionId: number;
  attempts: number;
  hintsShown: number;
  onComplete: () => void;
  onBack: () => void;
  onAttempt: () => void;
  onShowHint: () => void;
}

// Google Maps links for each location
const locationMapsLinks: { [key: number]: string } = {
  1: 'https://maps.app.goo.gl/iaXr3rgrX7yznLpr7', // Parc
  2: 'https://maps.app.goo.gl/BpbtbafagwTh3xZN9', // Casino
  3: 'https://maps.app.goo.gl/V34pAzoHHUiUkmpX6', // Majestic
  4: 'https://maps.app.goo.gl/wcLdwvPJdaYumDQdA', // Atelier des cousins
  5: 'https://maps.app.goo.gl/SUmvTXKD2uaFHSEW8'  // Église
};

// QR Code hints for missions 2 and 3
const qrCodeHints: { [key: number]: string[] } = {
  2: [
    "Le premier est placé sur le 3ᵉ lampadaire le plus proche de vous quand vous êtes situé en face des statues",
    "Celui-ci est placé sur une surface plate derrière les statues",
    "Une gouttière vous donnera le 3ᵉ"
  ],
  3: [
    "Mon premier est la couleur de l'herbe.\nMon deuxième éclaire la rue la nuit.\nMon tout rassemble les deux éléments cités.",
    "Trouve ce logo, et proche de celui-ci tu trouveras le deuxième QR code \"indice\""
  ]
};

export const Mission: React.FC<MissionProps> = ({
  missionId,
  attempts,
  hintsShown,
  onComplete,
  onBack,
  onAttempt,
  onShowHint
}) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: ''
  });
  const [showQrHints, setShowQrHints] = useState<{ [key: number]: boolean }>({});

  const mission: MissionType = missions[missionId - 1];
  
  const shouldShowHint = (hintIndex: number) => {
    const attemptsNeeded = (hintIndex + 1) * 2;
    return attempts >= attemptsNeeded;
  };

  const getAvailableHints = () => {
    return mission.hints.filter((_, index) => shouldShowHint(index));
  };

  const handleOpenRoute = () => {
    const mapsLink = locationMapsLinks[missionId];
    if (mapsLink) {
      window.open(mapsLink, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenCamera = () => {
    // Try to open camera for QR code scanning
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          // Create a simple camera interface
          const video = document.createElement('video');
          video.srcObject = stream;
          video.play();
          
          // Open in a new window or show modal
          const newWindow = window.open('', '_blank', 'width=400,height=400');
          if (newWindow) {
            newWindow.document.body.appendChild(video);
            newWindow.document.title = 'Scanner QR Code';
          }
        })
        .catch(err => {
          // Fallback: just alert the user
          alert('Veuillez utiliser l\'appareil photo de votre téléphone pour scanner le QR code');
        });
    } else {
      alert('Veuillez utiliser l\'appareil photo de votre téléphone pour scanner le QR code');
    }
  };

  const toggleQrHint = (hintIndex: number) => {
    setShowQrHints(prev => ({
      ...prev,
      [hintIndex]: !prev[hintIndex]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAttempt();

    const normalizedAnswer = answer.toLowerCase().trim();
    const normalizedCorrectAnswer = mission.answer.toLowerCase().trim();

    if (normalizedAnswer === normalizedCorrectAnswer) {
      setFeedback({
        type: 'success',
        message: 'Bravo ! Tu as résolu l\'énigme !'
      });
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      setFeedback({
        type: 'error',
        message: 'Ce n\'est pas la bonne réponse. Réessaie !'
      });
      
      // Auto-show hint if conditions are met
      const availableHints = getAvailableHints();
      if (availableHints.length > hintsShown && shouldShowHint(hintsShown)) {
        setTimeout(() => {
          onShowHint();
        }, 1000);
      }
    }

    setAnswer('');
  };

  const handlePuzzleComplete = (code: string) => {
    setFeedback({
      type: 'success',
      message: 'Bravo ! Tu as résolu le puzzle et trouvé le code !'
    });
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  useEffect(() => {
    setFeedback({ type: null, message: '' });
  }, [missionId]);

  const availableHints = getAvailableHints();
  const hasQrCodeHints = qrCodeHints[missionId];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-purple-700 hover:text-purple-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour à la carte</span>
            </button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-purple-900">{mission.name}</h1>
              <p className="text-sm text-purple-600">{mission.location}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleOpenRoute}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              >
                <MapPin className="w-4 h-4" />
                <span>Trajet</span>
              </button>
              <div className="text-right text-purple-700">
                <div className="text-xs">Tentatives: {attempts}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Mission Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-purple-100 mb-6">
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-900">Énigme</h2>
                <p className="text-purple-600">Mission {missionId}/5</p>
              </div>
            </div>
            
            <p className="text-lg text-purple-800 leading-relaxed mb-4">
              {mission.description}
            </p>
            
            {/* Mission 3 story - moved up */}
            {mission.content.story && missionId === 3 && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                <p className="text-purple-700 italic">
                  {mission.content.story}
                </p>
              </div>
            )}

            {/* Mission 4 - Image de la Vierge et son enfant */}
            {missionId === 4 && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 text-center">
                  <img
                    src="/mission2/la Vierge et son enfant.png"
                    alt="Statue de la Vierge et son enfant"
                    className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                    style={{ maxHeight: '400px' }}
                  />
                  <p className="text-amber-800 mt-4 font-medium">
                    La statue de la Vierge et son enfant près de l'Atelier des Cousins
                  </p>
                </div>
              </div>
            )}

            {/* QR Code Section for mission 3 - now after story */}
            {hasQrCodeHints && missionId === 3 && (
              <div className="mb-6 p-6 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-amber-800 mb-4 font-medium">
                  Des QR codes sont cachés autour de ce lieu. Vous devez les retrouver pour accéder à l'énigme. 
                  Utilisez les boutons "Indice" ci-dessous pour vous guider.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {qrCodeHints[missionId].map((hint, index) => (
                    <button
                      key={index}
                      onClick={() => toggleQrHint(index)}
                      className="bg-amber-200 hover:bg-amber-300 text-amber-900 px-4 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center space-x-2"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Indice QR code {index + 1}</span>
                    </button>
                  ))}
                </div>

                {/* Show QR hints */}
                {Object.entries(showQrHints).map(([hintIndex, isVisible]) => {
                  if (!isVisible) return null;
                  const index = parseInt(hintIndex);
                  return (
                    <div key={index} className="mb-3 p-4 bg-amber-100 border border-amber-300 rounded-lg">
                      <p className="text-amber-800 whitespace-pre-line">
                        <strong>Indice {index + 1} :</strong> {qrCodeHints[missionId][index]}
                      </p>
                      {/* Ajout de l'image pour l'indice QR code 2 (Majestic) */}
                      {index === 1 && missionId === 3 && (
                        <img src="/mission2/IMG_4646.png" alt="Indice QR code 2" className="mt-2 rounded shadow max-w-xs" />
                      )}
                    </div>
                  );
                })}

                {/* Remplacement du bouton par la phrase */}
                <div className="w-full bg-blue-100 text-blue-900 px-6 py-3 rounded-lg font-semibold flex items-center justify-center mt-2">
                  Scanne ce QR code avec ton appareil photo et reviens ici !
                </div>
              </div>
            )}

            {/* Story for other missions (not mission 3) */}
            {mission.content.story && missionId !== 3 && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-4">
                <p className="text-purple-700 italic">
                  {mission.content.story}
                </p>
              </div>
            )}
          </div>

          {/* Render Puzzle Game for Mission 2 */}
          {missionId === 2 ? (
            <div>
              <PuzzleGame
                onComplete={handlePuzzleComplete}
                onAttempt={onAttempt}
                attempts={attempts}
                hintsShown={hintsShown}
              />
            </div>
          ) : (
            <div>
              {/* Regular Answer Form for other missions */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="answer" className="block text-sm font-medium text-purple-800 mb-2">
                    Ta réponse
                  </label>
                  <input
                    type="text"
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-transparent transition-all duration-200 bg-white/90"
                    placeholder="Tape ta réponse ici..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  Valider ma réponse
                </button>
              </form>
            </div>
          )}

          {/* Feedback */}
          {feedback.type && (
            <div className={`mt-4 p-4 rounded-xl flex items-center space-x-3 ${
              feedback.type === 'success' 
                ? 'bg-green-100 border border-green-200' 
                : 'bg-red-100 border border-red-200'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
              <p className={`font-medium ${
                feedback.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {feedback.message}
              </p>
            </div>
          )}
        </div>

        {/* Hints Section */}
        {availableHints.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              <h3 className="text-lg font-bold text-yellow-800">Indices disponibles</h3>
            </div>
            
            <div className="space-y-3">
              {availableHints.slice(0, hintsShown + 1).map((hint, index) => (
                <div key={index} className="bg-yellow-100 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800">
                    <span className="font-medium">Indice {index + 1}:</span> {hint}
                  </p>
                </div>
              ))}
              
              {hintsShown < availableHints.length - 1 && (
                <button
                  onClick={onShowHint}
                  className="text-yellow-700 hover:text-yellow-900 font-medium transition-colors"
                >
                  Voir l'indice suivant →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};