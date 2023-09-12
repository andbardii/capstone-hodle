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
import com.capstone.hodleservice.security.entity.Point;
import com.capstone.hodleservice.security.entity.Wallet;
import com.capstone.hodleservice.security.repository.PointRepository;

@Service
public class PointService {
	
	private Logger log = LoggerFactory.getLogger(PointService.class);

	@Autowired PointRepository repo;
		
	@Autowired @Qualifier("point") private ObjectProvider<Point> provider;
	
	// POST METHODS
	public Point addPoint(Long walletId, Double limit, List<Asset> assets) {
		Point p = provider.getObject().builder()
				  .date(LocalDate.now())
				  .walletId(walletId)
				  .invested(limit)
				  .assets(assets)
				  .build();
		repo.save(p);
		log.info("New Point saved for wallet Id: " + walletId);
		return p;
	}
	
	// GET METHODS
	public Point findById(long id) {
		Point p = repo.findById(id).get();
		log.info(p.toString());
		return p;
	}
	
	public List<Point> findByWalletId(Long walletId) {
		List<Point> l = repo.findByWalletId(walletId);
		return l;
	}
	
	public Point findByWalletIdAndDate(Long walletId, LocalDate date) {
		Point p = repo.findByWalletIdAndDate(walletId, date);
		log.info(p.toString());
		return p;
	}
	// OTHER METHODS
	public Point handlePoint(Long walletId, Double limit, List<Asset> assets) {
		
		LocalDate today = LocalDate.now();
		boolean exist = repo.existsByWalletIdAndDate(walletId, today);
		
		if(exist) {
			Point p = repo.findByWalletIdAndDate(walletId, today);
			p.setAssets(assets);
			p.setInvested(limit);
			repo.save(p);
			log.info("Point updated correctly");
			return p;
		}else {
			Point p = this.addPoint(walletId, limit, assets);
			return p;
			
		}
		
	}
}
