package com.capstone.hodleservice.security.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.hodleservice.security.entity.Wallet;
import com.capstone.hodleservice.security.service.WalletService;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

	@Autowired WalletService svc;
	
	//GET METHODS
	@GetMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> findById(@PathVariable Long id) {
		Wallet w = svc.findById(id);
		ResponseEntity<Wallet> resp = new ResponseEntity<Wallet>(w, HttpStatus.OK);
		return resp;
	}
	
}
