package com.capstone.hodleservice.security.service;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.capstone.hodleservice.security.entity.Asset;
import com.capstone.hodleservice.security.entity.Movement;
import com.capstone.hodleservice.security.entity.Wallet;
import com.capstone.hodleservice.security.enumerated.AssetType;
import com.capstone.hodleservice.security.enumerated.CurrencyOptions;
import com.capstone.hodleservice.security.enumerated.MovementType;
import com.capstone.hodleservice.security.repository.MovementRepository;

@Service
public class MovementService {

	private Logger log = LoggerFactory.getLogger(MovementService.class);
	
	@Autowired MovementRepository repo;
	
	@Autowired AssetService aSvc;
	@Autowired UserService uSvc;
	@Autowired WalletService wSvc;

	
	@Autowired @Qualifier("movement") private ObjectProvider<Movement> provider;
	
	//POST METHODS
	public Movement addIncoming(Long userId, 
								Long walletId, 
								Long assetId, 
								Double assetAmmount) {
		
		Double pp = this.getPurchasePrice(userId, assetId, assetId);
		
		Movement m = provider.getObject().builder()
					.movementType(MovementType.INCOMING)
					.number(repo.findByUserId(userId).size()+1l)
					.userId(userId)
					.startingWalletId(walletId)
					.endingWalletId(walletId)
					.startingAssetId(assetId)
					.endingAssetId(assetId)
					.startingAssetAmmount(assetAmmount)
					.endingAssetAmmount(assetAmmount)
					.purchasePrice(pp)
					.date(LocalDate.now())
					.build();
		repo.save(m);
			
		aSvc.addAmount(pp, assetId, assetAmmount);
		
		wSvc.updateValue(true, walletId, (assetAmmount * pp));
		
		System.out.println();
		log.info("Incoming movement Id: " + m.getId() + " added succesfully.");
		return m;
	};
	
	public Movement addOutgoing(Long userId, 
								Long walletId, 
								Long assetId, 
								Double assetAmmount) {
			
		Movement m = provider.getObject().builder()
				.movementType(MovementType.OUTGOING)
				.number(repo.findByUserId(userId).size()+1l)
				.userId(userId)
				.startingWalletId(walletId)
				.endingWalletId(walletId)
				.startingAssetId(assetId)
				.endingAssetId(assetId)
				.startingAssetAmmount(assetAmmount)
				.endingAssetAmmount(assetAmmount)
				.date(LocalDate.now())
				.build();
		repo.save(m);
		aSvc.removeAmount(assetId, assetAmmount);
		
		Asset a = aSvc.findById(assetId);
		wSvc.updateValue(false, walletId, (assetAmmount * a.getMarketPrice()));
		
		System.out.println();
		log.info("Outgoing movement Id: " + m.getId() + " added succesfully.");
		return m;
	};
	
	public Movement addTransfer(Long userId, 
								Long startingWalletId, 
								Long endingWalletId, 
								Long assetId, 
								Double assetAmmount) {
		
		Asset a = aSvc.findById(assetId);
		
		Movement m = provider.getObject().builder()
				.movementType(MovementType.TRANSFER)
				.number(repo.findByUserId(userId).size()+1l)
				.userId(userId)
				.startingWalletId(startingWalletId)
				.endingWalletId(endingWalletId)
				.startingAssetId(assetId)
				.endingAssetId(assetId)
				.startingAssetAmmount(assetAmmount)
				.endingAssetAmmount(assetAmmount)
				.purchasePrice(a.getAveragePurchasePrice())
				.date(LocalDate.now())
				.build();
		repo.save(m);
		
		aSvc.transferAmount(startingWalletId, endingWalletId, assetId, assetAmmount, a.getAveragePurchasePrice());
		
		System.out.println();
		log.info("Transfer movement Id: " + m.getId() + " added succesfully.");
		return m;
	};
	
	public Movement addConvert(Long userId) {
		Movement m = provider.getObject().builder()
				.movementType(MovementType.CONVERT)
				.build();
		repo.save(m);
		System.out.println();
		log.info("Convert movement Id: " + m.getId() + " added succesfully.");
		return m;
	};
	
	//GET METHODS
	public Movement findById(long id) {
		Movement m = repo.findById(id).get();
		log.info(m.toString());
		return m;
	}
		
	public List<Movement> findByUserId(long userId) {
		List<Movement> l = repo.findByUserId(userId);
		l.forEach(m -> m.toString());
		return l;
	}
		
	public List<Movement> findByWalletId(long walletId) {
		List<Movement> l = repo.findByEndingWalletId(walletId);
		l.forEach(m -> m.toString());
		return l;
	}
	
	//OTHER METHODS
	public Double getPurchasePrice(Long userId, Long startingAssetId, Long endingAssetId) {
		
		Asset startingAsset = aSvc.findById(startingAssetId);
		Asset endingAsset = aSvc.findById(endingAssetId);
		String stringCurrency = uSvc.findById(1).getCurrency().name();
		
		if (endingAsset.equals(startingAsset) && endingAsset.getTicker().equals(stringCurrency)) {
			return 1.00;
		}else{
			Double mp = endingAsset.getMarketPrice();
			return mp;
		}
		
		
	}
	
}
