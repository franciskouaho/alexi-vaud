import React, { useState } from 'react';
import { MapPin, Search, Trophy, Mail, User, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onStartGame: (pseudo: string, email: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartGame }) => {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pseudo.trim() && email.trim()) {
      setIsSubmitting(true);
      try {
        await onStartGame(pseudo.trim(), email.trim());
      } catch (error) {
        console.error('Erreur lors de la création du joueur ou du démarrage:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 to-orange-200/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-amber-900 mb-6 tracking-tight">
              Xploria
            </h1>
            <p className="text-xl md:text-2xl text-amber-800 mb-12 max-w-3xl mx-auto leading-relaxed">
              Découvre les secrets cachés de Châtelaillon-Plage dans cette aventure immersive
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
            <div className="bg-gradient-to-br from-orange-400 to-amber-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Résous le mystère</h3>
            <p className="text-amber-700 leading-relaxed">
              Chaque lieu cache une énigme unique qui te mènera vers la vérité cachée de Châtelaillon.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
            <div className="bg-gradient-to-br from-blue-400 to-cyan-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Débloque les lieux un à un</h3>
            <p className="text-amber-700 leading-relaxed">
              Une progression logique et immersive à travers les sites emblématiques de la ville.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-orange-100">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Donne ton verdict final</h3>
            <p className="text-amber-700 leading-relaxed">
              À la fin de l'enquête, une mission spéciale t'attend pour nous aider à rendre cette aventure inoubliable.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-orange-200">
            <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
              Commence ton aventure
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="pseudo" className="block text-sm font-medium text-amber-800 mb-2">
                  Pseudo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
                  <input
                    type="text"
                    id="pseudo"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-200 bg-white/90"
                    placeholder="Ton nom d'aventurier"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-600" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-300 focus:border-transparent transition-all duration-200 bg-white/90"
                    placeholder="ton@email.com"
                    required
                  />
                </div>
                <p className="text-xs text-amber-600 mt-2">
                  Ton QR code de récompense sera envoyé à cette adresse
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center justify-center space-x-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Chargement...</span>
                  </>
                ) : (
                  <>
                    <span>Commencer l'aventure</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};