package com.capstone.hodleservice.security.entity;

import java.time.LocalDate;
import java.util.List;

import com.capstone.hodleservice.security.enumerated.AssetClass;
import com.capstone.hodleservice.security.enumerated.AssetType;
import com.capstone.hodleservice.security.enumerated.AssetZone;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
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
@Table(name="points")
public class Point {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable= false)
	private Long walletId;
	
	@ManyToMany
	private List<Asset> assets;
	
	private LocalDate date;
	private Double invested;
	private Double value;
	private Double high;
	private Double low;
}
