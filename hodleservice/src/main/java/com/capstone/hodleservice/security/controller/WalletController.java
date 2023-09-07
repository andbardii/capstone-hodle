package com.capstone.hodleservice.security.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.hodleservice.security.entity.Todo;
import com.capstone.hodleservice.security.entity.Wallet;
import com.capstone.hodleservice.security.enumerated.WalletType;
import com.capstone.hodleservice.security.service.WalletService;

@RestController
@CrossOrigin(origins="*")
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
	
	@GetMapping("/byuser/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> findByUserId(@PathVariable Long userId) {
		List<Wallet> l = svc.findByUserId(userId);
		ResponseEntity<List<Wallet>> resp = new ResponseEntity<List<Wallet>> (l, HttpStatus.OK);
		return resp;
	}
	
	//POST METHODS
	@PostMapping("/add/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addWallet(@PathVariable Long userId, @RequestBody WalletType type) {
        Wallet w = svc.addWallet(type, userId);
        return new ResponseEntity<Wallet>(w, HttpStatus.CREATED);
    }
	
}
