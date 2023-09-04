package com.capstone.hodleservice.security.service;

import java.util.List;

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
					.number(this.findByUserId(userId).size()+1l)
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
	
	public List<Wallet> findAll(){
		List<Wallet> l = (List<Wallet>)repo.findAll();
		l.forEach(c -> log.info(c.toString()));
		return l;
	}
	
	public List<Wallet> findByUserId(long id) {
		List<Wallet> l = repo.findByUserId(id);
		l.forEach(w -> w.toString());
		return l;
	}
	
	//DELETE METHOD
	public void deleteWallet(Long id) {
		repo.deleteById(id);
		log.info("Wallet" + id + "eliminato con successo");
	}
}
