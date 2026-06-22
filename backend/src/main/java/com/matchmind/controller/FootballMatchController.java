package com.matchmind.controller;

import com.matchmind.dto.FootballMatchDTO;
import com.matchmind.mapper.DtoMapper;
import com.matchmind.model.FootballMatch;
import com.matchmind.service.FootballMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class FootballMatchController {

    private final FootballMatchService footballMatchService;

    @GetMapping
    public List<FootballMatchDTO> getAllMatches() {
        return footballMatchService.getAllMatches()
                .stream()
                .map(DtoMapper::toFootballMatchDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public FootballMatchDTO getMatchById(@PathVariable Long id) {
        return DtoMapper.toFootballMatchDTO(
                footballMatchService.getMatchById(id)
        );
    }

    @GetMapping("/upcoming")
    public List<FootballMatchDTO> getUpcomingMatches() {
        return footballMatchService.getUpcomingMatches()
                .stream()
                .map(DtoMapper::toFootballMatchDTO)
                .toList();
    }

    @GetMapping("/finished")
    public List<FootballMatchDTO> getFinishedMatches() {
        return footballMatchService.getFinishedMatches()
                .stream()
                .map(DtoMapper::toFootballMatchDTO)
                .toList();
    }
}