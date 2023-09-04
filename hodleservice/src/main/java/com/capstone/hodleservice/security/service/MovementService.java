package com.capstone.hodleservice.security.service;

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
import com.capstone.hodleservice.security.enumerated.MovementType;
import com.capstone.hodleservice.security.repository.MovementRepository;

@Service
public class MovementService {

	private Logger log = LoggerFactory.getLogger(MovementService.class);
	
	@Autowired MovementRepository repo;
	
	@Autowired AssetService aSvc;
	
	@Autowired @Qualifier("movement") private ObjectProvider<Movement> provider;
	
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
	
	//POST METHODS
	public Movement addIncoming(Long userId, 
								Long walletId, 
								Long assetId, 
								Double assetAmmount) {
		
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
					.purchasePrice(this.getPurchasePrice(assetId, assetId))
					.build();
		repo.save(m);
		
		List<Movement> olderMovements = repo.findByEndingWalletIdAndEndingAssetId(walletId, assetId);
		aSvc.addAmount(this.getPurchasePrice(assetId, assetId), assetId, assetAmmount, olderMovements);
		
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
				.build();
				
		repo.save(m);
	
		List<Movement> olderMovements = repo.findByEndingWalletIdAndEndingAssetId(walletId, assetId);
		aSvc.addAmount(this.getPurchasePrice(assetId, assetId), assetId, assetAmmount, olderMovements);
	
		System.out.println();
		log.info("Outgoing movement Id: " + m.getId() + " added succesfully.");
		return m;
	};
	
	public Movement addTransfer(Long userId) {
		Movement m = provider.getObject().builder()
				.movementType(MovementType.TRANSFER)
				.build();
		repo.save(m);
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
	
	//PRIVATE METHODS
	private Double getPurchasePrice(Long startingAssetId, Long endingAssetId) {
		
		Asset startingAsset = aSvc.findById(startingAssetId);
		Asset endingAsset = aSvc.findById(endingAssetId);
		
		if (startingAsset.getAssetType().equals(AssetType.FIAT) && endingAsset.equals(startingAsset)) {
			return 1.00;
		}else{
			Double mp = endingAsset.getMarketPrice();
			return mp;
		}
		
		
	}
	
}
