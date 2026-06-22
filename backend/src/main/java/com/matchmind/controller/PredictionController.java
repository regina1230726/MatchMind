package com.matchmind.controller;

import com.matchmind.dto.PredictionDTO;
import com.matchmind.mapper.DtoMapper;
import com.matchmind.model.Prediction;
import com.matchmind.service.PredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PredictionController {

    private final PredictionService predictionService;

    @GetMapping
    public List<PredictionDTO> getAllPredictions() {
        return predictionService.getAllPredictions()
                .stream()
                .map(DtoMapper::toPredictionDTO)
                .toList();
    }

    @GetMapping("/match/{matchId}")
    public PredictionDTO getPredictionByMatchId(@PathVariable Long matchId) {
        return DtoMapper.toPredictionDTO(
                predictionService.getPredictionByMatchId(matchId)
        );
    }
}