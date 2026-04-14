package com.mmarkov.eduteach.controller;

import com.mmarkov.eduteach.dto.play.*;
import com.mmarkov.eduteach.service.PlayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/play")
@RequiredArgsConstructor
public class PlayController {

    private final PlayService playService;

    /**
     * Старт прохождения ситуации.
     * Создаёт метрики из стартовых значений проблемы.
     * Если прохождение уже было — перезапускает.
     */
    @PostMapping("/situations/{situationId}/start")
    public ResponseEntity<StartSessionResponse> startSession(
            @PathVariable Integer situationId) {
        return ResponseEntity.ok(playService.startSession(situationId));
    }

    /**
     * Получить текущий узел и метрики.
     * Используется для восстановления состояния после обновления страницы.
     */
    @GetMapping("/situations/{situationId}/node/{nodeId}")
    public ResponseEntity<StartSessionResponse> getNode(
            @PathVariable Integer situationId,
            @PathVariable Integer nodeId) {
        return ResponseEntity.ok(playService.getNode(situationId, nodeId));
    }

    /**
     * Совершить выбор на текущем узле.
     * Применяет дельты метрик и возвращает следующий узел.
     */
    @PostMapping("/situations/{situationId}/choose")
    public ResponseEntity<ChooseResponse> choose(
            @PathVariable Integer situationId,
            @Valid @RequestBody ChooseRequest request) {
        return ResponseEntity.ok(playService.choose(situationId, request.getChoiceId()));
    }

    /**
     * Получить итоговый результат прохождения.
     * Проверяет метрики по нормативам и определяет SUCCESS/PARTIAL_SUCCESS/FAILURE.
     */
    @GetMapping("/situations/{situationId}/result")
    public ResponseEntity<ResultResponse> getResult(
            @PathVariable Integer situationId) {
        return ResponseEntity.ok(playService.getResult(situationId));
    }
}