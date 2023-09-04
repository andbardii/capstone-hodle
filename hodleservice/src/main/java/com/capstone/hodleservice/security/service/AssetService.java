package com.capstone.hodleservice.security.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.capstone.hodleservice.security.entity.Asset;
import com.capstone.hodleservice.security.entity.Wallet;
import com.capstone.hodleservice.security.enumerated.AssetClass;
import com.capstone.hodleservice.security.enumerated.AssetType;
import com.capstone.hodleservice.security.enumerated.AssetZone;
import com.capstone.hodleservice.security.enumerated.WalletType;
import com.capstone.hodleservice.security.repository.AssetRepository;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Service
public class AssetService {

	private Logger log = LoggerFactory.getLogger(AssetService.class);
	
	@Autowired AssetRepository repo;
	
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
			Double ammount,
			String ISIN,
		    Double tax,
		    String exchange,
		    Double averagePurchasePrice,
		    Double paidCommission,
		    Double marketPrice,
		    Double marketValue) {

			Asset a = provider.getObject().builder()
				    .walletId(walletId)
				    .name(name)
					.ticker(ticker)
					.assetType(assetType)
					.assetClass(assetClass)
					.zone(zone)
					.issuer(issuer)
					.intermediary(intermediary)
					.ammount(ammount)
					.ISIN(ISIN)
					.tax(tax)
					.exchange(exchange)
					.averagePurchasePrice(averagePurchasePrice)
					.paidCommission(paidCommission)
					.marketPrice(marketPrice)
					.marketValue(marketValue)
					.build();
			repo.save(a);
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
	
}
