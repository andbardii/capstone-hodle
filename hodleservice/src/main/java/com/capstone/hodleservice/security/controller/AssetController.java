package com.capstone.hodleservice.security.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.hodleservice.security.entity.Asset;
import com.capstone.hodleservice.security.service.AssetService;

@RestController
@RequestMapping("/api/asset")
public class AssetController {

@Autowired AssetService svc;
	
	//GET METHODS
	@GetMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> findById(@PathVariable Long id) {
		Asset a = svc.findById(id);
		ResponseEntity<Asset> resp = new ResponseEntity<Asset>(a, HttpStatus.OK);
		return resp;
	}
}
