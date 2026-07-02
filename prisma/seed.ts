import { PrismaClient, CropCategory, WarehouseType, MarketType, DemandLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Seed Crops
  const wheat = await prisma.crop.create({
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
    },
  });
  console.log(`Created crop: ${wheat.cropName}`);

  const tomato = await prisma.crop.create({
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
    },
  });
  console.log(`Created crop: ${tomato.cropName}`);

  // 2. Seed Warehouses
  const coldStorage = await prisma.warehouse.create({
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
    },
  });
  console.log(`Created warehouse: ${coldStorage.warehouseName}`);

  // 3. Seed Markets
  const apmcMarket = await prisma.market.create({
    data: {
      marketName: 'Pune APMC',
      marketType: MarketType.APMC,
      district: 'Pune',
      state: 'Maharashtra',
      latitude: 18.51,
      longitude: 73.86,
      contactNumber: '+918888888888',
      operatingDays: 'Mon-Sat',
    },
  });
  console.log(`Created market: ${apmcMarket.marketName}`);

  // 4. Seed Processors
  const ketchupFactory = await prisma.processor.create({
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
    },
  });
  console.log(`Created processor: ${ketchupFactory.companyName}`);

  // ==================================================
  // PHASE 3 SEEDING
  // ==================================================

  // Need a mock user and farmer
  const mockUser = await prisma.user.create({
    data: {
      fullName: 'Ramesh Farmer',
      email: 'ramesh@example.com',
      password: 'hashedpassword',
      role: 'FARMER',
    }
  });

  const mockFarmer = await prisma.farmer.create({
    data: {
      userId: mockUser.id,
      farmSize: 5.5,
      village: 'Manchar',
      taluka: 'Ambegaon',
      district: 'Pune',
      state: 'Maharashtra',
    }
  });

  // 5. Seed Harvest Batch
  const harvest = await prisma.harvestBatch.create({
    data: {
      batchNumber: 'HS-2026-A1B2C3',
      farmerId: mockFarmer.id,
      cropId: wheat.id,
      quantity: 1000,
      unit: 'KG',
      qualityGrade: 'A',
      harvestDate: new Date(),
      expectedShelfLifeDays: wheat.averageShelfLife || 180,
      currentStatus: 'STORED',
      currentLocation: coldStorage.warehouseName
    }
  });
  console.log(`Created harvest batch: ${harvest.batchNumber}`);

  // 6. Seed Movement
  await prisma.movement.create({
    data: {
      batchId: harvest.id,
      movementType: 'HARVEST',
      fromLocation: 'FIELD',
      toLocation: mockFarmer.village,
      remarks: 'Initial Harvest',
    }
  });

  await prisma.movement.create({
    data: {
      batchId: harvest.id,
      movementType: 'STORAGE',
      fromLocation: mockFarmer.village,
      toLocation: coldStorage.warehouseName,
      remarks: 'Moved to cold storage',
    }
  });

  // 7. Seed Inventory
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
  // ==================================================
  // PHASE 4 SEEDING
  // ==================================================
  
  await prisma.recommendation.create({
      data: {
          batchId: harvest.id,
          recommendedAction: 'STORE',
          reason: 'Batch is fresh and high quality. Storing will allow selling during peak market prices later.',
          confidenceScore: 92,
          priority: 'HIGH',
          expectedProfit: 45000,
          spoilageRiskScore: 25,
          decisionHistories: {
              create: [
                  { actionEvaluated: 'STORE', score: 90, reasoning: 'Batch is fresh and high quality.' },
                  { actionEvaluated: 'SELL_NOW', score: 60, reasoning: 'Batch is fresh.' }
              ]
          }
      }
  });

  await prisma.riskAssessment.create({
      data: {
          batchId: harvest.id,
          riskScore: 25,
          riskCategory: 'LOW',
          factors: { remainingShelfLife: 180, storageQuality: 'Normal cold storage' }
      }
  });

  await prisma.predictionSnapshot.create({
      data: {
          batchId: harvest.id,
          shelfLifeRemaining: 180,
          storageQuality: 'Normal cold storage',
          environmentalConditions: { temp: 15, humidity: 60 }
      }
  });
  // ==================================================
  // PHASE 5 SEEDING
  // ==================================================
  
  await prisma.marketPriceHistory.create({
    data: {
      marketId: apmcMarket.id,
      cropId: wheat.id,
      date: new Date(),
      minPrice: 2000,
      maxPrice: 2500,
      modalPrice: 2200,
      arrivalQuantity: 50,
    }
  });

  await prisma.pricePrediction.create({
    data: {
      marketId: apmcMarket.id,
      cropId: wheat.id,
      predictedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      predictedMinPrice: 2100,
      predictedMaxPrice: 2600,
      predictedModalPrice: 2350,
      confidenceScore: 85.5,
    }
  });

  await prisma.marketDemand.create({
    data: {
      marketId: apmcMarket.id,
      cropId: wheat.id,
      date: new Date(),
      demandIndex: DemandLevel.HIGH,
      volatilityScore: 0.15,
    }
  });
  console.log('Created market intelligence mock data');

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
