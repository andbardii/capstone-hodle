package com.capstone.hodleservice.security.entity;

import java.time.LocalDate;

import com.capstone.hodleservice.security.enumerated.AssetClass;
import com.capstone.hodleservice.security.enumerated.AssetType;
import com.capstone.hodleservice.security.enumerated.AssetZone;
import com.capstone.hodleservice.security.enumerated.MovementType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Entity
@Table(name="movements")
public class Movement {

	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Enumerated(EnumType.STRING)
	private MovementType movementType;
	
	@Column(nullable= false)
	private Long userId;
	
	private Long number; 
	
	private Long startingWalletId;
	private Long endingWalletId;
	
	private Long startingAssetId;
	private Long endingAssetId;
	
	private Double startingAssetAmmount;
	private Double endingAssetAmmount;
	
	private Double purchasePrice;
	
	private LocalDate date;

}
