import { 
  PrismaClient, 
  CropCategory, 
  WarehouseType, 
  MarketType, 
  DemandLevel,
  Role,
  Unit,
  QualityGrade,
  BatchStatus,
  MovementType,
  RecommendationAction,
  PriorityLevel,
  RiskCategory,
  VehicleType,
  TransportStatus
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  try {
    // 1. Seed Users
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'System Admin',
        email: 'admin@harvestshield.ai',
        password: 'hashedpassword',
        role: Role.ADMIN,
        isVerified: true,
      },
    });
    console.log(`Verified Admin User: ${adminUser.email}`);

    const mockUser = await prisma.user.upsert({
      where: { email: 'ramesh@example.com' },
      update: {},
      create: {
        fullName: 'Ramesh Farmer',
        email: 'ramesh@example.com',
        password: 'hashedpassword',
        role: Role.FARMER,
        isVerified: true,
      }
    });

    // 2. Seed FPO
    const fpo = await prisma.fpo.upsert({
      where: { registrationNumber: 'FPO-MAHA-001' },
      update: {},
      create: {
        name: 'Maha Farmers FPO',
        registrationNumber: 'FPO-MAHA-001',
        contactPerson: 'Sunil Joshi',
        phone: '+919988776655',
        email: 'fpo@example.com',
        address: 'APMC Market Road',
        district: 'Pune',
        state: 'Maharashtra',
        latitude: 18.5204,
        longitude: 73.8567,
      }
    });

    // 3. Seed Farmers
    let mockFarmer = await prisma.farmer.findUnique({
      where: { userId: mockUser.id }
    });
    if (!mockFarmer) {
      mockFarmer = await prisma.farmer.create({
        data: {
          userId: mockUser.id,
          aadhaarNumber: '123456789012',
          farmName: 'Ramesh Farms',
          farmSize: 5.5,
          soilType: 'Black Soil',
          irrigationType: 'Drip',
          village: 'Manchar',
          taluka: 'Ambegaon',
          district: 'Pune',
          state: 'Maharashtra',
          fpoId: fpo.id,
        }
      });
    }

    // 4. Seed Crops (Crop has no unique field, use findFirst)
    let wheat = await prisma.crop.findFirst({ where: { cropName: 'Wheat' } });
    if (!wheat) {
      wheat = await prisma.crop.create({
        data: {
          cropName: 'Wheat',
          category: CropCategory.GRAIN,
          scientificName: 'Triticum',
          averageShelfLife: 180,
          idealTemperatureMin: 10,
          idealTemperatureMax: 20,
          idealHumidityMin: 50,
          idealHumidityMax: 70,
          storageRecommendation: 'Store in a cool, dry place. Ensure silos are well-ventilated.',
          processingOptions: 'Milling into flour, semolina.',
        }
      });
    }

    let tomato = await prisma.crop.findFirst({ where: { cropName: 'Tomato' } });
    if (!tomato) {
      tomato = await prisma.crop.create({
        data: {
          cropName: 'Tomato',
          category: CropCategory.VEGETABLE,
          scientificName: 'Solanum lycopersicum',
          averageShelfLife: 14,
          idealTemperatureMin: 12,
          idealTemperatureMax: 15,
          idealHumidityMin: 85,
          idealHumidityMax: 95,
          storageRecommendation: 'Cold storage recommended for longer shelf life.',
          processingOptions: 'Puree, Ketchup, Canned.',
        }
      });
    }

    // 5. Seed Warehouses
    let coldStorage = await prisma.warehouse.findFirst({ where: { warehouseName: 'Maha Cold Storage' } });
    if (!coldStorage) {
      coldStorage = await prisma.warehouse.create({
        data: {
          warehouseName: 'Maha Cold Storage',
          warehouseType: WarehouseType.COLD_STORAGE,
          ownerName: 'Rahul Patil',
          capacity: 5000,
          availableCapacity: 3500,
          temperatureSupported: true,
          humiditySupported: true,
          district: 'Pune',
          state: 'Maharashtra',
          latitude: 18.5204,
          longitude: 73.8567,
          contactNumber: '+919876543210',
        }
      });
    }

    // 6. Seed Markets
    let apmcMarket = await prisma.market.findFirst({ where: { marketName: 'Pune APMC' } });
    if (!apmcMarket) {
      apmcMarket = await prisma.market.create({
        data: {
          marketName: 'Pune APMC',
          marketType: MarketType.APMC,
          district: 'Pune',
          state: 'Maharashtra',
          latitude: 18.51,
          longitude: 73.86,
          contactNumber: '+918888888888',
          operatingDays: 'Mon-Sat',
        }
      });
    }

    // 7. Seed Processors
    let ketchupFactory = await prisma.processor.findFirst({ where: { companyName: 'Kisan Processing Ltd' } });
    if (!ketchupFactory) {
      ketchupFactory = await prisma.processor.create({
        data: {
          companyName: 'Kisan Processing Ltd',
          acceptedCrops: ['Tomato'],
          processingType: 'Puree & Ketchup',
          capacityPerDay: 500,
          district: 'Nashik',
          state: 'Maharashtra',
          latitude: 20.0,
          longitude: 73.78,
          contactPerson: 'Amit Kumar',
          phone: '+919999999999',
        }
      });
    }

    // 8. Seed Harvest Batch
    const harvest = await prisma.harvestBatch.upsert({
      where: { batchNumber: 'HS-2026-A1B2C3' },
      update: {},
      create: {
        batchNumber: 'HS-2026-A1B2C3',
        farmerId: mockFarmer.id,
        cropId: wheat.id,
        fpoId: fpo.id,
        quantity: 1000,
        unit: Unit.KG,
        qualityGrade: QualityGrade.A,
        harvestDate: new Date(),
        expectedShelfLifeDays: wheat.averageShelfLife ?? 180,
        currentStatus: BatchStatus.STORED,
        currentLocation: coldStorage.warehouseName
      }
    });
    console.log(`Created harvest batch: ${harvest.batchNumber}`);

    // 9. Seed Movement
    let movementHarvest = await prisma.movement.findFirst({
      where: { batchId: harvest.id, movementType: MovementType.HARVEST }
    });
    if (!movementHarvest) {
      await prisma.movement.create({
        data: {
          batchId: harvest.id,
          movementType: MovementType.HARVEST,
          fromLocation: 'FIELD',
          toLocation: mockFarmer.village,
          remarks: 'Initial Harvest',
        }
      });
    }

    let movementStorage = await prisma.movement.findFirst({
      where: { batchId: harvest.id, movementType: MovementType.STORAGE }
    });
    if (!movementStorage) {
      await prisma.movement.create({
        data: {
          batchId: harvest.id,
          movementType: MovementType.STORAGE,
          fromLocation: mockFarmer.village,
          toLocation: coldStorage.warehouseName,
          remarks: 'Moved to cold storage',
        }
      });
    }

    // 10. Seed Inventory
    let inventory = await prisma.inventory.findFirst({
      where: { batchId: harvest.id, warehouseId: coldStorage.id }
    });
    if (!inventory) {
      await prisma.inventory.create({
        data: {
          batchId: harvest.id,
          warehouseId: coldStorage.id,
          storedQuantity: 1000,
          remainingQuantity: 1000,
          storageDate: new Date(),
          expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // ~180 days
          temperature: 15,
          humidity: 60,
          storageCondition: 'Normal cold storage',
        }
      });
    }

    // 11. Seed AI Recommendation (Phase 4)
    let recommendation = await prisma.recommendation.findFirst({
      where: { batchId: harvest.id }
    });
    if (!recommendation) {
      recommendation = await prisma.recommendation.create({
        data: {
          batchId: harvest.id,
          recommendedAction: RecommendationAction.STORE,
          reason: 'Batch is fresh and high quality. Storing will allow selling during peak market prices later.',
          confidenceScore: 92,
          priority: PriorityLevel.HIGH,
          expectedProfit: 45000,
          spoilageRiskScore: 25,
          decisionHistories: {
            create: [
              { actionEvaluated: RecommendationAction.STORE, score: 90, reasoning: 'Batch is fresh and high quality.' },
              { actionEvaluated: RecommendationAction.SELL_NOW, score: 60, reasoning: 'Batch is fresh.' }
            ]
          }
        }
      });
    }

    let risk = await prisma.riskAssessment.findFirst({
      where: { batchId: harvest.id }
    });
    if (!risk) {
      await prisma.riskAssessment.create({
        data: {
          batchId: harvest.id,
          riskScore: 25,
          riskCategory: RiskCategory.LOW,
          factors: { remainingShelfLife: 180, storageQuality: 'Normal cold storage' }
        }
      });
    }

    let prediction = await prisma.predictionSnapshot.findFirst({
      where: { batchId: harvest.id }
    });
    if (!prediction) {
      await prisma.predictionSnapshot.create({
        data: {
          batchId: harvest.id,
          shelfLifeRemaining: 180,
          storageQuality: 'Normal cold storage',
          environmentalConditions: { temp: 15, humidity: 60 }
        }
      });
    }

    // 12. Seed Market Intelligence (Phase 5)
    await prisma.marketPriceHistory.upsert({
      where: {
        marketId_cropId_date: {
          marketId: apmcMarket.id,
          cropId: wheat.id,
          date: new Date(new Date().setHours(0, 0, 0, 0)) // Normalized date
        }
      },
      update: {},
      create: {
        marketId: apmcMarket.id,
        cropId: wheat.id,
        date: new Date(new Date().setHours(0, 0, 0, 0)),
        minPrice: 2000,
        maxPrice: 2500,
        modalPrice: 2200,
        arrivalQuantity: 50,
      }
    });

    const predictedDate = new Date(new Date().setHours(0, 0, 0, 0));
    predictedDate.setDate(predictedDate.getDate() + 7); // 7 days from now
    
    await prisma.pricePrediction.upsert({
      where: {
        marketId_cropId_predictedDate: {
          marketId: apmcMarket.id,
          cropId: wheat.id,
          predictedDate: predictedDate
        }
      },
      update: {},
      create: {
        marketId: apmcMarket.id,
        cropId: wheat.id,
        predictedDate: predictedDate,
        predictedMinPrice: 2100,
        predictedMaxPrice: 2600,
        predictedModalPrice: 2350,
        confidenceScore: 85.5,
      }
    });

    await prisma.marketDemand.upsert({
      where: {
        marketId_cropId_date: {
          marketId: apmcMarket.id,
          cropId: wheat.id,
          date: new Date(new Date().setHours(0, 0, 0, 0))
        }
      },
      update: {},
      create: {
        marketId: apmcMarket.id,
        cropId: wheat.id,
        date: new Date(new Date().setHours(0, 0, 0, 0)),
        demandIndex: DemandLevel.HIGH,
        volatilityScore: 0.15,
      }
    });

    // ==================================================
    // 13. Seed Logistics & Distribution (Phase 6)
    // ==================================================

    // Seed Driver User
    const mockDriverUser = await prisma.user.upsert({
      where: { email: 'driver@example.com' },
      update: {},
      create: {
        fullName: 'Raju Driver',
        email: 'driver@example.com',
        password: 'hashedpassword',
        role: Role.DRIVER,
        isVerified: true,
      }
    });

    // Seed Vehicle
    let truck = await prisma.vehicle.findUnique({ where: { registrationNo: 'MH-12-AB-1234' }});
    if (!truck) {
      truck = await prisma.vehicle.create({
        data: {
          registrationNo: 'MH-12-AB-1234',
          vehicleType: VehicleType.TRUCK,
          capacity: 10,
          currentLocation: 'Pune APMC',
        }
      });
    }

    let reeferTruck = await prisma.vehicle.findUnique({ where: { registrationNo: 'MH-14-CD-5678' }});
    if (!reeferTruck) {
      reeferTruck = await prisma.vehicle.create({
        data: {
          registrationNo: 'MH-14-CD-5678',
          vehicleType: VehicleType.REFRIGERATED_TRUCK,
          capacity: 5,
          currentLocation: 'Nashik',
        }
      });
    }

    // Seed Driver Profile
    let driverProfile = await prisma.driver.findUnique({ where: { licenseNumber: 'MH12-2024-1234567' }});
    if (!driverProfile) {
      driverProfile = await prisma.driver.create({
        data: {
          userId: mockDriverUser.id,
          licenseNumber: 'MH12-2024-1234567',
          vehicleId: truck.id,
        }
      });
    }

    // Seed Transport Request
    let transportRequest = await prisma.transportRequest.findFirst({ where: { batchId: harvest.id }});
    if (!transportRequest) {
      transportRequest = await prisma.transportRequest.create({
        data: {
          batchId: harvest.id,
          vehicleId: truck.id,
          driverId: driverProfile.id,
          pickupLocation: mockFarmer.village,
          dropoffLocation: coldStorage.warehouseName,
          status: TransportStatus.DELIVERED,
          scheduledDate: new Date(),
          estimatedCost: 2500,
          distanceKm: 45.5,
          estimatedTimeMins: 90,
          actualPickupTime: new Date(Date.now() - 3 * 3600 * 1000), // 3 hours ago
          actualDeliveryTime: new Date(Date.now() - 1 * 3600 * 1000), // 1 hour ago
          fuelConsumed: 12.5,
        }
      });

      // Seed Cold Chain Log (Mock IoT data)
      await prisma.coldChainLog.create({
        data: {
          transportRequestId: transportRequest.id,
          temperature: 18.5,
          humidity: 65,
          latitude: 18.5204,
          longitude: 73.8567,
        }
      });
    }

    console.log('Seeding finished successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
