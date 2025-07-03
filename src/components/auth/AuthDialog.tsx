"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Zap, Users, ChevronRight, Sparkles, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AuthDialogProps {
  open: boolean;
  onLogin: () => void;
  onSkip: () => void;
}

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export const AuthDialog = ({ open, onLogin, onSkip, isFirstTime = true, user }: {
  open: boolean;
  onLogin: () => void;
  onSkip: () => void;
  isFirstTime?: boolean;
  user?: TelegramUser | null;
}) => {
  const features = [
    {
      icon: Trophy,
      title: "P2P Споры",
      description: "Создавайте споры и участвуйте в них на спортивных событиях",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: Shield,
      title: "Безопасность",
      description: "Автоматический расчет результатов через API",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Быстрые выплаты",
      description: "Получайте выигрыш сразу после завершения события",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Сообщество",
      description: "Общайтесь с другими участниками в чате",
      color: "from-pink-500 to-rose-500"
    }
  ];

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={() => {}}>
          <DialogContent className="max-w-md mx-auto p-0 border-0 shadow-2xl bg-transparent">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="overflow-hidden"
            >
              <Card className="glass-card border-none overflow-hidden shadow-xl bg-white/50 dark:bg-white/20">
                {/* Градиентный фон вверху - более светлый */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-300/30 via-purple-300/30 to-pink-300/30 backdrop-blur-xl -z-10"></div>

                {/* Декоративные элементы - более светлые */}
                <div className="absolute top-12 left-10 w-20 h-20 rounded-full bg-blue-300/20 blur-2xl"></div>
                <div className="absolute top-20 right-10 w-16 h-16 rounded-full bg-purple-300/20 blur-2xl"></div>

                <CardHeader className="text-center pb-4 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, type: "spring" }}
                  >
                    <div className="relative w-20 h-20 mx-auto mb-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-sm animate-pulse"></div>
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -right-1 -top-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-1.5 flex items-center justify-center shadow-lg">
                        <Sparkles className="h-3 w-3 text-white" />
                      </div>
                    </div>

                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {user ? `Привет, ${user.first_name}!` : 'Sports Betting'}
                    </CardTitle>
                    <p className="text-sm text-foreground/80 mt-2 max-w-xs mx-auto">
                      {user
                        ? 'Готовы начать делать споры на спортивных событиях?'
                        : 'P2P споры на спортивных событиях с криптооплатежами'
                      }
                    </p>
                  </motion.div>
                </CardHeader>

                <CardContent className="space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-3">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                      >
                        <Card className="p-3 h-full border-none bg-white/30 dark:bg-white/10 backdrop-blur-md hover:bg-white/40 dark:hover:bg-white/15 transition-all rounded-xl overflow-hidden relative">
                          <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${feature.color}`}></div>
                          <div className="flex flex-col items-center text-center space-y-2 relative z-10">
                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md`}>
                              <feature.icon className="h-4 w-4 text-white" />
                            </div>
                            <h4 className="font-semibold text-sm">{feature.title}</h4>
                            <p className="text-xs text-foreground/70 leading-snug">
                              {feature.description}
                            </p>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary" className="bg-white/40 dark:bg-white/20 border-none text-xs font-medium px-3 py-1 rounded-full">
                      TON
                    </Badge>
                    <Badge variant="secondary" className="bg-white/40 dark:bg-white/20 border-none text-xs font-medium px-3 py-1 rounded-full">
                      STARS
                    </Badge>
                    <Badge variant="secondary" className="bg-white/40 dark:bg-white/20 border-none text-xs font-medium px-3 py-1 rounded-full">
                      Real-time
                    </Badge>
                    <Badge variant="secondary" className="bg-white/40 dark:bg-white/20 border-none text-xs font-medium px-3 py-1 rounded-full">
                      P2P
                    </Badge>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="space-y-3 pt-2"
                  >
                    <Button
                      onClick={onLogin}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none relative overflow-hidden shadow-lg group"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-semibold">{user ? 'Начать приключение' : 'Начать'}</span>
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={onSkip}
                      className="w-full text-foreground/70 hover:text-foreground hover:bg-white/10"
                      size="sm"
                    >
                      {user ? 'Пропустить объяснение' : 'Пропустить'}
                    </Button>
                  </motion.div>

                  <p className="text-xs text-foreground/60 text-center leading-relaxed">
                    Продолжая, вы соглашаетесь с{" "}
                    <span className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">условиями использования</span> и{" "}
                    <span className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">политикой конфиденциальности</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
