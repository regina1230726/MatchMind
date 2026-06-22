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
        String modelVersion,
        LocalDateTime generatedAt
) {}