package com.matchmind.dto;

import com.matchmind.model.MatchStatus;

import java.time.LocalDateTime;

public record FootballMatchDTO(
        Long id,
        LocalDateTime matchDate,
        String stage,
        TeamDTO homeTeam,
        TeamDTO awayTeam,
        Integer homeScore,
        Integer awayScore,
        MatchStatus status
) {}