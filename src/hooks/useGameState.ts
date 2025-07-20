import { useState, useCallback } from 'react';
import { GameState } from '../types/game';
import { GameService } from '../services/gameService';
import { auth } from '../config/firebase';
import { signInAnonymously } from 'firebase/auth';

const initialGameState: GameState = {
  currentPage: 'home',
  currentMission: 0,
  completedMissions: [false, false, false, false, false],
  playerData: {
    pseudo: '',
    email: ''
  },
  missionAttempts: {},
  hintsShown: {}
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const gameService = GameService.getInstance();

  // Charger l'état du jeu depuis Firebase
  const loadGameState = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const player = await gameService.getPlayerByEmail(email);
      if (player) {
        setGameState(player.gameState);
        setPlayerId(player.id!);
      }
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur de chargement:', err);
    } finally {
      setIsLoading(false);
    }
  }, [gameService]);

  // Sauvegarder l'état du jeu dans Firebase
  const saveGameState = useCallback(async (newGameState: GameState) => {
    if (!playerId) return;
    
    try {
      await gameService.updateGameState(playerId, newGameState);
    } catch (err) {
      console.error('Erreur de sauvegarde:', err);
    }
  }, [playerId, gameService]);

  const updatePlayerData = useCallback(async (pseudo: string, email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Authentification anonyme Firebase
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
      // Créer ou récupérer le joueur
      const newPlayerId = await gameService.savePlayer({
        pseudo,
        email,
        gameState: {
          ...gameState,
          playerData: { pseudo, email }
        },
        totalAttempts: 0,
        totalHintsUsed: 0
      });
      setPlayerId(newPlayerId);
      setGameState(prev => ({
        ...prev,
        playerData: { pseudo, email }
      }));
      // Charger l'état existant si le joueur existe déjà
      await loadGameState(email);
    } catch (err) {
      setError('Erreur lors de la création du profil');
      console.error('Erreur updatePlayerData:', err);
    } finally {
      setIsLoading(false);
    }
  }, [gameState, gameService, loadGameState]);

  const navigateToPage = useCallback(async (page: GameState['currentPage']) => {
    const newGameState = {
      ...gameState,
      currentPage: page
    };
    
    setGameState(newGameState);
    await saveGameState(newGameState);
  }, [gameState, saveGameState]);

  const startMission = useCallback(async (missionId: number) => {
    const newGameState = {
      ...gameState,
      currentPage: 'mission' as const,
      currentMission: missionId
    };
    
    setGameState(newGameState);
    await saveGameState(newGameState);
  }, [gameState, saveGameState]);

  const completeMission = useCallback(async (missionId: number) => {
    if (!playerId) return;
    
    try {
      const attempts = gameState.missionAttempts[missionId] || 0;
      const hintsUsed = gameState.hintsShown[missionId] || 0;
      
      // Marquer la mission comme terminée dans Firebase
      await gameService.completeMission(playerId, missionId, attempts, hintsUsed);
      
      const newCompletedMissions = [...gameState.completedMissions];
      newCompletedMissions[missionId - 1] = true;
      
      const newGameState = {
        ...gameState,
        completedMissions: newCompletedMissions,
        currentPage: 'map' as const
      };
      
      setGameState(newGameState);
      
      // Vérifier si toutes les missions sont terminées
      if (newCompletedMissions.every(Boolean)) {
        // Envoyer l'email de félicitations
        await gameService.sendCompletionEmail(
          gameState.playerData.email,
          gameState.playerData.pseudo
        );
      }
    } catch (err) {
      setError('Erreur lors de la validation de la mission');
      console.error('Erreur completeMission:', err);
    }
  }, [gameState, playerId, gameService]);

  const addAttempt = useCallback(async (missionId: number) => {
    const newGameState = {
      ...gameState,
      missionAttempts: {
        ...gameState.missionAttempts,
        [missionId]: (gameState.missionAttempts[missionId] || 0) + 1
      }
    };
    
    setGameState(newGameState);
    await saveGameState(newGameState);
  }, [gameState, saveGameState]);

  const showHint = useCallback(async (missionId: number) => {
    const newGameState = {
      ...gameState,
      hintsShown: {
        ...gameState.hintsShown,
        [missionId]: (gameState.hintsShown[missionId] || 0) + 1
      }
    };
    
    setGameState(newGameState);
    await saveGameState(newGameState);
  }, [gameState, saveGameState]);

  const resetGame = useCallback(async () => {
    const newGameState = initialGameState;
    setGameState(newGameState);
    setPlayerId(null);
    
    if (playerId) {
      await saveGameState(newGameState);
    }
  }, [playerId, saveGameState]);

  return {
    gameState,
    playerId,
    isLoading,
    error,
    updatePlayerData,
    navigateToPage,
    startMission,
    completeMission,
    addAttempt,
    showHint,
    resetGame,
    loadGameState
  };
};