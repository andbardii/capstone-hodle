package com.capstone.hodleservice.security.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.hodleservice.security.entity.Point;
import com.capstone.hodleservice.security.service.PointService;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api/point")
public class PointController {
	
	@Autowired PointService svc;
	
		//GET METHODS
		@GetMapping("/{id}")
		@PreAuthorize("isAuthenticated()")
		public ResponseEntity<?> findById(@PathVariable Long id) {
			Point p = svc.findById(id);
			ResponseEntity<Point> resp = new ResponseEntity<Point>(p, HttpStatus.OK);
			return resp;
		}
		
		@GetMapping("/bywallet/{walletId}")
		@PreAuthorize("isAuthenticated()")
		public ResponseEntity<?> findByWalletId(@PathVariable Long walletId) {
			List<Point> l = svc.findByWalletId(walletId);
			ResponseEntity<List<Point>> resp = new ResponseEntity<List<Point>>(l, HttpStatus.OK);
			return resp;
		}

		@GetMapping("/bydate/{walletId}")
		@PreAuthorize("isAuthenticated()")
		public ResponseEntity<?> findByWalletIdAndDate(@PathVariable Long walletId, @PathVariable LocalDate date) {
			Point p = svc.findByWalletIdAndDate(walletId, date);
			ResponseEntity<Point> resp = new ResponseEntity<Point>(p, HttpStatus.OK);
			return resp;
		}
}
