package com.matchmind.controller;

import com.matchmind.dto.TeamDTO;
import com.matchmind.mapper.DtoMapper;
import com.matchmind.model.Team;
import com.matchmind.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    public List<TeamDTO> getAllTeams() {
        return teamService.getAllTeams()
                .stream()
                .map(DtoMapper::toTeamDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public TeamDTO getTeamById(@PathVariable Long id) {
        return DtoMapper.toTeamDTO(teamService.getTeamById(id));
    }
}