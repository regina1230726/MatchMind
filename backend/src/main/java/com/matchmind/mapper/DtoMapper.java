package com.matchmind.mapper;

import com.matchmind.dto.FootballMatchDTO;
import com.matchmind.dto.PredictionDTO;
import com.matchmind.dto.TeamDTO;
import com.matchmind.model.FootballMatch;
import com.matchmind.model.Prediction;
import com.matchmind.model.Team;

public class DtoMapper {

    public static TeamDTO toTeamDTO(Team team) {
        return new TeamDTO(
                team.getId(),
                team.getName(),
                team.getCode(),
                team.getFlagUrl(),
                team.getFifaRanking(),
                team.getGroupName()
        );
    }

    public static FootballMatchDTO toFootballMatchDTO(FootballMatch match) {
        return new FootballMatchDTO(
                match.getId(),
                match.getMatchDate(),
                match.getStage(),
                toTeamDTO(match.getHomeTeam()),
                toTeamDTO(match.getAwayTeam()),
                match.getHomeScore(),
                match.getAwayScore(),
                match.getStatus()
        );
    }

    public static PredictionDTO toPredictionDTO(Prediction prediction) {
        return new PredictionDTO(
                prediction.getId(),
                toFootballMatchDTO(prediction.getMatch()),

                prediction.getHomeWinProbability(),
                prediction.getDrawProbability(),
                prediction.getAwayWinProbability(),

                prediction.getPredictedOutcome(),

                prediction.getExpectedHomeGoals(),
                prediction.getExpectedAwayGoals(),

                prediction.getPredictedHomeScore(),
                prediction.getPredictedAwayScore(),

                prediction.getModelVersion(),
                prediction.getGeneratedAt()
        );
    }
}