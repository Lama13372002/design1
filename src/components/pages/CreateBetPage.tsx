"use client";

import { useState } from "react";
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
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

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

  const handleCreateBet = () => {
    if (!isValidAmount || !selectedOutcome) return;
    setShowPreview(true);
  };

  const handleConfirmBet = () => {
    // Здесь будет логика создания спора
    alert("Спор создан!");
    onBack();
  };

  if (showPreview) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">Подтверждение спора</h2>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Детали спора</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Матч:</span>
                  <span className="font-medium">{selectedMatch.homeTeam} vs {selectedMatch.awayTeam}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Лига:</span>
                  <span>{selectedMatch.league}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Время:</span>
                  <span>{selectedMatch.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Прогноз:</span>
                  <span className="font-medium">
                    {outcomes.find(o => o.id === selectedOutcome)?.label}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Сумма:</span>
                  <span className="font-bold text-lg">{amount} {selectedCurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Потенциальный выигрыш:</span>
                  <span className="font-bold text-lg text-green-600">
                    {potentialWin.toFixed(2)} {selectedCurrency}
                  </span>
                </div>
                {comment && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Комментарий:</span>
                    <span className="text-right max-w-48">{comment}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-3">
                <Button
                  onClick={handleConfirmBet}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  size="lg"
                >
                  Подтвердить и создать спор
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="w-full"
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
    <div className="p-4 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold">Создать спор</h2>
      </div>

      {/* Selected Match */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Выбранный матч</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedMatch.homeTeam}</span>
              <Badge variant="outline">{selectedMatch.league}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{selectedMatch.awayTeam}</span>
              <span className="text-sm text-muted-foreground">{selectedMatch.startTime}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Currency Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Валюта</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {currencies.map((currency) => (
              <motion.div key={currency.id} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={selectedCurrency === currency.id ? "default" : "outline"}
                  onClick={() => setSelectedCurrency(currency.id)}
                  className={`w-full p-4 h-auto flex flex-col space-y-2 ${
                    selectedCurrency === currency.id
                      ? `bg-gradient-to-r ${currency.color} text-white`
                      : ""
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

      {/* Amount */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Сумма</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Input
              type="number"
              placeholder={`Минимум ${currentCurrency.min} ${selectedCurrency}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`text-lg ${!isValidAmount && amount ? "border-red-500" : ""}`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Badge variant="secondary">{selectedCurrency}</Badge>
            </div>
          </div>

          {!isValidAmount && amount && (
            <div className="flex items-center space-x-2 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Минимальная сумма: {currentCurrency.min} {selectedCurrency}</span>
            </div>
          )}

          <div className="flex space-x-2">
            {[currentCurrency.min, currentCurrency.min * 2, currentCurrency.min * 5].map((preset) => (
              <Button
                key={preset}
                variant="outline"
                size="sm"
                onClick={() => setAmount(preset.toString())}
              >
                {preset}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Outcome Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Прогноз</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {outcomes.map((outcome) => (
            <motion.div key={outcome.id} whileTap={{ scale: 0.98 }}>
              <Button
                variant={selectedOutcome === outcome.id ? "default" : "outline"}
                onClick={() => setSelectedOutcome(outcome.id)}
                className="w-full justify-between p-4 h-auto"
              >
                <span>{outcome.label}</span>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-semibold">{outcome.odds}</span>
                </div>
              </Button>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Comment */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Комментарий (необязательно)</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            placeholder="Ваш комментарий к спору..."
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 222))}
            className="w-full p-3 border rounded-md resize-none h-20 bg-background"
            maxLength={222}
          />
          <div className="text-right text-sm text-muted-foreground mt-1">
            {comment.length}/222
          </div>
        </CardContent>
      </Card>

      {/* Potential Win Display */}
      {isValidAmount && selectedOutcome && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Потенциальный выигрыш</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {potentialWin.toFixed(2)} {selectedCurrency}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Create Button */}
      <Button
        onClick={handleCreateBet}
        disabled={!isValidAmount || !selectedOutcome}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
        size="lg"
      >
        Создать спор
      </Button>
    </div>
  );
};
