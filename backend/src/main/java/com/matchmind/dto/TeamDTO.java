package com.matchmind.dto;

public record TeamDTO(
        Long id,
        String name,
        String code,
        String flagUrl,
        Integer fifaRanking,
        String groupName
) {}