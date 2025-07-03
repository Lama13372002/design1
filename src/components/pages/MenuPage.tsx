"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Wallet,
  Settings,
  HelpCircle,
  Plus,
  Minus,
  Globe,
  Palette,
  Bell,
  Volume2,
  Vibrate,
  ChevronRight,
  ChevronDown,
  Coins,
  Star,
  TrendingUp,
  Shield,
  User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTelegram } from "@/components/providers/TelegramProvider";

const faqs = [
  {
    id: "1",
    question: "Как создать спор?",
    answer: "Нажмите \"Создать спор\" на главной → выберите событие → укажите сумму → подтвердите."
  },
  {
    id: "2",
    question: "Как вывести средства?",
    answer: "В меню → Баланс → Вывод. Средства поступят на ваш Telegram Wallet."
  },
  {
    id: "3",
    question: "Что происходит при отмене матча?",
    answer: "Все ставки автоматически возвращаются участникам в полном объеме."
  },
  {
    id: "4",
    question: "Какая комиссия сервиса?",
    answer: "10% с каждого участника спора при выигрыше."
  },
  {
    id: "5",
    question: "Как работает автоматический расчет?",
    answer: "Результаты определяются через API-FOOTBALL в режиме реального времени."
  }
];

export const MenuPage = () => {
  const { user } = useTelegram();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    language: "ru",
    theme: "system",
    notifications: true,
    sound: true,
    vibration: true
  });

  // Mock balance data
  const balance = {
    TON: 12.45,
    STARS: 2340
  };

  const handleDeposit = (currency: "TON" | "STARS") => {
    alert(`Пополнение ${currency} через Telegram Wallet`);
  };

  const handleWithdraw = (currency: "TON" | "STARS") => {
    alert(`Вывод ${currency} на Telegram Wallet`);
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="p-4 space-y-6">
      {/* User Profile */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                @{user?.username || "unknown"}
              </p>
              {user?.is_premium && (
                <Badge className="mt-1 bg-gradient-to-r from-yellow-500 to-orange-500">
                  Premium
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Статистика</p>
              <p className="font-semibold">85% побед</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Баланс</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TON Balance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Coins className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">TON</p>
                  <p className="text-sm text-muted-foreground">Toncoin</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{balance.TON}</p>
                <p className="text-sm text-muted-foreground">≈ $25.40</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleDeposit("TON")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Пополнить
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleWithdraw("TON")}
              >
                <Minus className="h-4 w-4 mr-2" />
                Вывести
              </Button>
            </div>
          </div>

          <Separator />

          {/* STARS Balance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold">STARS</p>
                  <p className="text-sm text-muted-foreground">Telegram Stars</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{balance.STARS}</p>
                <p className="text-sm text-muted-foreground">≈ $23.40</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleDeposit("STARS")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Пополнить
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleWithdraw("STARS")}
              >
                <Minus className="h-4 w-4 mr-2" />
                Вывести
              </Button>
            </div>
          </div>

          <Separator />

          <div className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Защищено Telegram Wallet</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Настройки</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <span>Язык</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={settings.language === "ru" ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings({...settings, language: "ru"})}
              >
                РУС
              </Button>
              <Button
                variant={settings.language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings({...settings, language: "en"})}
              >
                ENG
              </Button>
            </div>
          </div>

          <Separator />

          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <span>Тема</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={settings.theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings({...settings, theme: "light"})}
              >
                Светлая
              </Button>
              <Button
                variant={settings.theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings({...settings, theme: "dark"})}
              >
                Темная
              </Button>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span>Уведомления</span>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
              />
            </div>

            {settings.notifications && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-8 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Звук</span>
                  </div>
                  <Switch
                    checked={settings.sound}
                    onCheckedChange={(checked) => setSettings({...settings, sound: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Vibrate className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Вибрация</span>
                  </div>
                  <Switch
                    checked={settings.vibration}
                    onCheckedChange={(checked) => setSettings({...settings, vibration: checked})}

                  />
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Часто задаваемые вопросы</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="border border-border rounded-lg overflow-hidden cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="p-3 flex items-center justify-between">
                  <span className="font-medium text-sm">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-3 pb-3 pt-0">
                        <Separator className="mb-3" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
