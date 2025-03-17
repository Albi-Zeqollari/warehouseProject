package com.example.warehouse.persistence.dtos;

import com.example.warehouse.persistence.entity.Truck;
import jakarta.persistence.Column;
import lombok.Data;

@Data
public class TruckDto {

    private  Long id;

    private String chassisNumber;

    private String licensePlate;


    public Truck toEntity() {
        Truck truck = new Truck();
        truck.setChassisNumber(chassisNumber);
        truck.setLicensePlate(licensePlate);
        truck.setId(id);
        return truck;
    }

    public static TruckDto fromEntity(Truck truck) {
        TruckDto truckDto = new TruckDto();
        truckDto.chassisNumber = truck.getChassisNumber();
        truckDto.licensePlate = truck.getLicensePlate();
        truckDto.id = truck.getId();
        return truckDto;
    }

}
