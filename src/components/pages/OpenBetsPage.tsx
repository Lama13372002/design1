"use client";

import { useState, useRef, useEffect } from "react";
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
  Star,
  Zap,
  Trophy,
  CheckCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";

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
  const controls = useAnimation();
  const buttonsRef = useRef<HTMLDivElement>(null);
  const sortOptions = ["time", "amount", "odds"];
  const sortLabels = {
    time: "По времени",
    amount: "По сумме",
    odds: "По коэффициенту"
  };

  const getNextSortOption = (direction: "next" | "prev") => {
    const currentIndex = sortOptions.indexOf(sortBy);
    if (direction === "next") {
      return sortOptions[(currentIndex + 1) % sortOptions.length] as "time" | "amount" | "odds";
    } else {
      return sortOptions[(currentIndex - 1 + sortOptions.length) % sortOptions.length] as "time" | "amount" | "odds";
    }
  };

  const handleSwipe = (direction: "left" | "right") => {
    // Свайп влево означает переход к следующей опции
    // Свайп вправо означает переход к предыдущей опции
    const newSortBy = direction === "left" ? getNextSortOption("next") : getNextSortOption("prev");

    // Анимация при свайпе
    controls.start({
      x: direction === "left" ? -20 : 20,
      opacity: 0.5,
      transition: { duration: 0.2 }
    }).then(() => {
      setSortBy(newSortBy);
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.2 }
      });

      // Прокручиваем до активной кнопки
      scrollToActiveButton(newSortBy);
    });
  };

  // Функция для прокрутки к активной кнопке
  const scrollToActiveButton = (activeSortBy: "time" | "amount" | "odds") => {
    if (buttonsRef.current) {
      const container = buttonsRef.current;
      const activeButtonIndex = sortOptions.indexOf(activeSortBy);

      // Расчет позиции прокрутки на основе индекса активной кнопки
      // Предполагаем, что каждая кнопка имеет примерно одинаковую ширину
      const buttonWidth = container.scrollWidth / sortOptions.length;
      const scrollPosition = buttonWidth * activeButtonIndex;

      // Плавная прокрутка до нужной позиции
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Эффект для начальной прокрутки к активной кнопке
  useEffect(() => {
    scrollToActiveButton(sortBy);
  }, []);

  const handleJoinBet = (betId: string) => {
    // Проверяем, есть ли свободные места
    const bet = mockBets.find(b => b.id === betId);

    if (!bet || bet.participants >= bet.maxParticipants) {
      alert("Невозможно присоединиться к спору: все места заняты");
      return;
    }

    // Здесь будет логика присоединения к спору
    alert(`Вы успешно присоединились к спору #${betId}`);

    // Обновляем состояние (в реальном приложении данные пришли бы с сервера)
    const updatedBets = mockBets.map(b => {
      if (b.id === betId) {
        return { ...b, participants: b.participants + 1 };
      }
      return b;
    });

    // Обновляем список споров с новыми данными
    // В реальном приложении здесь был бы запрос к API
  };

  const handleViewDetails = (betId: string) => {
    const bet = mockBets.find(b => b.id === betId);
    if (!bet) return;

    const formattedText = `
Детали спора #${bet.id}
-------------------
Матч: ${bet.match.homeTeam} vs ${bet.match.awayTeam}
Лига: ${bet.match.league}
Время: ${bet.match.startTime}
Прогноз: ${bet.prediction}
Сумма: ${bet.amount} ${bet.currency}
Коэффициент: ${bet.odds}
Создатель: ${bet.creator.name}
Участники: ${bet.participants}/${bet.maxParticipants}
    `;

    alert(formattedText);
  };

  const handleFilterByStatus = (status: "all" | "TON" | "STARS") => {
    setSelectedCurrency(status);
  };

  const handleSort = (sortType: "time" | "amount" | "odds") => {
    setSortBy(sortType);
  };

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

  return (
    <div className="p-4 space-y-5 pb-24">
      {/* Header и Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Открытые споры
          </h2>
          <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-none px-3 py-1 rounded-full">
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>{filteredBets.length} активных</span>
            </div>
          </Badge>
        </div>

        {/* Фильтры валют - БЕЗ жеста свайпа */}
        <Card className="glass-card border-none overflow-hidden p-3">
          <CardContent className="p-0 space-y-3">
            <div className="flex space-x-2 overflow-x-auto py-1 no-scrollbar">
              <Button
                variant={selectedCurrency === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterByStatus("all")}
                className={`rounded-full ${selectedCurrency === "all" ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none shadow-md" : "bg-white/5 backdrop-blur-sm border border-white/10"}`}
              >
                <Filter className="h-4 w-4 mr-1" />
                <span>Все валюты</span>
              </Button>
              <Button
                variant={selectedCurrency === "TON" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterByStatus("TON")}
                className={`flex items-center space-x-1 rounded-full ${selectedCurrency === "TON" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none shadow-md" : "bg-white/5 backdrop-blur-sm border border-white/10"}`}
              >
                <Coins className="h-4 w-4" />
                <span>TON</span>
              </Button>
              <Button
                variant={selectedCurrency === "STARS" ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilterByStatus("STARS")}
                className={`flex items-center space-x-1 rounded-full ${selectedCurrency === "STARS" ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-none shadow-md" : "bg-white/5 backdrop-blur-sm border border-white/10"}`}
              >
                <Star className="h-4 w-4" />
                <span>STARS</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Сортировка С жестом свайпа */}
        <Card className="glass-card border-none overflow-hidden p-3">
          <CardContent className="p-0 space-y-3">
            {/* Подсказка для свайпа */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-foreground/50 flex items-center space-x-1">
                <ChevronLeft className="h-4 w-4" />
                <span>Свайп для сортировки</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            {/* Сортировка с поддержкой свайпов и прокруткой */}
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(event, info) => {
                if (info.offset.x < -50) {
                  handleSwipe("left");
                } else if (info.offset.x > 50) {
                  handleSwipe("right");
                }
              }}
              className="touch-none"
            >
              <motion.div
                className="flex overflow-x-auto no-scrollbar snap-x"
                ref={buttonsRef}
                animate={controls}
              >
                <Button
                  variant={sortBy === "time" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    handleSort("time");
                    scrollToActiveButton("time");
                  }}
                  className={`min-w-max shrink-0 mr-2 snap-center rounded-full ${sortBy === "time" ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white border-none shadow-md" : "bg-white/5 backdrop-blur-sm border border-white/10"}`}
                >
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{sortLabels.time}</span>
                </Button>
                <Button
                  variant={sortBy === "amount" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    handleSort("amount");
                    scrollToActiveButton("amount");
                  }}
                  className={`min-w-max shrink-0 mr-2 snap-center rounded-full ${sortBy === "amount" ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white border-none shadow-md" : "bg-white/5 backdrop-blur-sm border border-white/10"}`}
                >
                  <Coins className="h-4 w-4 mr-1" />
                  <span>{sortLabels.amount}</span>
                </Button>
                <Button
                  variant={sortBy === "odds" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    handleSort("odds");
                    scrollToActiveButton("odds");
                  }}
                  className={`min-w-max shrink-0 snap-center rounded-full ${sortBy === "odds" ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white border-none shadow-md" : "bg-white/5 backdrop-blur-sm border border-white/10"}`}
                >
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>{sortLabels.odds}</span>
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="glass-card border-none overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl"></div>
          <CardContent className="p-3 text-center relative z-10">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">12</div>
            <div className="text-xs text-blue-400 font-medium">Всего споров</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-none overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl"></div>
          <CardContent className="p-3 text-center relative z-10">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">45</div>
            <div className="text-xs text-green-400 font-medium">TON в игре</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-none overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl"></div>
          <CardContent className="p-3 text-center relative z-10">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">8.5k</div>
            <div className="text-xs text-purple-400 font-medium">STARS в игре</div>
          </CardContent>
        </Card>
      </div>

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
              <CardHeader className="pb-2 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-white/20">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {bet.creator.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{bet.creator.name}</p>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <Badge variant="outline" className="text-xs bg-white/10 border-white/10">
                          {bet.match.league}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-foreground/70">
                          <Clock className="h-3 w-3 text-blue-400" />
                          <span>{bet.timeLeft}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 justify-end">
                      <div className="h-5 w-5 rounded-full flex items-center justify-center">
                        {bet.currency === "TON" ? (
                          <Coins className="h-4 w-4 text-blue-400" />
                        ) : (
                          <Star className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <span className="font-bold text-lg">{bet.amount}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-foreground/70 justify-end mt-0.5">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="font-medium">x{bet.odds}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 relative z-10">
                <div className="space-y-3">
                  {/* Match Info */}
                  <div className="p-3 rounded-xl bg-white/5 backdrop-blur-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-cosmic flex items-center justify-center text-white text-xs font-bold">
                          {bet.match.homeTeam.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">{bet.match.homeTeam}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-foreground/70">
                        <Zap className="h-3 w-3 text-blue-400" />
                        <span>{bet.match.startTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-fire flex items-center justify-center text-white text-xs font-bold">
                          {bet.match.awayTeam.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">{bet.match.awayTeam}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs font-medium bg-white/5 border-white/10 text-foreground/80"
                      >
                        {bet.prediction}
                      </Badge>
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Participants */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">
                        <span className="font-semibold">{bet.participants}</span>
                        <span className="text-foreground/70">/{bet.maxParticipants} участников</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(bet.id)}
                        className="rounded-full h-9 w-9 p-0 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        onClick={() => handleJoinBet(bet.id)}
                        disabled={bet.participants >= bet.maxParticipants}
                        className={`rounded-full ${
                          bet.participants >= bet.maxParticipants
                            ? "bg-foreground/20 text-foreground/50"
                            : "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white"
                        }`}
                      >
                        <div className="flex items-center space-x-1">
                          {bet.participants >= bet.maxParticipants ? (
                            <span>Полный</span>
                          ) : (
                            <>
                              <span>Присоединиться</span>
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </div>
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(bet.participants / bet.maxParticipants) * 100}%` }}
                    />
                  </div>

                  {/* Потенциальный выигрыш */}
                  {bet.participants < bet.maxParticipants && (
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      <Sparkles className="h-3 w-3 text-yellow-400" />
                      <span className="text-foreground/70">Потенциальный выигрыш:</span>
                      <span className="font-semibold bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                        {(bet.amount * bet.odds).toFixed(1)} {bet.currency}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredBets.length === 0 && (
        <div className="text-center py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <Trophy className="h-12 w-12 text-foreground/30 mx-auto mb-3" />
          <p className="text-foreground/60 font-medium">Нет открытых споров с выбранными фильтрами</p>
          <Button
            variant="outline"
            className="mt-4 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10"
            onClick={() => setSelectedCurrency("all")}
          >
            Сбросить фильтры
          </Button>
        </div>
      )}
    </div>
  );
};
