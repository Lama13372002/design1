"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Filter,
  Users,
  Clock,
  TrendingUp,
  Eye,
  ArrowRight,
  Coins,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

interface OpenBet {
  id: string;
  creator: {
    name: string;
    avatar?: string;
  };
  match: {
    homeTeam: string;
    awayTeam: string;
    league: string;
    startTime: string;
  };
  prediction: string;
  amount: number;
  currency: "TON" | "STARS";
  odds: number;
  timeLeft: string;
  participants: number;
  maxParticipants: number;
}

const mockBets: OpenBet[] = [
  {
    id: "1",
    creator: { name: "Alex_Crypto" },
    match: {
      homeTeam: "Реал Мадрид",
      awayTeam: "Барселона",
      league: "Ла Лига",
      startTime: "19:00"
    },
    prediction: "П1 - Победа хозяев",
    amount: 5,
    currency: "TON",
    odds: 2.1,
    timeLeft: "2ч 15м",
    participants: 1,
    maxParticipants: 4
  },
  {
    id: "2",
    creator: { name: "SportsFan" },
    match: {
      homeTeam: "Манчестер Сити",
      awayTeam: "Ливерпуль",
      league: "АПЛ",
      startTime: "17:30"
    },
    prediction: "X - Ничья",
    amount: 800,
    currency: "STARS",
    odds: 3.8,
    timeLeft: "25м",
    participants: 2,
    maxParticipants: 2
  },
  {
    id: "3",
    creator: { name: "BetMaster" },
    match: {
      homeTeam: "ПСЖ",
      awayTeam: "Марсель",
      league: "Лига 1",
      startTime: "21:45"
    },
    prediction: "П2 - Победа гостей",
    amount: 10,
    currency: "TON",
    odds: 6.2,
    timeLeft: "5ч 30м",
    participants: 0,
    maxParticipants: 6
  }
];

export const OpenBetsPage = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<"all" | "TON" | "STARS">("all");
  const [sortBy, setSortBy] = useState<"time" | "amount" | "odds">("time");

  const filteredBets = mockBets
    .filter(bet => selectedCurrency === "all" || bet.currency === selectedCurrency)
    .sort((a, b) => {
      switch (sortBy) {
        case "amount":
          return b.amount - a.amount;
        case "odds":
          return b.odds - a.odds;
        default:
          return 0; // По времени (в реальности нужна сортировка по дате)
      }
    });

  const handleJoinBet = (betId: string) => {
    alert(`Присоединяемся к спору ${betId}`);
  };

  const handleViewDetails = (betId: string) => {
    alert(`Детали спора ${betId}`);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Открытые споры</h2>
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            {filteredBets.length} активных
          </Badge>
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCurrency === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCurrency("all")}
          >
            Все валюты
          </Button>
          <Button
            variant={selectedCurrency === "TON" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCurrency("TON")}
            className="flex items-center space-x-1"
          >
            <Coins className="h-4 w-4" />
            <span>TON</span>
          </Button>
          <Button
            variant={selectedCurrency === "STARS" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCurrency("STARS")}
            className="flex items-center space-x-1"
          >
            <Star className="h-4 w-4" />
            <span>STARS</span>
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={sortBy === "time" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("time")}
          >
            По времени
          </Button>
          <Button
            variant={sortBy === "amount" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("amount")}
          >
            По сумме
          </Button>
          <Button
            variant={sortBy === "odds" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("odds")}
          >
            По коэффициенту
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-xs text-blue-600">Всего споров</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-green-600">45</div>
            <div className="text-xs text-green-600">TON в игре</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">8.5k</div>
            <div className="text-xs text-purple-600">STARS в игре</div>
          </CardContent>
        </Card>
      </div>

      {/* Bets List */}
      <div className="space-y-3">
        {filteredBets.map((bet, index) => (
          <motion.div
            key={bet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                        {bet.creator.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{bet.creator.name}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {bet.match.league}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{bet.timeLeft}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      {bet.currency === "TON" ? (
                        <Coins className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="font-bold text-lg">{bet.amount}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-3 w-3" />
                      <span>{bet.odds}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Match Info */}
                  <div className="space-y-1">
                    <div className="font-semibold text-sm">
                      {bet.match.homeTeam} vs {bet.match.awayTeam}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Прогноз: <span className="font-medium">{bet.prediction}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Participants */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {bet.participants}/{bet.maxParticipants} участников
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(bet.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleJoinBet(bet.id)}
                        disabled={bet.participants >= bet.maxParticipants}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                      >
                        {bet.participants >= bet.maxParticipants ? "Полный" : "Присоединиться"}
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(bet.participants / bet.maxParticipants) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredBets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Нет открытых споров с выбранными фильтрами</p>
        </div>
      )}
    </div>
  );
};
