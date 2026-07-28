package com.matchmind.service;

import com.matchmind.model.FootballMatch;
import com.matchmind.model.MatchStatus;
import com.matchmind.model.Prediction;
import com.matchmind.model.PredictionOutcome;
import com.matchmind.repository.FootballMatchRepository;
import com.matchmind.repository.PredictionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PredictionGenerationService {

    private final FootballMatchRepository footballMatchRepository;
    private final PredictionRepository predictionRepository;

    private final Path mlDirectory = Path.of(
            "C:",
            "Users",
            "Regina",
            "Desktop",
            "MatchMind",
            "ml"
    ).toAbsolutePath().normalize();
    private final Path currentMatchesPath = mlDirectory.resolve("data").resolve("current_matches.csv");
    private final Path predictionsOutputPath = mlDirectory.resolve("data").resolve("predictions_output.csv");

    @Transactional
    public void generatePredictions() {
        List<FootballMatch> scheduledMatches =
                footballMatchRepository.findByStatus(MatchStatus.SCHEDULED);

        writeCurrentMatchesCsv(scheduledMatches);
        runPythonPredictionScript();
        importPredictionsFromCsv();
    }

    private void writeCurrentMatchesCsv(List<FootballMatch> matches) {
        StringBuilder csv = new StringBuilder();
        csv.append("match_id,home_team,away_team\n");

        for (FootballMatch match : matches) {
            csv.append(match.getId()).append(",");
            csv.append(match.getHomeTeam().getName()).append(",");
            csv.append(match.getAwayTeam().getName()).append("\n");
        }

        try {
            Files.createDirectories(currentMatchesPath.getParent());
            Files.writeString(currentMatchesPath, csv.toString());
        } catch (IOException e) {
            throw new RuntimeException("Failed to write current_matches.csv at " + currentMatchesPath, e);
        }
    }

    private void runPythonPredictionScript() {
        ProcessBuilder processBuilder = new ProcessBuilder(
                "python",
                "scripts/predict_matches.py"
        );

        processBuilder.directory(mlDirectory.toFile());
        processBuilder.redirectErrorStream(true);

        try {
            Process process = processBuilder.start();

            String output;
            try (BufferedReader reader = process.inputReader()) {
                output = String.join("\n", reader.lines().toList());
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("Python prediction script failed:\n" + output);
            }

        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to execute Python prediction script", e);
        }
    }

    private void importPredictionsFromCsv() {
        try (BufferedReader reader = Files.newBufferedReader(predictionsOutputPath)) {
            reader.readLine();

            String line;

            while ((line = reader.readLine()) != null) {
                String[] columns = line.split(",");

                Long matchId = Long.parseLong(columns[0]);
                Double homeWinProbability = Double.parseDouble(columns[3]);
                Double drawProbability = Double.parseDouble(columns[4]);
                Double awayWinProbability = Double.parseDouble(columns[5]);
                PredictionOutcome predictedOutcome = PredictionOutcome.valueOf(columns[6]);

                Double expectedHomeGoals = Double.parseDouble(columns[7]);
                Double expectedAwayGoals = Double.parseDouble(columns[8]);
                Integer predictedHomeScore = Integer.parseInt(columns[9]);
                Integer predictedAwayScore = Integer.parseInt(columns[10]);

                FootballMatch match = footballMatchRepository.findById(matchId)
                        .orElseThrow(() -> new RuntimeException("Match not found: " + matchId));

                Prediction prediction = predictionRepository.findByMatchId(matchId)
                        .orElseGet(() -> Prediction.builder()
                                .match(match)
                                .build());

                prediction.setHomeWinProbability(homeWinProbability);
                prediction.setDrawProbability(drawProbability);
                prediction.setAwayWinProbability(awayWinProbability);
                prediction.setPredictedOutcome(predictedOutcome);
                prediction.setExpectedHomeGoals(expectedHomeGoals);
                prediction.setExpectedAwayGoals(expectedAwayGoals);
                prediction.setPredictedHomeScore(predictedHomeScore);
                prediction.setPredictedAwayScore(predictedAwayScore);
                prediction.setModelVersion("v1.1");
                prediction.setGeneratedAt(LocalDateTime.now());

                predictionRepository.save(prediction);
            }

        } catch (IOException e) {
            throw new RuntimeException("Failed to read predictions_output.csv", e);
        }
    }
}