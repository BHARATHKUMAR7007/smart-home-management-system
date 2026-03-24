package com.smarthome.backend.repository;

import com.smarthome.backend.model.AutomationRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AutomationRuleRepository extends JpaRepository<AutomationRule, Long> {
}
