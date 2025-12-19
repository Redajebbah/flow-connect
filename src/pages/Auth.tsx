import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Droplets, Zap, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function Auth() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Identifiants incorrects', {
              description: 'Vérifiez votre email et mot de passe',
            });
          } else {
            toast.error('Erreur de connexion', { description: error.message });
          }
        } else {
          toast.success('Connexion réussie');
          navigate('/');
        }
      } else {
        if (!formData.firstName || !formData.lastName) {
          toast.error('Veuillez remplir tous les champs');
          setLoading(false);
          return;
        }
        
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName
        );
        
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Cet email est déjà utilisé', {
              description: 'Connectez-vous ou utilisez un autre email',
            });
          } else {
            toast.error('Erreur d\'inscription', { description: error.message });
          }
        } else {
          toast.success('Compte créé avec succès!', {
            description: 'Vous êtes maintenant connecté',
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-secondary">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">UTILITY</h1>
              <p className="text-xs text-white/70 uppercase tracking-wider">
                Gestion Abonnements
              </p>
            </div>
          </div>

          <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
            Digitalisez votre processus d'abonnement
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-lg">
            Gérez efficacement les demandes d'abonnement eau et électricité, 
            du dépôt du dossier jusqu'à l'activation du compteur.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              'Suivi des dossiers',
              'Gestion documentaire',
              'Workflow automatisé',
              'Traçabilité complète',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-white/90">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-20 -right-10 w-40 h-40 rounded-full bg-secondary/20" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-secondary">
                <Droplets className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500">
                <Zap className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">UTILITY</h1>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? 'Bienvenue' : 'Créer un compte'}
            </h2>
            <p className="text-muted-foreground">
              {isLogin
                ? 'Connectez-vous pour accéder à votre espace'
                : 'Inscrivez-vous pour commencer'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      placeholder="Jean"
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      placeholder="Dupont"
                      className="pl-10"
                      required={!isLogin}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="vous@entreprise.fr"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Se connecter' : 'Créer mon compte'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? (
                <>
                  Pas encore de compte ?{' '}
                  <span className="font-medium text-primary">S'inscrire</span>
                </>
              ) : (
                <>
                  Déjà un compte ?{' '}
                  <span className="font-medium text-primary">Se connecter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
