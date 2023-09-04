package com.capstone.hodleservice.security.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.capstone.hodleservice.security.entity.Wallet;
import com.capstone.hodleservice.security.enumerated.WalletType;
import com.capstone.hodleservice.security.repository.WalletRepository;

@Service
public class WalletService {

	private Logger log = LoggerFactory.getLogger(WalletService.class);
	
	@Autowired WalletRepository repo;
	
	@Autowired @Qualifier("wallet") private ObjectProvider<Wallet> provider;
	
	//POST METHODS
	public Wallet addWallet(WalletType type, Long userId, Double value) {

			Wallet w = provider.getObject().builder()
				    .walletType(type)
				    .userId(userId)
					.value(value)
					.build();
			repo.save(w);
			System.out.println();
			log.info("Wallet Id: " + w.getId() + " aggiunto correttamente.");
			return w;
			}
	
	//GET METHODS
	public Wallet findById(long id) {
		Wallet w = repo.findById(id).get();
		log.info(w.toString());
		return w;
	}
	
	
}
