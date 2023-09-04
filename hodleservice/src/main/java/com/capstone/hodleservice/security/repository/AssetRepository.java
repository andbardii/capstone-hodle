package com.capstone.hodleservice.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.capstone.hodleservice.security.entity.Asset;

public interface AssetRepository  extends JpaRepository<Asset, Long>{

}
