package com.matchmind.dto;

import com.matchmind.model.PredictionOutcome;

import java.time.LocalDateTime;

public record PredictionDTO(
        Long id,
        FootballMatchDTO match,

        Double homeWinProbability,
        Double drawProbability,
        Double awayWinProbability,

        PredictionOutcome predictedOutcome,

        Double expectedHomeGoals,
        Double expectedAwayGoals,

        Integer predictedHomeScore,
        Integer predictedAwayScore,

        String modelVersion,
        LocalDateTime generatedAt
) {}