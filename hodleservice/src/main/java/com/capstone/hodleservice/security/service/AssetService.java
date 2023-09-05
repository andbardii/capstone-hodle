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
import com.capstone.hodleservice.security.enumerated.AssetClass;
import com.capstone.hodleservice.security.enumerated.AssetType;
import com.capstone.hodleservice.security.enumerated.AssetZone;
import com.capstone.hodleservice.security.enumerated.MovementType;
import com.capstone.hodleservice.security.repository.AssetRepository;

@Service
public class AssetService {

	private Logger log = LoggerFactory.getLogger(AssetService.class);
	
	@Autowired AssetRepository repo;
	
	@Autowired WalletService wSvc;
	
	@Autowired @Qualifier("asset") private ObjectProvider<Asset> provider;
	
	//POST METHODS
	public Asset addAsset(
			Long walletId,
			String name,
			String ticker,
			AssetType assetType,
			AssetClass assetClass,
			AssetZone zone,
			String issuer,
			String intermediary,
			Double amount,
			String ISIN,
		    Double tax,
		    String exchange,
		    Double marketPrice,
		    Double averagePurchasePrice,
		    Double paidCommission) {

			Asset a = provider.getObject().builder()
				    .walletId(walletId)
				    .name(name)
					.ticker(ticker)
					.assetType(assetType)
					.assetClass(assetClass)
					.zone(zone)
					.issuer(issuer)
					.intermediary(intermediary)
					.amount(amount)
					.ISIN(ISIN)
					.tax(tax)
					.exchange(exchange)
					.averagePurchasePrice(averagePurchasePrice)
					.marketPrice(marketPrice)
					.marketValue(marketPrice * amount)
					.paidCommission(paidCommission)
					.build();
			repo.save(a);

			wSvc.updateValue(true, walletId,(Double)(marketPrice * amount));
			
			System.out.println();
			log.info("Asset Id: " + a.getId() + " aggiunto correttamente.");
			return a;
			}
	
	//GET METHODS
	public Asset findById(long id) {
		Asset a = repo.findById(id).get();
		log.info(a.toString());
		return a;
	}
	
	public List<Asset> findByWalletId(long id) {
		List<Asset> l = repo.findByWalletId(id);
		l.forEach(a -> a.toString());
		return l;
	}
	
	//PUT METHODS
	public Asset addAmount(Double purchasePrice, Long assetId, Double assetAmmount) {
		
		Asset a = repo.findById(assetId).get();
		
		if(a.getAveragePurchasePrice() == 0.00) {
			a.setAveragePurchasePrice(purchasePrice);
			a.setAmount(a.getAmount() + assetAmmount);
			a.setMarketValue(a.getMarketPrice() * a.getAmount());
			repo.save(a);
			return a;
		}else {
			Double total = (a.getAmount() * a.getAveragePurchasePrice())+(assetAmmount * purchasePrice);

			Double averagePurchasePrice = total / (a.getAmount() + assetAmmount);
			a.setAveragePurchasePrice(averagePurchasePrice);
			a.setAmount(a.getAmount() + assetAmmount);
			a.setMarketValue(a.getMarketPrice() * a.getAmount());
			repo.save(a);
			return a;
		}

		
	}
	
	public Asset removeAmount(Long assetId, Double assetAmmount) {
		Asset a = repo.findById(assetId).get();
		a.setAmount(a.getAmount() - assetAmmount);
		a.setMarketValue(a.getMarketPrice() * a.getAmount());
		repo.save(a);
		return a;
	}
	
	public Asset transferAmount(Long startingWalletId, Long endingWalletId, 
								Long assetId, Double assetAmmount, Double purchasePrice) {
		
		this.removeAmount(assetId, assetAmmount);
		
		Asset a = this.findById(assetId);
		List<Asset> l = this.findByWalletId(endingWalletId);
		
		boolean exist = false;
		Long asId = 0l;

		for(Asset as : l) {
			if(as.getTicker().equals(a.getTicker())) {
				exist = true;
				asId = as.getId();
				this.addAmount(a.getAveragePurchasePrice(), as.getId(), assetAmmount);
			}
		};
		
		if(exist) {
			Asset finalAs = this.findById(asId);
			return finalAs;
		}else{
			Asset finalAs = this.addAsset(endingWalletId, a.getName(), 
										  a.getTicker(), a.getAssetType(), 
										  a.getAssetClass(), a.getZone(), 
										  a.getIssuer(), a.getIntermediary(), 
										  assetAmmount, a.getISIN(), 
										  a.getTax(), a.getExchange(), 
										  a.getMarketPrice(), purchasePrice, 0.00);
			return finalAs;
		}
	}
	
	//DELETE METHODS
	public void deleteAsset(Long id) {
		repo.deleteById(id);
		log.info("Asset" + id + "eliminato con successo");
	}
	
}
