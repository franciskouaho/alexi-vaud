import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { GameState } from '../types/game';

export interface PlayerData {
  id?: string;
  pseudo: string;
  email: string;
  createdAt: Timestamp;
  lastActivity: Timestamp;
  gameState: GameState;
  completedAt?: Timestamp;
  totalAttempts: number;
  totalHintsUsed: number;
}

export interface GameSession {
  id?: string;
  playerId: string;
  missionId: number;
  attempts: number;
  hintsUsed: number;
  completed: boolean;
  completedAt?: Timestamp;
  startedAt: Timestamp;
}

export class GameService {
  private static instance: GameService;
  
  public static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }

  // Créer ou mettre à jour un joueur
  async savePlayer(playerData: Omit<PlayerData, 'id' | 'createdAt' | 'lastActivity'>): Promise<string> {
    try {
      // Vérifier si le joueur existe déjà par email
      const existingPlayer = await this.getPlayerByEmail(playerData.email);
      
      if (existingPlayer) {
        // Mettre à jour le joueur existant
        await updateDoc(doc(db, 'players', existingPlayer.id!), {
          ...playerData,
          lastActivity: serverTimestamp()
        });
        return existingPlayer.id!;
      } else {
        // Créer un nouveau joueur
        const docRef = await addDoc(collection(db, 'players'), {
          ...playerData,
          createdAt: serverTimestamp(),
          lastActivity: serverTimestamp(),
          totalAttempts: 0,
          totalHintsUsed: 0
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du joueur:', error);
      throw error;
    }
  }

  // Récupérer un joueur par email
  async getPlayerByEmail(email: string): Promise<PlayerData | null> {
    try {
      const q = query(collection(db, 'players'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as PlayerData;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du joueur:', error);
      throw error;
    }
  }

  // Récupérer un joueur par ID
  async getPlayer(playerId: string): Promise<PlayerData | null> {
    try {
      const docRef = doc(db, 'players', playerId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as PlayerData;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du joueur:', error);
      throw error;
    }
  }

  // Mettre à jour l'état du jeu d'un joueur
  async updateGameState(playerId: string, gameState: GameState): Promise<void> {
    try {
      const playerRef = doc(db, 'players', playerId);
      await updateDoc(playerRef, {
        gameState,
        lastActivity: serverTimestamp()
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'état du jeu:', error);
      throw error;
    }
  }

  // Enregistrer une session de mission
  async saveGameSession(session: Omit<GameSession, 'id' | 'startedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'gameSessions'), {
        ...session,
        startedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la session:', error);
      throw error;
    }
  }

  // Mettre à jour une session de mission
  async updateGameSession(sessionId: string, updates: Partial<GameSession>): Promise<void> {
    try {
      const sessionRef = doc(db, 'gameSessions', sessionId);
      await updateDoc(sessionRef, updates);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la session:', error);
      throw error;
    }
  }

  // Marquer une mission comme terminée
  async completeMission(playerId: string, missionId: number, attempts: number, hintsUsed: number): Promise<void> {
    try {
      // Mettre à jour les statistiques du joueur
      const playerRef = doc(db, 'players', playerId);
      const playerDoc = await getDoc(playerRef);
      
      if (playerDoc.exists()) {
        const currentData = playerDoc.data() as PlayerData;
        const newGameState = { ...currentData.gameState };
        newGameState.completedMissions[missionId - 1] = true;
        
        // Vérifier si toutes les missions sont terminées
        const allCompleted = newGameState.completedMissions.every(Boolean);
        
        await updateDoc(playerRef, {
          gameState: newGameState,
          totalAttempts: (currentData.totalAttempts || 0) + attempts,
          totalHintsUsed: (currentData.totalHintsUsed || 0) + hintsUsed,
          lastActivity: serverTimestamp(),
          ...(allCompleted && { completedAt: serverTimestamp() })
        });
      }
    } catch (error) {
      console.error('Erreur lors de la completion de la mission:', error);
      throw error;
    }
  }

  // Récupérer les statistiques globales
  async getGlobalStats(): Promise<{
    totalPlayers: number;
    completedGames: number;
    averageAttempts: number;
    popularMissions: { missionId: number; attempts: number }[];
  }> {
    try {
      const playersSnapshot = await getDocs(collection(db, 'players'));
      const sessionsSnapshot = await getDocs(collection(db, 'gameSessions'));
      
      const totalPlayers = playersSnapshot.size;
      const completedGames = playersSnapshot.docs.filter(doc => 
        doc.data().completedAt
      ).length;
      
      const totalAttempts = playersSnapshot.docs.reduce((sum, doc) => 
        sum + (doc.data().totalAttempts || 0), 0
      );
      const averageAttempts = totalPlayers > 0 ? totalAttempts / totalPlayers : 0;
      
      // Analyser les missions populaires
      const missionStats: { [key: number]: number } = {};
      sessionsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        missionStats[data.missionId] = (missionStats[data.missionId] || 0) + data.attempts;
      });
      
      const popularMissions = Object.entries(missionStats)
        .map(([missionId, attempts]) => ({ missionId: parseInt(missionId), attempts }))
        .sort((a, b) => b.attempts - a.attempts);
      
      return {
        totalPlayers,
        completedGames,
        averageAttempts,
        popularMissions
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  // Envoyer un email de félicitations (simulation)
  async sendCompletionEmail(playerEmail: string, playerName: string): Promise<void> {
    try {
      // Dans un vrai projet, vous utiliseriez Firebase Functions ou un service d'email
      console.log(`Email de félicitations envoyé à ${playerEmail} pour ${playerName}`);
      
      // Ici vous pourriez intégrer avec:
      // - Firebase Functions pour envoyer des emails
      // - Un service comme SendGrid, Mailgun, etc.
      // - Firebase Extensions pour l'envoi d'emails
      
      // Pour l'instant, on simule l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  }
}