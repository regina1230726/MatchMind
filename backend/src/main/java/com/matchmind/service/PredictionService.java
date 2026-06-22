package com.matchmind.service;

import com.matchmind.model.Prediction;
import com.matchmind.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PredictionService {

    private final PredictionRepository predictionRepository;

    public List<Prediction> getAllPredictions() {
        return predictionRepository.findAll();
    }

    public Prediction getPredictionByMatchId(Long matchId) {
        return predictionRepository.findByMatchId(matchId)
                .orElseThrow(() ->
                        new RuntimeException("Prediction not found for match " + matchId));
    }
}