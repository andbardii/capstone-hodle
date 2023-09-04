package com.capstone.hodleservice.security.runner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.capstone.hodleservice.security.service.UserService;

@Component
public class ServicesRunner implements ApplicationRunner {

	@Autowired UserService uservSvc;
	
	@Override
	public void run(ApplicationArguments args) throws Exception {
		
	}

}
