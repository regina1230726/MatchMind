package com.matchmind.service;

import com.matchmind.model.FootballMatch;
import com.matchmind.model.MatchStatus;
import com.matchmind.repository.FootballMatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FootballMatchService {

    private final FootballMatchRepository footballMatchRepository;

    public List<FootballMatch> getAllMatches() {
        return footballMatchRepository.findAll();
    }

    public FootballMatch getMatchById(Long id) {
        return footballMatchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found with id: " + id));
    }

    public List<FootballMatch> getUpcomingMatches() {
        return footballMatchRepository.findByStatus(MatchStatus.SCHEDULED);
    }

    public List<FootballMatch> getFinishedMatches() {
        return footballMatchRepository.findByStatus(MatchStatus.FINISHED);
    }
}