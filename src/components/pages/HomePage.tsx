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
  TrendingUp,
  Play,
  Pause,
  MoreHorizontal
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
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

const mockEvents: MatchEvent[] = [
  {
    id: "1",
    homeTeam: "Реал Мадрид",
    awayTeam: "Барселона",
    league: "Ла Лига",
    startTime: "19:00",
    status: "upcoming",
    odds: { home: 2.1, draw: 3.2, away: 3.4 }
  },
  {
    id: "2",
    homeTeam: "Манчестер Сити",
    awayTeam: "Ливерпуль",
    league: "АПЛ",
    startTime: "17:30",
    status: "live",
    score: { home: 1, away: 0 },
    minute: 34,
    odds: { home: 1.8, draw: 3.8, away: 4.2 }
  },
  {
    id: "3",
    homeTeam: "ПСЖ",
    awayTeam: "Марсель",
    league: "Лига 1",
    startTime: "21:45",
    status: "upcoming",
    odds: { home: 1.5, draw: 4.1, away: 6.2 }
  }
];

const getStatusBadge = (status: string, minute?: number) => {
  switch (status) {
    case "live":
      return (
        <Badge variant="destructive" className="animate-pulse">
          <Play className="h-3 w-3 mr-1" />
          {minute}'
        </Badge>
      );
    case "halftime":
      return (
        <Badge variant="secondary">
          <Pause className="h-3 w-3 mr-1" />
          Перерыв
        </Badge>
      );
    case "finished":
      return <Badge variant="outline">Завершен</Badge>;
    default:
      return <Badge variant="secondary">Скоро</Badge>;
  }
};

export const HomePage = () => {
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

  return (
    <div className="p-4 space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск команд..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {leagues.map((league) => (
            <Button
              key={league}
              variant={selectedLeague === league ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLeague(league)}
              className="whitespace-nowrap"
            >
              {league === "all" ? "Все лиги" : league}
            </Button>
          ))}
        </div>
      </div>

      {/* Live Events Banner */}
      <Card className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200 dark:border-red-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-red-600 dark:text-red-400">
                2 матча идут сейчас
              </span>
            </div>
            <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400">
              Смотреть все
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-3">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {event.league}
                    </Badge>
                    {getStatusBadge(event.status, event.minute)}
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {event.startTime}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Teams */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{event.homeTeam}</span>
                      {event.score && (
                        <span className="text-xl font-bold">{event.score.home}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{event.awayTeam}</span>
                      {event.score && (
                        <span className="text-xl font-bold">{event.score.away}</span>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Odds */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Коэффициенты</span>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant="outline" size="sm" className="flex flex-col p-2 h-auto">
                        <span className="text-xs text-muted-foreground">П1</span>
                        <span className="font-semibold">{event.odds.home}</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex flex-col p-2 h-auto">
                        <span className="text-xs text-muted-foreground">X</span>
                        <span className="font-semibold">{event.odds.draw}</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex flex-col p-2 h-auto">
                        <span className="text-xs text-muted-foreground">П2</span>
                        <span className="font-semibold">{event.odds.away}</span>
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Создать спор
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
