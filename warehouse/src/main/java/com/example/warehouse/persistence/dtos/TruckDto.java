package com.example.warehouse.persistence.dtos;

import com.example.warehouse.persistence.entity.Truck;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class TruckDto {

    private String chassisNumber;

    private String licensePlate;

    public Truck toEntity() {
        Truck truck = new Truck();
        truck.setChassisNumber(chassisNumber);
        truck.setLicensePlate(licensePlate);
        return truck;
    }

    public static TruckDto fromEntity(Truck truck) {
        TruckDto truckDto = new TruckDto();
        truckDto.chassisNumber = truck.getChassisNumber();
        truckDto.licensePlate = truck.getLicensePlate();
        return truckDto;
    }

}
