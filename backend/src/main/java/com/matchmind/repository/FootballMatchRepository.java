package com.matchmind.repository;

import com.matchmind.model.FootballMatch;
import com.matchmind.model.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FootballMatchRepository extends JpaRepository<FootballMatch, Long> {

    List<FootballMatch> findByStatus(MatchStatus status);
}