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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.hodleservice.security.entity.Todo;
import com.capstone.hodleservice.security.entity.Wallet;
import com.capstone.hodleservice.security.enumerated.WalletType;
import com.capstone.hodleservice.security.service.TodoService;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/api/todo")
public class TodoController {

	@Autowired TodoService svc;
	
	//GET METHODS
	@GetMapping("/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> findById(@PathVariable Long id) {
		Todo t = svc.findById(id);
		ResponseEntity<Todo> resp = new ResponseEntity<Todo>(t, HttpStatus.OK);
		return resp;
	}
	
	@GetMapping("/byuser/{userId}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> findByUserId(@PathVariable Long userId) {
		List<Todo> l = svc.findByUserId(userId);
		ResponseEntity<List<Todo>> resp = new ResponseEntity<List<Todo>> (l, HttpStatus.OK);
		return resp;
	}
	
	@GetMapping("/bystatus/{userId}/{status}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> findByUserAndStatus(@PathVariable Long userId, @PathVariable boolean status) {
		List<Todo> l = svc.findByUserAndStatus(userId, status);
		ResponseEntity<List<Todo>> resp = new ResponseEntity<List<Todo>> (l, HttpStatus.OK);
		return resp;
	}
	
	//POST METHODS
	@PostMapping("/add")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> addTodo(@RequestBody Todo todo) {
	     Todo t = svc.addTodo(todo.getUserId(), todo.getTitle(), todo.getDescription());
	     return new ResponseEntity<Todo>(t, HttpStatus.CREATED);
	}
	
	//PUT METHODS
	@PutMapping("/togstatus/{id}")
//	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> toggleStaus(@PathVariable Long id) {
	     Todo t = svc.toggleStatus(id);
	     return new ResponseEntity<Todo>(t, HttpStatus.CREATED);
	}
}
