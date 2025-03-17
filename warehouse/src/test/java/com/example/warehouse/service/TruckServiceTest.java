package com.example.warehouse.service;

import com.example.warehouse.persistence.dtos.TruckDto;
import com.example.warehouse.persistence.entity.Truck;
import com.example.warehouse.persistence.repository.TruckRepository;
import com.example.warehouse.persistence.service.impl.TruckServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TruckServiceTest {

    @Mock
    private TruckRepository truckRepository;

    @InjectMocks
    private TruckServiceImpl truckService;

    @Test
    void testCreateTruck() {

        TruckDto truckDto = new TruckDto();
        truckDto.setId(1L);
        truckDto.setChassisNumber("CH123");
        truckDto.setLicensePlate("ABC-123");

        when(truckRepository.save(any(Truck.class))).thenAnswer(invocation -> invocation.getArgument(0));

        truckService.createTruck(truckDto);

        verify(truckRepository, times(1)).save(argThat((Truck t) ->
                "CH123".equals(t.getChassisNumber()) &&
                        "ABC-123".equals(t.getLicensePlate())
        ));
    }

    @Test
    void testGetAllTrucks() {

        Truck truck1 = new Truck();
        truck1.setId(1L);
        truck1.setChassisNumber("CH123");
        truck1.setLicensePlate("ABC-123");

        Truck truck2 = new Truck();
        truck2.setId(2L);
        truck2.setChassisNumber("CH456");
        truck2.setLicensePlate("XYZ-789");

        when(truckRepository.findAll()).thenReturn(Arrays.asList(truck1, truck2));

        List<TruckDto> result = truckService.getAllTrucks();

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals("CH123", result.get(0).getChassisNumber());
        assertEquals("ABC-123", result.get(0).getLicensePlate());

        assertEquals(2L, result.get(1).getId());
        assertEquals("CH456", result.get(1).getChassisNumber());
        assertEquals("XYZ-789", result.get(1).getLicensePlate());

        verify(truckRepository, times(1)).findAll();
    }

    @Test
    void testUpdateTruck() {

        Truck truck = new Truck();
        truck.setId(1L);
        truck.setLicensePlate("ABC-123");
        truck.setChassisNumber("CH123");

        truckService.updateTruck(truck);

        verify(truckRepository, times(1))
                .updateTruckById("ABC-123", "CH123", 1L);
    }

    @Test
    void testDeleteTruck() {

        Long truckId = 42L;
        truckService.deleteTruck(truckId);
        verify(truckRepository, times(1)).deleteById(truckId);
    }

    @Test
    void testGetAvailableTrucks() {

        LocalDate deliveryDate = LocalDate.of(2025, 3, 17);

        Truck truck1 = new Truck();
        truck1.setId(1L);
        truck1.setChassisNumber("CH123");
        truck1.setLicensePlate("ABC-123");

        Truck truck2 = new Truck();
        truck2.setId(2L);
        truck2.setChassisNumber("CH456");
        truck2.setLicensePlate("XYZ-789");

        when(truckRepository.findAvailableTrucks(deliveryDate))
                .thenReturn(Arrays.asList(truck1, truck2));

        List<TruckDto> result = truckService.getAvailableTrucks(deliveryDate);

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals("CH123", result.get(0).getChassisNumber());
        assertEquals("ABC-123", result.get(0).getLicensePlate());

        assertEquals(2L, result.get(1).getId());
        assertEquals("CH456", result.get(1).getChassisNumber());
        assertEquals("XYZ-789", result.get(1).getLicensePlate());

        verify(truckRepository, times(1)).findAvailableTrucks(deliveryDate);
    }
}
