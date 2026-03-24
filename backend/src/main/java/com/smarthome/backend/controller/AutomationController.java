package com.smarthome.backend.controller;

import com.smarthome.backend.model.AutomationRule;
import com.smarthome.backend.repository.AutomationRuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/automation")

public class AutomationController {

    @Autowired
    private AutomationRuleRepository repository;

    @GetMapping
    public List<AutomationRule> getAllRules() {
        return repository.findAll();
    }

    @PostMapping
    public AutomationRule createRule(@RequestBody AutomationRule rule) {
        return repository.save(rule);
    }

    @DeleteMapping("/{id}")
    public void deleteRule(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
