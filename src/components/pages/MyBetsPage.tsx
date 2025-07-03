"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Repeat,
  TrendingUp,
  Trophy,
  BarChart3,
  Coins,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

interface MyBet {
  id: string;
  match: {
    homeTeam: string;
    awayTeam: string;
    league: string;
    date: string;
  };
  prediction: string;
  amount: number;
  currency: "TON" | "STARS";
  status: "active" | "won" | "lost" | "cancelled" | "pending_payment";
  result?: {
    finalScore?: { home: number; away: number };
    payout?: number;
  };
  opponents: string[];
  odds: number;
}

const mockBets: MyBet[] = [
  {
    id: "1",
    match: {
      homeTeam: "Реал Мадрид",
      awayTeam: "Барселона",
      league: "Ла Лига",
      date: "Сегодня 19:00"
    },
    prediction: "П1 - Победа хозяев",
    amount: 5,
    currency: "TON",
    status: "active",
    opponents: ["Alex_Crypto", "BetMaster"],
    odds: 2.1
  },
  {
    id: "2",
    match: {
      homeTeam: "Манчестер Сити",
      awayTeam: "Арсенал",
      league: "АПЛ",
      date: "Вчера"
    },
    prediction: "П1 - Победа хозяев",
    amount: 800,
    currency: "STARS",
    status: "won",
    result: {
      finalScore: { home: 2, away: 1 },
      payout: 1680
    },
    opponents: ["SportsFan"],
    odds: 2.1
  },
  {
    id: "3",
    match: {
      homeTeam: "ПСЖ",
      awayTeam: "Лион",
      league: "Лига 1",
      date: "2 дня назад"
    },
    prediction: "X - Ничья",
    amount: 3,
    currency: "TON",
    status: "lost",
    result: {
      finalScore: { home: 3, away: 0 }
    },
    opponents: ["ProBetter"],
    odds: 3.2
  },
  {
    id: "4",
    match: {
      homeTeam: "Бавария",
      awayTeam: "Дортмунд",
      league: "Бундеслига",
      date: "Завтра 16:30"
    },
    prediction: "П2 - Победа гостей",
    amount: 1200,
    currency: "STARS",
    status: "pending_payment",
    opponents: [],
    odds: 4.5
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "won":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "lost":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "active":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "pending_payment":
      return <DollarSign className="h-5 w-5 text-yellow-500" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 text-gray-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "won":
      return "Выигран";
    case "lost":
      return "Проигран";
    case "active":
      return "Активный";
    case "pending_payment":
      return "Ожидание оплаты";
    case "cancelled":
      return "Отменен";
    default:
      return "Неизвестно";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "won":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "lost":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    case "active":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    case "pending_payment":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    case "cancelled":
      return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
  }
};

export const MyBetsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statuses = ["all", "active", "won", "lost", "pending_payment"];

  const filteredBets = mockBets.filter(bet =>
    selectedStatus === "all" || bet.status === selectedStatus
  );

  // Statistics
  const totalBets = mockBets.length;
  const wonBets = mockBets.filter(bet => bet.status === "won").length;
  const winRate = totalBets > 0 ? Math.round((wonBets / totalBets) * 100) : 0;
  const totalWinnings = mockBets
    .filter(bet => bet.status === "won")
    .reduce((sum, bet) => sum + (bet.result?.payout || 0), 0);

  const handleRepeatBet = (betId: string) => {
    alert(`Отправляем предложение повторить спор ${betId}`);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{winRate}%</p>
                <p className="text-sm text-muted-foreground">Процент побед</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${winRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{wonBets}</p>
                <p className="text-sm text-muted-foreground">Выигранных</p>
              </div>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              из {totalBets} споров
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Filters */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">История споров</h2>
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
              className="whitespace-nowrap"
            >
              {status === "all" ? "Все" : getStatusText(status)}
            </Button>
          ))}
        </div>
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
                    {getStatusIcon(bet.status)}
                    <div>
                      <CardTitle className="text-base">
                        {bet.match.homeTeam} vs {bet.match.awayTeam}
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {bet.match.league}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {bet.match.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Badge className={getStatusColor(bet.status)}>
                    {getStatusText(bet.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Bet Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Прогноз</p>
                      <p className="font-medium">{bet.prediction}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Сумма</p>
                      <div className="flex items-center space-x-1">
                        {bet.currency === "TON" ? (
                          <Coins className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="font-bold">{bet.amount}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Коэффициент</p>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span className="font-medium">{bet.odds}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Соперники</p>
                      <p className="font-medium">
                        {bet.opponents.length > 0 ? bet.opponents.join(", ") : "Нет"}
                      </p>
                    </div>
                  </div>

                  {/* Result */}
                  {bet.result && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        {bet.result.finalScore && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Итоговый счет:</span>
                            <span className="font-bold">
                              {bet.result.finalScore.home} - {bet.result.finalScore.away}
                            </span>
                          </div>
                        )}
                        {bet.result.payout && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Выплата:</span>
                            <div className="flex items-center space-x-1">
                              {bet.currency === "TON" ? (
                                <Coins className="h-4 w-4 text-green-500" />
                              ) : (
                                <Star className="h-4 w-4 text-green-500" />
                              )}
                              <span className="font-bold text-green-600">
                                +{bet.result.payout}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    {bet.status === "won" || bet.status === "lost" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRepeatBet(bet.id)}
                        className="flex-1"
                      >
                        <Repeat className="h-4 w-4 mr-2" />
                        Повторить спор
                      </Button>
                    ) : bet.status === "pending_payment" ? (
                      <Button
                        className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                        size="sm"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Оплатить
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="flex-1">
                        Подробности
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredBets.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {selectedStatus === "all"
              ? "У вас пока нет споров"
              : `Нет споров со статусом "${getStatusText(selectedStatus)}"`
            }
          </p>
        </div>
      )}
    </div>
  );
};
