package com.mmarkov.eduteach.controller;

import com.mmarkov.eduteach.dto.history.HistoryItemDto;
import com.mmarkov.eduteach.service.HistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/play")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryService historyService;

    /**
     * История прохождений текущего пользователя.
     * Возвращает список с итоговыми метриками и результатом по каждой ситуации.
     */
    @GetMapping("/history")
    public ResponseEntity<List<HistoryItemDto>> getHistory() {
        return ResponseEntity.ok(historyService.getHistory());
    }
}