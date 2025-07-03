"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Shield, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";

interface AuthDialogProps {
  open: boolean;
  onLogin: () => void;
  onSkip: () => void;
}

export const AuthDialog = ({ open, onLogin, onSkip }: AuthDialogProps) => {
  const features = [
    {
      icon: TrendingUp,
      title: "P2P Споры",
      description: "Создавайте споры и участвуйте в них на спортивных событиях"
    },
    {
      icon: Shield,
      title: "Безопасность",
      description: "Автоматический расчет результатов через API"
    },
    {
      icon: Zap,
      title: "Мгновенные выплаты",
      description: "Получайте выигрыш сразу после завершения события"
    },
    {
      icon: Users,
      title: "Сообщество",
      description: "Общайтесь с другими участниками в чате"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md mx-auto p-0 border-0 bg-transparent">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-card/95 backdrop-blur-sm border border-border/50">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Sports Betting
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground mt-2">
                  P2P споры на спортивных событиях с криптооплатежами
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="p-3 h-full border border-border/50 hover:border-border transition-colors">
                      <div className="flex flex-col items-center text-center space-y-2">
                        <feature.icon className="h-5 w-5 text-primary" />
                        <h4 className="font-semibold text-xs">{feature.title}</h4>
                        <p className="text-xs text-muted-foreground leading-tight">
                          {feature.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 justify-center pt-2">
                <Badge variant="secondary" className="text-xs">
                  TON
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  STARS
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Real-time
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  P2P
                </Badge>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-3 pt-4"
              >
                <Button
                  onClick={onLogin}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                  size="lg"
                >
                  Начать
                </Button>

                <Button
                  variant="ghost"
                  onClick={onSkip}
                  className="w-full text-muted-foreground hover:text-foreground"
                  size="sm"
                >
                  Пропустить
                </Button>
              </motion.div>

              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                Продолжая, вы соглашаетесь с{" "}
                <span className="text-primary">условиями использования</span> и{" "}
                <span className="text-primary">политикой конфиденциальности</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
