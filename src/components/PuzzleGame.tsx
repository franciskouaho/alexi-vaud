import React, { useState, useEffect } from 'react';
import { Shuffle, RotateCcw, CheckCircle, QrCode, Camera } from 'lucide-react';

interface PuzzleGameProps {
  onComplete: (code: string) => void;
  onAttempt: () => void;
  attempts: number;
  hintsShown: number;
}

interface PuzzlePiece {
  id: number;
  currentPosition: number;
  correctPosition: number;
  imageUrl: string;
  displayNumber: number;
}

// QR Code hints for mission 2
const qrCodeHints = [
  "Le premier est placé sur le 3ᵉ lampadaire le plus proche de vous quand vous êtes situé en face des statues",
  "Celui-ci est placé sur une surface plate derrière les statues",
  "Une gouttière vous donnera le 3ᵉ"
];

export const PuzzleGame: React.FC<PuzzleGameProps> = ({
  onComplete,
  onAttempt,
  attempts,
  hintsShown
}) => {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isPuzzleComplete, setIsPuzzleComplete] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [showQrHints, setShowQrHints] = useState<{ [key: number]: boolean }>({});

  // Initialize puzzle pieces with correct placement mapping
  useEffect(() => {
    const initialPieces: PuzzlePiece[] = [
      { id: 1, currentPosition: 1, correctPosition: 1, imageUrl: '/mission2/placement1-n7.jpeg', displayNumber: 7 },
      { id: 2, currentPosition: 2, correctPosition: 2, imageUrl: '/mission2/placement2 - N°4.jpeg', displayNumber: 4 },
      { id: 3, currentPosition: 3, correctPosition: 3, imageUrl: '/mission2/placement3 - N°10.jpeg', displayNumber: 10 },
      { id: 4, currentPosition: 4, correctPosition: 4, imageUrl: '/mission2/placement4 - N°1.jpeg', displayNumber: 1 },
      { id: 5, currentPosition: 5, correctPosition: 5, imageUrl: '/mission2/placement5 - N°12.jpeg', displayNumber: 12 },
      { id: 6, currentPosition: 6, correctPosition: 6, imageUrl: '/mission2/placement6 - N°2.jpeg', displayNumber: 2 },
      { id: 7, currentPosition: 7, correctPosition: 7, imageUrl: '/mission2/placement7 - N°3.jpeg', displayNumber: 3 },
      { id: 8, currentPosition: 8, correctPosition: 8, imageUrl: '/mission2/placement8 - N°11.jpeg', displayNumber: 11 },
      { id: 9, currentPosition: 9, correctPosition: 9, imageUrl: '/mission2/placement9 - N°5.jpeg', displayNumber: 5 },
      { id: 10, currentPosition: 10, correctPosition: 10, imageUrl: '/mission2/placement10 - N°9.jpeg', displayNumber: 9 },
      { id: 11, currentPosition: 11, correctPosition: 11, imageUrl: '/mission2/placement11 - N°6.jpeg', displayNumber: 6 },
      { id: 12, currentPosition: 12, correctPosition: 12, imageUrl: '/mission2/placement12 - N°8.jpeg', displayNumber: 8 }
    ];

    // Shuffle the pieces
    const shuffled = [...initialPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i].currentPosition, shuffled[j].currentPosition] = 
      [shuffled[j].currentPosition, shuffled[i].currentPosition];
    }
    
    setPieces(shuffled);
  }, []);

  const handleDragStart = (e: React.DragEvent, pieceId: number) => {
    setDraggedPiece(pieceId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPosition: number) => {
    e.preventDefault();
    
    if (draggedPiece === null) return;

    setPieces(prevPieces => {
      const newPieces = [...prevPieces];
      const draggedIndex = newPieces.findIndex(p => p.id === draggedPiece);
      const targetIndex = newPieces.findIndex(p => p.currentPosition === targetPosition);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        // Swap positions
        const temp = newPieces[draggedIndex].currentPosition;
        newPieces[draggedIndex].currentPosition = newPieces[targetIndex].currentPosition;
        newPieces[targetIndex].currentPosition = temp;
      }
      
      return newPieces;
    });
    
    setDraggedPiece(null);
  };

  const checkPuzzleComplete = () => {
    const isComplete = pieces.every(piece => piece.currentPosition === piece.correctPosition);
    setIsPuzzleComplete(isComplete);
    return isComplete;
  };

  useEffect(() => {
    checkPuzzleComplete();
  }, [pieces]);

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAttempt();
    
    // The correct code is now "678"
    const correctCode = "678";
    
    if (selectedCode === correctCode) {
      onComplete(selectedCode);
    }
  };

  const shufflePieces = () => {
    setPieces(prevPieces => {
      const shuffled = [...prevPieces];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i].currentPosition, shuffled[j].currentPosition] = 
        [shuffled[j].currentPosition, shuffled[i].currentPosition];
      }
      return shuffled;
    });
    setIsPuzzleComplete(false);
  };

  const resetPuzzle = () => {
    setPieces(prevPieces => 
      prevPieces.map(piece => ({
        ...piece,
        currentPosition: piece.correctPosition
      }))
    );
    setIsPuzzleComplete(true);
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

  // Sort pieces by current position for display
  const sortedPieces = [...pieces].sort((a, b) => a.currentPosition - b.currentPosition);

  return (
    <div className="space-y-6">
      {/* Puzzle Grid */}
      <div className="bg-white/90 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-purple-900">Reconstitue le puzzle</h3>
          <div className="flex space-x-2">
            <button
              onClick={shufflePieces}
              className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
              title="Mélanger"
            >
              <Shuffle className="w-5 h-5 text-purple-600" />
            </button>
            <button
              onClick={resetPuzzle}
              className="p-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
              title="Réinitialiser"
            >
              <RotateCcw className="w-5 h-5 text-purple-600" />
            </button>
          </div>
        </div>

        {/* 3x4 Grid */}
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {Array.from({ length: 12 }, (_, index) => {
            const position = index + 1;
            const piece = sortedPieces.find(p => p.currentPosition === position);
            
            return (
              <div
                key={position}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 relative"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, position)}
              >
                {piece && (
                  <img
                    src={piece.imageUrl}
                    alt={`Pièce ${piece.displayNumber}`}
                    className="w-full h-full object-cover cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, piece.id)}
                  />
                )}
                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                  {piece?.displayNumber || '?'}
                </div>
              </div>
            );
          })}
        </div>

        {isPuzzleComplete && (
          <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-xl flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-green-800 font-medium">
              Puzzle reconstitué ! Maintenant, trouve le code caché.
            </p>
          </div>
        )}
      </div>

      {/* QR Code Section - directement après le puzzle */}
      <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
        <p className="text-amber-800 mb-4 font-medium">
          Des QR codes sont cachés autour de ce lieu. Vous devez les retrouver pour accéder à l'énigme. 
          Utilisez les boutons "Indice" ci-dessous pour vous guider.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {qrCodeHints.map((hint, index) => (
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
          // Affiche l'image uniquement pour l'indice 2 du Majestic (mission 3)
          const isMajestic = typeof window !== 'undefined' && window.location.pathname.includes('majestic');
          return (
            <div key={index} className="mb-3 p-4 bg-amber-100 border border-amber-300 rounded-lg">
              <p className="text-amber-800 whitespace-pre-line">
                <strong>Indice {index + 1} :</strong> {qrCodeHints[index]}
              </p>
              {index === 1 && isMajestic && (
                <img src="/mission2/IMG_4646.png" alt="Indice QR code 2" className="mt-2 rounded shadow max-w-[250px] w-full h-auto object-contain mx-auto" style={{maxWidth: '90%', height: 'auto'}} />
              )}
            </div>
          );
        })}

        {/* Remplacement du bouton par la phrase */}
        <div className="w-full bg-blue-100 text-blue-900 px-6 py-3 rounded-lg font-semibold flex items-center justify-center mt-2">
          Scanne ce QR code avec ton appareil photo et reviens ici !
        </div>
      </div>

      {/* Code Extraction Interface - après les QR codes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-yellow-800 mb-4">Trouve le code secret</h3>
        
        <div className="space-y-4">
          <p className="text-yellow-700">
            Utilise les indices pour identifier les bons blocs et extraire le code :
          </p>
          
          {/* Hints will be shown based on attempts */}
          {hintsShown >= 1 && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
              <p className="text-yellow-800">
                <strong>Indice 1 :</strong> Le chiffre en face de la ligne t'indique la photo à garder
              </p>
            </div>
          )}
          
          {hintsShown >= 2 && (
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
              <p className="text-yellow-800">
                <strong>Indice 2 :</strong> Une suite de chiffres apparaîtra si tu suis bien les consignes
              </p>
            </div>
          )}

          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-yellow-800 mb-2">
                Code secret
              </label>
              <input
                type="text"
                id="code"
                value={selectedCode}
                onChange={(e) => setSelectedCode(e.target.value)}
                className="w-full px-4 py-3 border border-yellow-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 bg-white/90"
                placeholder="Entre le code trouvé..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
            >
              Valider le code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};