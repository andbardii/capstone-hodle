package com.capstone.hodleservice.security.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.hodleservice.security.entity.Movement;
import com.capstone.hodleservice.security.service.MovementService;

@RestController
@RequestMapping("/api/movement")
public class MovementController {
	
	@Autowired MovementService svc;
	
	//GET METHODS
	@GetMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> findById(@PathVariable Long id) {
		Movement m = svc.findById(id);
		ResponseEntity<Movement> resp = new ResponseEntity<Movement>(m, HttpStatus.OK);
		return resp;
	}
	
	@GetMapping("/byuser/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> findByUserId(@PathVariable Long userId) {
		List<Movement> l = svc.findByUserId(userId);
		ResponseEntity<List<Movement>> resp = new ResponseEntity<List<Movement>>(l, HttpStatus.OK);
		return resp;
	}
}
