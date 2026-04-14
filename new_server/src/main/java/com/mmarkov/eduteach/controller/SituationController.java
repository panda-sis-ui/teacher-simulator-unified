package com.mmarkov.eduteach.controller;

import com.mmarkov.eduteach.dto.situation.SituationDetailDto;
import com.mmarkov.eduteach.dto.situation.SituationListItemDto;
import com.mmarkov.eduteach.service.SituationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/situations")
@RequiredArgsConstructor
public class SituationController {

    private final SituationService situationService;

    /**
     * Список всех доступных ситуаций.
     */
    @GetMapping
    public ResponseEntity<List<SituationListItemDto>> getAll() {
        return ResponseEntity.ok(situationService.getAll());
    }

    /**
     * Детальная информация о ситуации:
     * контекст, проблема, участники, id стартового узла.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SituationDetailDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(situationService.getById(id));
    }
}