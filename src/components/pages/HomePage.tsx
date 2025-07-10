"use client";

import { useState } from "react";
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
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";

interface MatchEvent {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  status: "upcoming" | "live" | "halftime" | "finished";
  score?: { home: number; away: number };
  minute?: number;
}

interface HomePageProps {
  onPageChange?: (page: "home" | "create-bet" | "open-bets" | "chat" | "my-bets" | "menu") => void;
}

const mockEvents: MatchEvent[] = [
  {
    id: "1",
    homeTeam: "Реал Мадрид",
    awayTeam: "Барселона",
    league: "Ла Лига",
    startTime: "19:00",
    status: "upcoming"
  },
  {
    id: "2",
    homeTeam: "Манчестер Сити",
    awayTeam: "Ливерпуль",
    league: "АПЛ",
    startTime: "17:30",
    status: "live",
    score: { home: 1, away: 0 },
    minute: 34
  },
  {
    id: "3",
    homeTeam: "ПСЖ",
    awayTeam: "Марсель",
    league: "Лига 1",
    startTime: "21:45",
    status: "upcoming"
  }
];

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

  const leagues = ["all", "Ла Лига", "АПЛ", "Лига 1", "Бундеслига"];

  const filteredEvents = mockEvents.filter(event => {
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
      const selectedEvent = mockEvents.find(event => event.id === eventId);
      if (selectedEvent) {
        localStorage.setItem('selectedEvent', JSON.stringify(selectedEvent));
      }
      onPageChange("create-bet");
    }
  };

  const handleViewLiveEvents = () => {
    alert("Функция просмотра всех live-событий будет доступна в следующей версии");
  };

  return (
    <div className="px-4 pt-2 space-y-3 pb-20">
      {/* Search bar with enhanced styling */}
      <div className="space-y-2">
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
                  2 матча идут сейчас
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
                        <div className="w-8 h-8 rounded-full bg-gradient-cosmic flex items-center justify-center text-white font-bold">
                          {event.homeTeam.charAt(0)}
                        </div>
                        <span className="font-semibold">{event.homeTeam}</span>
                      </div>
                      {event.score && (
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                          {event.score.home}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-fire flex items-center justify-center text-white font-bold">
                          {event.awayTeam.charAt(0)}
                        </div>
                        <span className="font-semibold">{event.awayTeam}</span>
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
