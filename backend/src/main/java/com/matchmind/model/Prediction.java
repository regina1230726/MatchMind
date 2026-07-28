package com.matchmind.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "predictions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "match_id", nullable = false, unique = true)
    private FootballMatch match;

    private Double homeWinProbability;

    private Double drawProbability;

    private Double awayWinProbability;

    @Enumerated(EnumType.STRING)
    private PredictionOutcome predictedOutcome;

    private String modelVersion;

    private LocalDateTime generatedAt;

    private Double expectedHomeGoals;
    private Double expectedAwayGoals;

    private Integer predictedHomeScore;
    private Integer predictedAwayScore;
}