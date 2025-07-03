"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Coins,
  Star,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Trophy,
  Scale,
  Zap,
  ChevronRight,
  Sparkles,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CreateBetPageProps {
  onBack: () => void;
}

const currencies = [
  { id: "TON", name: "TON", icon: Coins, min: 2, color: "from-blue-500 to-blue-600" },
  { id: "STARS", name: "STARS", icon: Star, min: 400, color: "from-yellow-500 to-yellow-600" }
];

const outcomes = [
  { id: "home", label: "П1 - Победа хозяев", odds: 2.1 },
  { id: "draw", label: "X - Ничья", odds: 3.2 },
  { id: "away", label: "П2 - Победа гостей", odds: 3.4 }
];

export const CreateBetPage = ({ onBack }: CreateBetPageProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState("TON");
  const [amount, setAmount] = useState("");
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [comment, setComment] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Получаем данные о выбранном событии, если оно было передано
  useEffect(() => {
    const storedEventId = localStorage.getItem('selectedEventId');
    if (storedEventId) {
      // В реальном приложении здесь был бы запрос к API для получения полных данных о событии
      console.log(`Загружено событие ${storedEventId}`);
    }
  }, []);

  const currentCurrency = currencies.find(c => c.id === selectedCurrency)!;
  const amountNum = Number.parseFloat(amount) || 0;
  const isValidAmount = amountNum >= currentCurrency.min;
  const potentialWin = selectedOutcome ? amountNum * outcomes.find(o => o.id === selectedOutcome)!.odds : 0;

  const selectedMatch = {
    homeTeam: "Реал Мадрид",
    awayTeam: "Барселона",
    league: "Ла Лига",
    startTime: "19:00"
  };

  const validateForm = () => {
    if (!isValidAmount) {
      setValidationError(`Минимальная сумма: ${currentCurrency.min} ${selectedCurrency}`);
      return false;
    }

    if (!selectedOutcome) {
      setValidationError("Выберите прогноз");
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleCreateBet = () => {
    if (!validateForm()) return;
    setShowPreview(true);
  };

  const handleConfirmBet = () => {
    // В реальном приложении здесь был бы API запрос для создания спора
    alert("Спор успешно создан!");

    // Очищаем выбранное событие из localStorage
    localStorage.removeItem('selectedEventId');

    onBack();
  };

  const handleChangeCurrency = (currency: string) => {
    setSelectedCurrency(currency);
    // Сбрасываем сумму, если она меньше минимальной для новой валюты
    const newMinAmount = currencies.find(c => c.id === currency)!.min;
    if (Number.parseFloat(amount) < newMinAmount) {
      setAmount("");
    }
  };

  const handleSetAmount = (value: string) => {
    // Проверяем, что введено число
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setAmount(value);
      setValidationError(null);
    }
  };

  const handleSelectOutcome = (outcome: string) => {
    setSelectedOutcome(outcome);
    setValidationError(null);
  };

  const handleSetPresetAmount = (preset: number) => {
    setAmount(preset.toString());
    setValidationError(null);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 222) {
      setComment(value);
    }
  };

  if (showPreview) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(false)}
            className="hover:bg-white/10 rounded-full h-10 w-10 p-0 flex items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Подтверждение спора
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
        >
          <Card className="glass-card border-none overflow-hidden relative shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-xl"></div>

            <CardHeader className="pt-6">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-md">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold">Детали спора</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Матч:</span>
                  <span className="font-bold">{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Лига:</span>
                  <Badge className="bg-white/10 border-none">{selectedMatch.league}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Время:</span>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-3 w-3 text-blue-400" />
                    <span>{selectedMatch.startTime}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Прогноз:</span>
                  <Badge variant="outline" className="font-semibold bg-white/5 border-white/10">
                    {outcomes.find(o => o.id === selectedOutcome)?.label}
                  </Badge>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Сумма:</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      <currentCurrency.icon className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-bold text-lg">{amount} {selectedCurrency}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground/70">Потенциальный выигрыш:</span>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    <span className="font-bold text-lg text-gradient bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                      {potentialWin.toFixed(2)} {selectedCurrency}
                    </span>
                  </div>
                </div>
                {comment && (
                  <div className="flex justify-between">
                    <span className="text-foreground/70 whitespace-nowrap mr-4">Комментарий:</span>
                    <span className="text-right max-w-48 text-foreground/80 italic">{comment}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleConfirmBet}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 border-none relative overflow-hidden shadow-lg group"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-semibold">Подтвердить и создать спор</span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="w-full rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                >
                  Изменить
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center space-x-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="hover:bg-white/10 rounded-full h-10 w-10 p-0 flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Создать спор
        </h2>
      </div>

      {/* Selected Match */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card border-none overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-blue-400" />
              <span>Выбранный матч</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-cosmic flex items-center justify-center text-white font-bold">
                    {selectedMatch.homeTeam.charAt(0)}
                  </div>
                  <span className="font-semibold">{selectedMatch.homeTeam}</span>
                </div>
                <Badge variant="outline" className="bg-white/10 border-white/10">{selectedMatch.league}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-fire flex items-center justify-center text-white font-bold">
                    {selectedMatch.awayTeam.charAt(0)}
                  </div>
                  <span className="font-semibold">{selectedMatch.awayTeam}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-foreground/70">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <span>{selectedMatch.startTime}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Currency Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card border-none overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Scale className="h-5 w-5 text-blue-400" />
              <span>Валюта</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {currencies.map((currency) => (
                <motion.div key={currency.id} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={selectedCurrency === currency.id ? "default" : "outline"}
                    onClick={() => handleChangeCurrency(currency.id)}
                    className={`w-full p-4 h-auto flex flex-col space-y-2 rounded-xl ${
                      selectedCurrency === currency.id
                        ? `bg-gradient-to-r ${currency.color} text-white shadow-lg border-none`
                        : "bg-white/5 backdrop-blur-sm border border-white/10"
                    }`}
                  >
                    <currency.icon className="h-6 w-6" />
                    <span className="font-semibold">{currency.name}</span>
                    <span className="text-xs opacity-80">
                      мин. {currency.min}
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Amount */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card border-none overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Coins className="h-5 w-5 text-blue-400" />
              <span>Сумма</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Input
                type="number"
                placeholder={`Минимум ${currentCurrency.min} ${selectedCurrency}`}
                value={amount}
                onChange={(e) => handleSetAmount(e.target.value)}
                className={`text-lg rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 ${!isValidAmount && amount ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-400 to-purple-500 text-white border-none">
                  {selectedCurrency}
                </Badge>
              </div>
            </div>

            {!isValidAmount && amount && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>Минимальная сумма: {currentCurrency.min} {selectedCurrency}</span>
              </div>
            )}

            {validationError && (
              <div className="flex items-center space-x-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="flex space-x-2">
              {[currentCurrency.min, currentCurrency.min * 2, currentCurrency.min * 5].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetPresetAmount(preset)}
                  className="rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                >
                  {preset}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Outcome Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass-card border-none overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              <span>Прогноз</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {outcomes.map((outcome) => (
              <motion.div key={outcome.id} whileTap={{ scale: 0.98 }}>
                <Button
                  variant={selectedOutcome === outcome.id ? "default" : "outline"}
                  onClick={() => handleSelectOutcome(outcome.id)}
                  className={`w-full justify-between p-4 h-auto rounded-xl ${
                    selectedOutcome === outcome.id
                      ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white border-none"
                      : "bg-white/5 backdrop-blur-sm border border-white/10"
                  }`}
                >
                  <span className="font-medium">{outcome.label}</span>
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-semibold">{outcome.odds}</span>
                  </div>
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Comment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-card border-none overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-400" />
              <span>Комментарий (необязательно)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <textarea
              placeholder="Ваш комментарий к спору..."
              value={comment}
              onChange={handleCommentChange}
              className="w-full p-3 rounded-xl resize-none h-20 bg-white/5 backdrop-blur-sm border border-white/10 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              maxLength={222}
            />
            <div className="text-right text-sm text-foreground/60 mt-1">
              {comment.length}/222
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Potential Win Display */}
      {isValidAmount && selectedOutcome && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-card border-none overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-xl"></div>
            <CardContent className="p-5 relative">
              <div className="text-center">
                <p className="text-sm text-foreground/70">Потенциальный выигрыш</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text flex items-center justify-center mt-1">
                  <Sparkles className="h-5 w-5 text-green-400 mr-2" />
                  <span>{potentialWin.toFixed(2)} {selectedCurrency}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Button
          onClick={handleCreateBet}
          disabled={!isValidAmount || !selectedOutcome}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 border-none relative overflow-hidden shadow-lg group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
          <div className="flex items-center justify-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span className="font-semibold">Создать спор</span>
            <ChevronRight className="h-5 w-5" />
          </div>
        </Button>
      </motion.div>
    </div>
  );
};
