"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  Clock,
  MapPin,
  Play,
  Pause,
  MoreHorizontal,
  Trophy,
  RefreshCw
} from "lucide-react";
import { motion } from "framer-motion";
import { MatchEvent, League } from "@/types/football";
import Image from "next/image";

interface HomePageProps {
  onPageChange?: (page: "home" | "create-bet" | "open-bets" | "chat" | "my-bets" | "menu") => void;
}

interface HomePageData {
  liveMatches: MatchEvent[];
  todayMatches: MatchEvent[];
  popularLeagues: League[];
}

const getStatusBadge = (status: string, minute?: number) => {
  switch (status) {
    case "live":
      return (
        <Badge variant="destructive" className="animate-pulse flex items-center">
          <Play className="h-3 w-3 mr-1" />
          <span>{minute}'</span>
        </Badge>
      );
    case "halftime":
      return (
        <Badge variant="secondary" className="flex items-center">
          <Pause className="h-3 w-3 mr-1" />
          <span>Перерыв</span>
        </Badge>
      );
    case "finished":
      return <Badge variant="outline">Завершен</Badge>;
    default:
      return (
        <Badge variant="secondary" className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Скоро</span>
        </Badge>
      );
  }
};

export const HomePage = ({ onPageChange }: HomePageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLeague, setSelectedLeague] = useState<string>("all");
  const [data, setData] = useState<HomePageData>({
    liveMatches: [],
    todayMatches: [],
    popularLeagues: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Получение данных с сервера
  useEffect(() => {
    fetchHomeData();

    // Обновляем данные каждые 30 секунд для live матчей
    const interval = setInterval(fetchHomeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHomeData = async () => {
    try {
      setError(null);
      const response = await fetch('/api/football/home');
      const result = await response.json();

      console.log('API Response:', result);
      console.log('Success:', result.success);
      console.log('Data:', result.data);

      if (result.success) {
        console.log('Live matches:', result.data?.liveMatches?.length || 0);
        console.log('Today matches:', result.data?.todayMatches?.length || 0);
        console.log('Popular leagues:', result.data?.popularLeagues?.length || 0);
        setData(result.data);
      } else {
        console.error('API Error:', result.error);
        setError(result.error || 'Ошибка загрузки данных');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  // Объединяем все матчи для отображения
  const allMatches = [...data.liveMatches, ...data.todayMatches];

  console.log('All matches for display:', allMatches.length);
  console.log('Live matches from state:', data.liveMatches.length);
  console.log('Today matches from state:', data.todayMatches.length);

  // Получаем уникальные лиги для фильтрации
  const leagues = ["all", ...Array.from(new Set(allMatches.map(match => match.league)))];

  const filteredEvents = allMatches.filter(event => {
    const matchesSearch = searchTerm === "" ||
      event.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.awayTeam.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLeague = selectedLeague === "all" || event.league === selectedLeague;

    return matchesSearch && matchesLeague;
  });

  // Добавляем обработчики для кнопок фильтрации и поиска
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterByLeague = (league: string) => {
    setSelectedLeague(league);
  };

  const handleCreateBet = (eventId: string) => {
    if (onPageChange) {
      // Сохраняем выбранное событие в localStorage для использования на странице создания спора
      const selectedEvent = allMatches.find(event => event.id === eventId);
      if (selectedEvent) {
        localStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));
      }
      onPageChange("create-bet");
    }
  };

  const handleViewLiveEvents = () => {
    // Показываем только live матчи
    setSelectedLeague("all");
    setSearchTerm("");
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchHomeData();
  };

  if (loading && allMatches.length === 0) {
    return (
      <div className="p-4 space-y-4 pb-24">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-3">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Загрузка футбольных данных...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 pb-24">
      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Футбольные матчи</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="text-muted-foreground"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              Попробовать снова
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search bar with enhanced styling */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск команд..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 border-none shadow-md rounded-full bg-white/10 backdrop-blur-lg"
          />
        </div>

        {/* League filters with modern design */}
        <div className="flex space-x-2 overflow-x-auto py-1 pb-2 no-scrollbar">
          {leagues.map((league) => (
            <Button
              key={league}
              variant={selectedLeague === league ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterByLeague(league)}
              className={`whitespace-nowrap rounded-full font-medium
                ${selectedLeague === league
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none shadow-md"
                  : "bg-white/10 backdrop-blur-sm border border-white/20 text-foreground"}`}
            >
              {league === "all" ? "Все лиги" : league}
            </Button>
          ))}
        </div>
      </div>

      {/* Live Events Banner with improved design */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Card className="glass-card border-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-2xl"></div>
          <CardContent className="p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-red-500 dark:text-red-400">
                  {data.liveMatches.length} матчей идут сейчас
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 dark:text-red-400 p-0 h-8"
                onClick={handleViewLiveEvents}
              >
                Смотреть все
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Events List */}
      <div className="space-y-4 mt-2">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <Card className="glass-card border-none overflow-hidden">
              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs font-semibold px-2 py-1 bg-white/10 backdrop-blur-md border-white/20">
                      {event.league}
                    </Badge>
                    {getStatusBadge(event.status, event.minute)}
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Clock className="h-4 w-4 mr-1 text-blue-400" />
                    <span className="font-medium text-foreground/80">{event.startTime}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 relative z-10">
                <div className="space-y-4">
                  {/* Teams with improved typography and layout */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {event.homeTeamLogo ? (
                          <div className="w-8 h-8 relative">
                            <Image
                              src={event.homeTeamLogo}
                              alt={event.homeTeam}
                              fill
                              className="object-contain rounded-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="w-8 h-8 rounded-full bg-gradient-cosmic flex items-center justify-center text-white font-bold text-xs hidden">
                              {event.homeTeam.charAt(0)}
                            </div>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-cosmic flex items-center justify-center text-white font-bold text-xs">
                            {event.homeTeam.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold text-sm">{event.homeTeam}</span>
                      </div>
                      {event.score && (
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                          {event.score.home}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {event.awayTeamLogo ? (
                          <div className="w-8 h-8 relative">
                            <Image
                              src={event.awayTeamLogo}
                              alt={event.awayTeam}
                              fill
                              className="object-contain rounded-full"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="w-8 h-8 rounded-full bg-gradient-fire flex items-center justify-center text-white font-bold text-xs hidden">
                              {event.awayTeam.charAt(0)}
                            </div>
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-fire flex items-center justify-center text-white font-bold text-xs">
                            {event.awayTeam.charAt(0)}
                          </div>
                        )}
                        <span className="font-semibold text-sm">{event.awayTeam}</span>
                      </div>
                      {event.score && (
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                          {event.score.away}
                        </span>
                      )}
                    </div>
                  </div>

                  <Separator className="bg-white/10" />

                  {/* Gorgeous call-to-action button */}
                  <Button
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-none relative overflow-hidden shadow-lg group"
                    onClick={() => handleCreateBet(event.id)}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700"></span>
                    <div className="flex items-center justify-center space-x-2">
                      <Trophy className="h-4 w-4" />
                      <span className="font-medium">Создать спор</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Событий не найдено</p>
        </div>
      )}
    </div>
  );
};
