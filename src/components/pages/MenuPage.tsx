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
  User,
  Crown,
  Sparkles,
  DollarSign,
  History,
  Zap,
  Bookmark
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
    // Предполагаем, что эта функция будет вызывать Telegram Wallet API для пополнения средств
    const amount = currency === "TON" ? "5" : "1000";
    alert(`Запрос на пополнение ${amount} ${currency} через Telegram Wallet отправлен`);
  };

  const handleWithdraw = (currency: "TON" | "STARS") => {
    // Предполагаем, что эта функция будет вызывать Telegram Wallet API для вывода средств
    const available = currency === "TON" ? balance.TON : balance.STARS;
    alert(`Запрос на вывод ${available} ${currency} на Telegram Wallet отправлен`);
  };

  const handleLanguageChange = (language: string) => {
    setSettings({ ...settings, language });
    alert(`Язык изменен на ${language === "ru" ? "русский" : "английский"}`);
  };

  const handleThemeChange = (theme: string) => {
    setSettings({ ...settings, theme });
    alert(`Тема изменена на ${theme === "light" ? "светлую" : "темную"}`);
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setSettings({ ...settings, notifications: checked });
    alert(`Уведомления ${checked ? "включены" : "выключены"}`);
  };

  const handleSoundToggle = (checked: boolean) => {
    setSettings({ ...settings, sound: checked });
    alert(`Звук ${checked ? "включен" : "выключен"}`);
  };

  const handleVibrationToggle = (checked: boolean) => {
    setSettings({ ...settings, vibration: checked });
    alert(`Вибрация ${checked ? "включена" : "выключена"}`);
  };

  const handleViewTransactions = () => {
    alert("История транзакций будет доступна в следующей версии приложения");
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* User Profile */}
      <Card className="glass-card border-none overflow-hidden relative shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl"></div>
        <CardContent className="p-5 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-18 h-18 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                <User className="h-9 w-9 text-white" />
              </div>
              {user?.is_premium && (
                <div className="absolute -right-1 -top-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-1.5 flex items-center justify-center shadow-lg">
                  <Crown className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-sm text-foreground/70 flex items-center space-x-1">
                <span>@{user?.username || "unknown"}</span>
              </p>
              {user?.is_premium && (
                <Badge className="mt-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-white border-none font-medium">
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-3 w-3" />
                    <span>Premium</span>
                  </div>
                </Badge>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-foreground/70">Статистика</p>
              <p className="font-semibold flex items-center justify-end space-x-1">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span>85% побед</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balance */}
      <Card className="glass-card border-none overflow-hidden relative shadow-md">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-xl"></div>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-blue-400" />
            <span>Баланс</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TON Balance */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                  <Coins className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">TON</p>
                  <p className="text-sm text-foreground/70">Toncoin</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">{balance.TON}</p>
                <p className="text-sm text-foreground/70">≈ $25.40</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                onClick={() => handleDeposit("TON")}
              >
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Пополнить</span>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                onClick={() => handleWithdraw("TON")}
              >
                <div className="flex items-center space-x-2">
                  <Minus className="h-4 w-4" />
                  <span>Вывести</span>
                </div>
              </Button>
            </div>
          </div>

          <Separator className="bg-white/10" />

          {/* STARS Balance */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-md relative overflow-hidden">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">STARS</p>
                  <p className="text-sm text-foreground/70">Telegram Stars</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 text-transparent bg-clip-text">{balance.STARS}</p>
                <p className="text-sm text-foreground/70">≈ $23.40</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                onClick={() => handleDeposit("STARS")}
              >
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Пополнить</span>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                onClick={() => handleWithdraw("STARS")}
              >
                <div className="flex items-center space-x-2">
                  <Minus className="h-4 w-4" />
                  <span>Вывести</span>
                </div>
              </Button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <History className="h-4 w-4 text-blue-400" />
                <span>Недавние транзакции</span>
              </div>
              <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0 hover:bg-white/10" onClick={handleViewTransactions}>
                <ChevronRight className="h-4 w-4 text-foreground/70" />
              </Button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-foreground/70">Защищено</span>
              </div>
              <span className="text-foreground/70">Telegram Wallet</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card className="glass-card border-none overflow-hidden relative shadow-md">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-xl"></div>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-400" />
            <span>Настройки</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Language */}
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-blue-400" />
              <span>Язык</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={settings.language === "ru" ? "default" : "outline"}
                size="sm"
                onClick={() => handleLanguageChange("ru")}
                className={`rounded-full ${
                  settings.language === "ru"
                    ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white border-none"
                    : "bg-white/5 backdrop-blur-sm border border-white/10"
                }`}
              >
                РУС
              </Button>
              <Button
                variant={settings.language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => handleLanguageChange("en")}
                className={`rounded-full ${
                  settings.language === "en"
                    ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white border-none"
                    : "bg-white/5 backdrop-blur-sm border border-white/10"
                }`}
              >
                ENG
              </Button>
            </div>
          </div>

          {/* Theme */}
          <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="h-5 w-5 text-blue-400" />
              <span>Тема</span>
            </div>
            <div className="flex space-x-2">
              <Button
                variant={settings.theme === "light" ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange("light")}
                className={`rounded-full ${
                  settings.theme === "light"
                    ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white border-none"
                    : "bg-white/5 backdrop-blur-sm border border-white/10"
                }`}
              >
                Светлая
              </Button>
              <Button
                variant={settings.theme === "dark" ? "default" : "outline"}
                size="sm"
                onClick={() => handleThemeChange("dark")}
                className={`rounded-full ${
                  settings.theme === "dark"
                    ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white border-none"
                    : "bg-white/5 backdrop-blur-sm border border-white/10"
                }`}
              >
                Темная
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5 text-blue-400" />
                <span>Уведомления</span>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={handleNotificationsToggle}
                className="data-[state=checked]:bg-gradient-to-r from-blue-400 to-purple-500"
              />
            </div>

            {settings.notifications && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="pl-8 space-y-3"
              >
                <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Volume2 className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">Звук</span>
                  </div>
                  <Switch
                    checked={settings.sound}
                    onCheckedChange={handleSoundToggle}
                    className="data-[state=checked]:bg-gradient-to-r from-blue-400 to-purple-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Vibrate className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">Вибрация</span>
                  </div>
                  <Switch
                    checked={settings.vibration}
                    onCheckedChange={handleVibrationToggle}
                    className="data-[state=checked]:bg-gradient-to-r from-blue-400 to-purple-500"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="glass-card border-none overflow-hidden relative shadow-md">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-xl"></div>
        <CardHeader className="pb-2 pt-4">
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-blue-400" />
            <span>Часто задаваемые вопросы</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bookmark className="h-4 w-4 text-blue-400" />
                    <span className="font-medium text-sm">{faq.question}</span>
                  </div>
                  {expandedFaq === faq.id ? (
                    <ChevronDown className="h-4 w-4 text-foreground/70" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-foreground/70" />
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
                        <Separator className="mb-3 bg-white/10" />
                        <p className="text-sm text-foreground/70 leading-relaxed">
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
