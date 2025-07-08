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
  Repeat,
  TrendingUp,
  Trophy,
  BarChart3,
  Coins,
  Star,
  Sparkles,
  AlertCircle,
  Zap,
  Info
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
  status: "active" | "won" | "lost" | "cancelled";
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
    status: "active",
    opponents: ["CryptoKing"],
    odds: 4.5
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "won":
      return <CheckCircle className="h-5 w-5 text-green-400" />;
    case "lost":
      return <XCircle className="h-5 w-5 text-red-400" />;
    case "active":
      return <Clock className="h-5 w-5 text-blue-400" />;
    case "cancelled":
      return <XCircle className="h-5 w-5 text-foreground/50" />;
    default:
      return <Clock className="h-5 w-5 text-foreground/50" />;
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

    case "cancelled":
      return "Отменен";
    default:
      return "Неизвестно";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "won":
      return "bg-gradient-to-r from-green-400 to-emerald-500 text-white border-none";
    case "lost":
      return "bg-gradient-to-r from-red-400 to-rose-500 text-white border-none";
    case "active":
      return "bg-gradient-to-r from-blue-400 to-blue-500 text-white border-none";
    case "cancelled":
      return "bg-foreground/20 text-foreground/60 border-none";
    default:
      return "bg-foreground/20 text-foreground/60 border-none";
  }
};

export const MyBetsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const statuses = ["all", "active", "won", "lost"];

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

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
  };

  const handleRepeatBet = (betId: string) => {
    const bet = mockBets.find(b => b.id === betId);
    if (!bet) return;

    const message = `
Предложение спора отправлено:
Матч: ${bet.match.homeTeam} vs ${bet.match.awayTeam}
Прогноз: ${bet.prediction}
Сумма: ${bet.amount} ${bet.currency}
    `;

    alert(message);
  };



  const handleViewDetails = (betId: string) => {
    const bet = mockBets.find(b => b.id === betId);
    if (!bet) return;

    const message = `
Детали спора #${bet.id}:
Матч: ${bet.match.homeTeam} vs ${bet.match.awayTeam}
Лига: ${bet.match.league}
Прогноз: ${bet.prediction}
Сумма: ${bet.amount} ${bet.currency}
Статус: ${getStatusText(bet.status)}
${bet.result?.finalScore ? `Итоговый счет: ${bet.result.finalScore.home} - ${bet.result.finalScore.away}` : ''}
${bet.result?.payout ? `Выплата: ${bet.result.payout} ${bet.currency}` : ''}
    `;

    alert(message);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text mb-1">
          Мои споры
        </h2>
        <p className="text-sm text-foreground/70">Управляйте своими ставками и отслеживайте результаты</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card border-none overflow-hidden relative shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl"></div>
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">{winRate}%</p>
                <p className="text-sm text-foreground/70">Процент побед</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-400 to-purple-500 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${winRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-none overflow-hidden relative shadow-md">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl"></div>
          <CardContent className="p-4 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md relative overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></div>
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">{wonBets}</p>
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </div>
                <p className="text-sm text-foreground/70">Выигранных споров</p>
              </div>
            </div>
            <p className="text-xs text-green-400 mt-2 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>из {totalBets} споров ({Math.round(wonBets/totalBets*100) || 0}%)</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Filters */}
      <Card className="glass-card border-none overflow-hidden p-3">
        <CardContent className="p-0 space-y-3">
          <div className="flex space-x-2 overflow-x-auto py-1 no-scrollbar">
            {statuses.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilter(status)}
                className={`rounded-full whitespace-nowrap ${
                  selectedStatus === status
                    ? status === "all"
                      ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white border-none shadow-md"
                      : getStatusColor(status)
                    : "bg-white/5 backdrop-blur-sm border border-white/10"
                }`}
              >
                {status !== "all" && getStatusIcon(status)}
                <span className="ml-1">{status === "all" ? "Все" : getStatusText(status)}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bets List */}
      <div className="space-y-4">
        {filteredBets.map((bet, index) => (
          <motion.div
            key={bet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <Card className="glass-card border-none overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-xl"></div>

              <CardHeader className="pb-2 pt-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(bet.status)}
                    <div>
                      <CardTitle className="text-base font-semibold flex items-center">
                        <span>{bet.match.homeTeam}</span>
                        <span className="mx-1 text-foreground/70">vs</span>
                        <span>{bet.match.awayTeam}</span>
                      </CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs bg-white/10 border-white/10">
                          {bet.match.league}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-foreground/70">
                          <Clock className="h-3 w-3 text-blue-400" />
                          <span>{bet.match.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Badge className={getStatusColor(bet.status)}>
                    {getStatusText(bet.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0 relative z-10">
                <div className="space-y-3">
                  {/* Bet Details */}
                  <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-foreground/70 text-xs">Прогноз</p>
                        <p className="font-medium flex items-center">
                          <TrendingUp className="h-3.5 w-3.5 mr-1 text-blue-400" />
                          {bet.prediction}
                        </p>
                      </div>
                      <div>
                        <p className="text-foreground/70 text-xs">Сумма</p>
                        <div className="flex items-center space-x-1">
                          {bet.currency === "TON" ? (
                            <Coins className="h-4 w-4 text-blue-400" />
                          ) : (
                            <Star className="h-4 w-4 text-yellow-400" />
                          )}
                          <span className="font-bold">{bet.amount}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-foreground/70 text-xs">Коэффициент</p>
                        <div className="flex items-center space-x-1">
                          <Zap className="h-3.5 w-3.5 text-purple-400" />
                          <span className="font-medium">x{bet.odds}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-foreground/70 text-xs">Соперники</p>
                        <p className="font-medium truncate">
                          {bet.opponents.length > 0 ? bet.opponents.join(", ") : "Нет"}
                        </p>
                      </div>
                    </div>

                    {/* Result */}
                    {bet.result && (
                      <>
                        <Separator className="bg-white/10" />
                        <div className="space-y-2">
                          {bet.result.finalScore && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-foreground/70">Итоговый счет:</span>
                              <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                                {bet.result.finalScore.home} - {bet.result.finalScore.away}
                              </span>
                            </div>
                          )}
                          {bet.result.payout && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-foreground/70">Выплата:</span>
                              <div className="flex items-center space-x-1">
                                <Sparkles className="h-4 w-4 text-yellow-400" />
                                <span className="font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                                  +{bet.result.payout} {bet.currency}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-1">
                    {bet.status === "won" || bet.status === "lost" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRepeatBet(bet.id)}
                        className="flex-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                      >
                        <div className="flex items-center space-x-2">
                          <Repeat className="h-4 w-4" />
                          <span>Повторить спор</span>
                        </div>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                        onClick={() => handleViewDetails(bet.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <Info className="h-4 w-4" />
                          <span>Подробности</span>
                        </div>
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
        <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <AlertCircle className="h-12 w-12 text-foreground/30 mx-auto mb-3" />
          <p className="text-foreground/60 font-medium">
            {selectedStatus === "all"
              ? "У вас пока нет споров"
              : `Нет споров со статусом "${getStatusText(selectedStatus)}"`
            }
          </p>
          {selectedStatus !== "all" && (
            <Button
              variant="outline"
              className="mt-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
              onClick={() => setSelectedStatus("all")}
            >
              Показать все споры
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
