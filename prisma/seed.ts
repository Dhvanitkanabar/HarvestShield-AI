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
  TransportStatus,
  AlertType,
  AlertPriority,
  AlertStatus
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Use bcrypt for real-world authentication matching
function hashPassword(pw: string): string {
  return bcrypt.hashSync(pw, 12);
}

async function main() {
  console.log('🌱 HarvestShield AI — Starting Demo Seed...');

  try {
    // ====================================================
    // 1. USERS — All 7 Roles
    // ====================================================
    console.log('👤 Seeding users for all roles...');

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'Admin User',
        email: 'admin@harvestshield.ai',
        password: hashPassword('admin123'),
        role: Role.ADMIN,
        isVerified: true,
        phone: '+919000000001',
      },
    });

    const farmerUser1 = await prisma.user.upsert({
      where: { email: 'ramesh.farmer@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'Ramesh Patil',
        email: 'ramesh.farmer@harvestshield.ai',
        password: hashPassword('farmer123'),
        role: Role.FARMER,
        isVerified: true,
        phone: '+919111111111',
      },
    });

    const farmerUser2 = await prisma.user.upsert({
      where: { email: 'sunita.farmer@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'Sunita Devi',
        email: 'sunita.farmer@harvestshield.ai',
        password: hashPassword('farmer123'),
        role: Role.FARMER,
        isVerified: true,
        phone: '+919222222222',
      },
    });

    const fpoUser = await prisma.user.upsert({
      where: { email: 'fpo@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'Sunil Joshi',
        email: 'fpo@harvestshield.ai',
        password: hashPassword('fpo123'),
        role: Role.FPO,
        isVerified: true,
        phone: '+919333333333',
      },
    });

    const warehouseUser = await prisma.user.upsert({
      where: { email: 'warehouse@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'Rahul Warehouse',
        email: 'warehouse@harvestshield.ai',
        password: hashPassword('warehouse123'),
        role: Role.WAREHOUSE,
        isVerified: true,
        phone: '+919444444444',
      },
    });

    const processorUser = await prisma.user.upsert({
      where: { email: 'processor@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'Amit Processor',
        email: 'processor@harvestshield.ai',
        password: hashPassword('processor123'),
        role: Role.PROCESSOR,
        isVerified: true,
        phone: '+919555555555',
      },
    });

    const marketUser = await prisma.user.upsert({
      where: { email: 'market@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'Priya Market',
        email: 'market@harvestshield.ai',
        password: hashPassword('market123'),
        role: Role.MARKET,
        isVerified: true,
        phone: '+919666666666',
      },
    });

    const driverUser = await prisma.user.upsert({
      where: { email: 'driver@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'Raju Driver',
        email: 'driver@harvestshield.ai',
        password: hashPassword('driver123'),
        role: Role.DRIVER,
        isVerified: true,
        phone: '+919777777777',
      },
    });

    const inspectorUser = await prisma.user.upsert({
      where: { email: 'inspector@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'Arun Inspector',
        email: 'inspector@harvestshield.ai',
        password: hashPassword('inspector123'),
        role: Role.INSPECTOR,
        isVerified: true,
        phone: '+919888888888',
      },
    });

    const analystUser = await prisma.user.upsert({
      where: { email: 'analyst@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'Neha Analyst',
        email: 'analyst@harvestshield.ai',
        password: hashPassword('analyst123'),
        role: Role.ANALYST,
        isVerified: true,
        phone: '+919999999999',
      },
    });

    const superAdminUser = await prisma.user.upsert({
      where: { email: 'superadmin@harvestshield.ai' },
      update: {},
      create: {
        fullName: 'Super Admin',
        email: 'superadmin@harvestshield.ai',
        password: hashPassword('superadmin123'),
        role: Role.SUPER_ADMIN,
        isVerified: true,
        phone: '+919000000002',
      },
    });

    console.log('✅ Users seeded (11 accounts — all roles)');

    // ====================================================
    // 2. FPO
    // ====================================================
    const fpo = await prisma.fpo.upsert({
      where: { registrationNumber: 'FPO-MAHA-001' },
      update: {},
      create: {
        name: 'Maha Farmers FPO',
        registrationNumber: 'FPO-MAHA-001',
        contactPerson: fpoUser.fullName,
        phone: '+919333333333',
        email: 'fpo@harvestshield.ai',
        address: 'Plot 12, APMC Market Road, Pune',
        district: 'Pune',
        state: 'Maharashtra',
        latitude: 18.5204,
        longitude: 73.8567,
      },
    });
    console.log('✅ FPO seeded');

    // ====================================================
    // 3. FARMERS
    // ====================================================
    let farmer1 = await prisma.farmer.findUnique({ where: { userId: farmerUser1.id } });
    if (!farmer1) {
      farmer1 = await prisma.farmer.create({
        data: {
          userId: farmerUser1.id,
          aadhaarNumber: '123456789011',
          farmName: 'Patil Organic Farm',
          farmSize: 8.5,
          soilType: 'Black Soil',
          irrigationType: 'Drip',
          village: 'Manchar',
          taluka: 'Ambegaon',
          district: 'Pune',
          state: 'Maharashtra',
          latitude: 19.0,
          longitude: 73.97,
          fpoId: fpo.id,
        },
      });
    }

    let farmer2 = await prisma.farmer.findUnique({ where: { userId: farmerUser2.id } });
    if (!farmer2) {
      farmer2 = await prisma.farmer.create({
        data: {
          userId: farmerUser2.id,
          aadhaarNumber: '987654321099',
          farmName: 'Sunita Spice Farm',
          farmSize: 3.2,
          soilType: 'Red Laterite',
          irrigationType: 'Flood',
          village: 'Nashik Road',
          taluka: 'Nashik',
          district: 'Nashik',
          state: 'Maharashtra',
          latitude: 19.99,
          longitude: 73.77,
          fpoId: fpo.id,
        },
      });
    }
    console.log('✅ Farmers seeded');

    // ====================================================
    // 4. CROPS
    // ====================================================
    let wheat = await prisma.crop.findFirst({ where: { cropName: 'Wheat' } });
    if (!wheat) {
      wheat = await prisma.crop.create({
        data: {
          cropName: 'Wheat',
          category: CropCategory.GRAIN,
          scientificName: 'Triticum aestivum',
          averageShelfLife: 180,
          idealTemperatureMin: 10,
          idealTemperatureMax: 20,
          idealHumidityMin: 50,
          idealHumidityMax: 70,
          storageRecommendation: 'Store in cool, dry silos. Maintain humidity below 70%.',
          processingOptions: 'Milling into flour, semolina, bran.',
        },
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
          storageRecommendation: 'Cold storage at 12-15°C for extended shelf life.',
          processingOptions: 'Puree, Ketchup, Canning, Dehydration.',
        },
      });
    }

    let onion = await prisma.crop.findFirst({ where: { cropName: 'Onion' } });
    if (!onion) {
      onion = await prisma.crop.create({
        data: {
          cropName: 'Onion',
          category: CropCategory.VEGETABLE,
          scientificName: 'Allium cepa',
          averageShelfLife: 90,
          idealTemperatureMin: 0,
          idealTemperatureMax: 5,
          idealHumidityMin: 65,
          idealHumidityMax: 75,
          storageRecommendation: 'Store in well-ventilated dry area. Avoid moisture.',
          processingOptions: 'Dehydration, Onion powder, Export.',
        },
      });
    }

    let soybean = await prisma.crop.findFirst({ where: { cropName: 'Soybean' } });
    if (!soybean) {
      soybean = await prisma.crop.create({
        data: {
          cropName: 'Soybean',
          category: CropCategory.OILSEED,
          scientificName: 'Glycine max',
          averageShelfLife: 365,
          idealTemperatureMin: 5,
          idealTemperatureMax: 15,
          idealHumidityMin: 45,
          idealHumidityMax: 60,
          storageRecommendation: 'Hermetic sealed storage. Critical to prevent mold.',
          processingOptions: 'Oil extraction, Meal, Tofu.',
        },
      });
    }
    console.log('✅ Crops seeded (4 crops)');

    // ====================================================
    // 5. WAREHOUSES
    // ====================================================
    let coldStorage1 = await prisma.warehouse.findFirst({ where: { warehouseName: 'Pune Cold Storage Hub' } });
    if (!coldStorage1) {
      coldStorage1 = await prisma.warehouse.create({
        data: {
          warehouseName: 'Pune Cold Storage Hub',
          warehouseType: WarehouseType.COLD_STORAGE,
          ownerName: warehouseUser.fullName,
          capacity: 10000,
          availableCapacity: 7500,
          temperatureSupported: true,
          humiditySupported: true,
          district: 'Pune',
          state: 'Maharashtra',
          latitude: 18.5204,
          longitude: 73.8567,
          contactNumber: '+919444444444',
        },
      });
    }

    let normalStorage = await prisma.warehouse.findFirst({ where: { warehouseName: 'Nashik Grain Silo' } });
    if (!normalStorage) {
      normalStorage = await prisma.warehouse.create({
        data: {
          warehouseName: 'Nashik Grain Silo',
          warehouseType: WarehouseType.NORMAL,
          ownerName: 'Nashik Storage Co.',
          capacity: 50000,
          availableCapacity: 32000,
          temperatureSupported: false,
          humiditySupported: false,
          district: 'Nashik',
          state: 'Maharashtra',
          latitude: 20.01,
          longitude: 73.78,
          contactNumber: '+918833445566',
        },
      });
    }

    let caStorage = await prisma.warehouse.findFirst({ where: { warehouseName: 'Nagpur CA Storage' } });
    if (!caStorage) {
      caStorage = await prisma.warehouse.create({
        data: {
          warehouseName: 'Nagpur CA Storage',
          warehouseType: WarehouseType.CONTROLLED_ATMOSPHERE,
          ownerName: 'Nagpur Agri Infra Ltd',
          capacity: 8000,
          availableCapacity: 5200,
          temperatureSupported: true,
          humiditySupported: true,
          district: 'Nagpur',
          state: 'Maharashtra',
          latitude: 21.15,
          longitude: 79.08,
          contactNumber: '+917722334455',
        },
      });
    }
    console.log('✅ Warehouses seeded (3 facilities)');

    // ====================================================
    // 6. MARKETS
    // ====================================================
    let apmcPune = await prisma.market.findFirst({ where: { marketName: 'Pune APMC Mandi' } });
    if (!apmcPune) {
      apmcPune = await prisma.market.create({
        data: {
          marketName: 'Pune APMC Mandi',
          marketType: MarketType.APMC,
          district: 'Pune',
          state: 'Maharashtra',
          latitude: 18.51,
          longitude: 73.86,
          contactNumber: '+918888888801',
          operatingDays: 'Mon-Sat',
        },
      });
    }

    let nashikMarket = await prisma.market.findFirst({ where: { marketName: 'Nashik APMC' } });
    if (!nashikMarket) {
      nashikMarket = await prisma.market.create({
        data: {
          marketName: 'Nashik APMC',
          marketType: MarketType.APMC,
          district: 'Nashik',
          state: 'Maharashtra',
          latitude: 19.98,
          longitude: 73.79,
          contactNumber: '+918888888802',
          operatingDays: 'Mon-Fri',
        },
      });
    }

    let privateMarket = await prisma.market.findFirst({ where: { marketName: 'Mumbai Private Wholesale' } });
    if (!privateMarket) {
      privateMarket = await prisma.market.create({
        data: {
          marketName: 'Mumbai Private Wholesale',
          marketType: MarketType.PRIVATE,
          district: 'Mumbai',
          state: 'Maharashtra',
          latitude: 19.07,
          longitude: 72.87,
          contactNumber: '+918888888803',
          operatingDays: 'Daily',
        },
      });
    }
    console.log('✅ Markets seeded (3 markets)');

    // ====================================================
    // 7. PROCESSOR
    // ====================================================
    let processor = await prisma.processor.findFirst({ where: { companyName: 'Kisan Agro Processing Ltd' } });
    if (!processor) {
      processor = await prisma.processor.create({
        data: {
          companyName: 'Kisan Agro Processing Ltd',
          acceptedCrops: ['Tomato', 'Onion'],
          processingType: 'Puree, Ketchup & Dehydration',
          capacityPerDay: 500,
          district: 'Nashik',
          state: 'Maharashtra',
          latitude: 20.0,
          longitude: 73.78,
          contactPerson: processorUser.fullName,
          phone: '+919555555555',
        },
      });
    }
    console.log('✅ Processor seeded');

    // ====================================================
    // 8. VEHICLES & DRIVER
    // ====================================================
    let truck1 = await prisma.vehicle.findUnique({ where: { registrationNo: 'MH-12-AB-1234' } });
    if (!truck1) {
      truck1 = await prisma.vehicle.create({
        data: {
          registrationNo: 'MH-12-AB-1234',
          vehicleType: VehicleType.TRUCK,
          capacity: 10,
          currentLocation: 'Pune APMC',
        },
      });
    }

    let reefer = await prisma.vehicle.findUnique({ where: { registrationNo: 'MH-14-CD-5678' } });
    if (!reefer) {
      reefer = await prisma.vehicle.create({
        data: {
          registrationNo: 'MH-14-CD-5678',
          vehicleType: VehicleType.REFRIGERATED_TRUCK,
          capacity: 5,
          currentLocation: 'Nashik',
        },
      });
    }

    let driver = await prisma.driver.findUnique({ where: { licenseNumber: 'MH12-2024-1234567' } });
    if (!driver) {
      driver = await prisma.driver.create({
        data: {
          userId: driverUser.id,
          licenseNumber: 'MH12-2024-1234567',
          vehicleId: truck1.id,
        },
      });
    }
    console.log('✅ Vehicles & Driver seeded');

    // ====================================================
    // 9. HARVEST BATCHES (Multiple, different statuses)
    // ====================================================
    const batch1 = await prisma.harvestBatch.upsert({
      where: { batchNumber: 'HS-2026-WHEAT-001' },
      update: {},
      create: {
        batchNumber: 'HS-2026-WHEAT-001',
        farmerId: farmer1.id,
        cropId: wheat.id,
        fpoId: fpo.id,
        quantity: 5000,
        unit: Unit.KG,
        qualityGrade: QualityGrade.A,
        harvestDate: new Date(Date.now() - 5 * 24 * 3600 * 1000),
        expectedShelfLifeDays: 180,
        currentStatus: BatchStatus.STORED,
        currentLocation: coldStorage1.warehouseName,
        remarks: 'Premium Grade A wheat, harvested mechanically.',
      },
    });

    const batch2 = await prisma.harvestBatch.upsert({
      where: { batchNumber: 'HS-2026-TOMATO-001' },
      update: {},
      create: {
        batchNumber: 'HS-2026-TOMATO-001',
        farmerId: farmer1.id,
        cropId: tomato.id,
        fpoId: fpo.id,
        quantity: 800,
        unit: Unit.KG,
        qualityGrade: QualityGrade.B,
        harvestDate: new Date(Date.now() - 2 * 24 * 3600 * 1000),
        expectedShelfLifeDays: 14,
        currentStatus: BatchStatus.FRESH,
        currentLocation: farmer1.village,
        remarks: 'Ripe tomatoes. Urgent cold storage or sale required.',
      },
    });

    const batch3 = await prisma.harvestBatch.upsert({
      where: { batchNumber: 'HS-2026-ONION-001' },
      update: {},
      create: {
        batchNumber: 'HS-2026-ONION-001',
        farmerId: farmer2.id,
        cropId: onion.id,
        fpoId: fpo.id,
        quantity: 2000,
        unit: Unit.KG,
        qualityGrade: QualityGrade.A,
        harvestDate: new Date(Date.now() - 10 * 24 * 3600 * 1000),
        expectedShelfLifeDays: 90,
        currentStatus: BatchStatus.IN_TRANSIT,
        currentLocation: 'In Transit to Nashik APMC',
        remarks: 'Export quality onions. Nashik variety.',
      },
    });

    const batch4 = await prisma.harvestBatch.upsert({
      where: { batchNumber: 'HS-2026-SOY-001' },
      update: {},
      create: {
        batchNumber: 'HS-2026-SOY-001',
        farmerId: farmer2.id,
        cropId: soybean.id,
        fpoId: fpo.id,
        quantity: 3000,
        unit: Unit.KG,
        qualityGrade: QualityGrade.A,
        harvestDate: new Date(Date.now() - 15 * 24 * 3600 * 1000),
        expectedShelfLifeDays: 365,
        currentStatus: BatchStatus.AT_MARKET,
        currentLocation: 'Mumbai Private Wholesale',
        remarks: 'High-protein soybean for oil extraction.',
      },
    });
    console.log('✅ Harvest batches seeded (4 batches)');

    // ====================================================
    // 10. INVENTORIES
    // ====================================================
    const inv1Exists = await prisma.inventory.findFirst({ where: { batchId: batch1.id } });
    if (!inv1Exists) {
      await prisma.inventory.create({
        data: {
          batchId: batch1.id,
          warehouseId: coldStorage1.id,
          storedQuantity: 5000,
          remainingQuantity: 4800,
          expiryDate: new Date(Date.now() + 175 * 24 * 3600 * 1000),
          temperature: 15,
          humidity: 62,
          storageCondition: 'Optimal cold storage — Grade A',
        },
      });
    }

    const inv2Exists = await prisma.inventory.findFirst({ where: { batchId: batch2.id } });
    if (!inv2Exists) {
      await prisma.inventory.create({
        data: {
          batchId: batch2.id,
          warehouseId: coldStorage1.id,
          storedQuantity: 800,
          remainingQuantity: 800,
          expiryDate: new Date(Date.now() + 12 * 24 * 3600 * 1000),
          temperature: 13,
          humidity: 88,
          storageCondition: 'Cold storage — requires monitoring',
        },
      });
    }
    console.log('✅ Inventories seeded');

    // ====================================================
    // 11. MOVEMENTS
    // ====================================================
    const mvt1 = await prisma.movement.findFirst({ where: { batchId: batch1.id, movementType: MovementType.STORAGE } });
    if (!mvt1) {
      await prisma.movement.create({
        data: {
          batchId: batch1.id,
          movementType: MovementType.STORAGE,
          fromLocation: farmer1.village,
          toLocation: coldStorage1.warehouseName,
          transportCost: 2500,
          remarks: 'Transported by MH-12-AB-1234',
        },
      });
    }
    console.log('✅ Movements seeded');

    // ====================================================
    // 12. AI RECOMMENDATIONS (with full explainability)
    // ====================================================
    const rec1 = await prisma.recommendation.findFirst({ where: { batchId: batch1.id } });
    if (!rec1) {
      await prisma.recommendation.create({
        data: {
          batchId: batch1.id,
          recommendedAction: RecommendationAction.STORE,
          reason: 'Wheat batch is high quality (Grade A) with 175 days remaining shelf life. Market prices are predicted to rise 8% over next 30 days. Storing maximizes profit.',
          confidenceScore: 92.5,
          priority: PriorityLevel.HIGH,
          expectedProfit: 125000,
          spoilageRiskScore: 12,
          decisionHistories: {
            create: [
              {
                actionEvaluated: RecommendationAction.STORE,
                score: 92.5,
                reasoning: 'High shelf life + Grade A quality + rising market trend = Store for 30 days.',
              },
              {
                actionEvaluated: RecommendationAction.SELL_NOW,
                score: 65,
                reasoning: 'Immediate sale possible but misses 8% price rise projected.',
              },
              {
                actionEvaluated: RecommendationAction.SEND_TO_PROCESSOR,
                score: 45,
                reasoning: 'Processing reduces direct profit margin for premium Grade A.',
              },
            ],
          },
        },
      });
    }

    const rec2 = await prisma.recommendation.findFirst({ where: { batchId: batch2.id } });
    if (!rec2) {
      await prisma.recommendation.create({
        data: {
          batchId: batch2.id,
          recommendedAction: RecommendationAction.MOVE_TO_COLD_STORAGE,
          reason: 'Tomato batch is perishable (Grade B) with only 12 days shelf life. Current temperature is rising. Immediate cold storage transfer is critical.',
          confidenceScore: 97.1,
          priority: PriorityLevel.CRITICAL,
          expectedProfit: 16000,
          spoilageRiskScore: 78,
          decisionHistories: {
            create: [
              {
                actionEvaluated: RecommendationAction.MOVE_TO_COLD_STORAGE,
                score: 97.1,
                reasoning: 'Perishable crop with high spoilage risk. Cold storage extends life.',
              },
              {
                actionEvaluated: RecommendationAction.SELL_NOW,
                score: 72,
                reasoning: 'Immediate sale at lower price vs optimal storage+sell strategy.',
              },
            ],
          },
        },
      });
    }

    const rec3 = await prisma.recommendation.findFirst({ where: { batchId: batch3.id } });
    if (!rec3) {
      await prisma.recommendation.create({
        data: {
          batchId: batch3.id,
          recommendedAction: RecommendationAction.MOVE_TO_MARKET,
          reason: 'Onion demand at Nashik APMC is HIGH with a volatility score of 0.12. Current prices are at 3-month peak. Sell within 48 hours for maximum return.',
          confidenceScore: 88.4,
          priority: PriorityLevel.HIGH,
          expectedProfit: 52000,
          spoilageRiskScore: 22,
          decisionHistories: {
            create: [
              {
                actionEvaluated: RecommendationAction.MOVE_TO_MARKET,
                score: 88.4,
                reasoning: 'Market demand peak + low spoilage risk = sell now strategy.',
              },
              {
                actionEvaluated: RecommendationAction.STORE,
                score: 61,
                reasoning: 'Market could cool. Risk of missing peak window.',
              },
            ],
          },
        },
      });
    }
    console.log('✅ AI Recommendations seeded (with explainability)');

    // ====================================================
    // 13. RISK ASSESSMENTS
    // ====================================================
    for (const { batchId, score, cat, factors } of [
      { batchId: batch1.id, score: 12, cat: RiskCategory.LOW, factors: { remainingShelfLife: 175, temp: 15, humidity: 62, storageQuality: 'Optimal' } },
      { batchId: batch2.id, score: 78, cat: RiskCategory.HIGH, factors: { remainingShelfLife: 12, temp: 22, humidity: 80, storageQuality: 'Needs improvement' } },
      { batchId: batch3.id, score: 32, cat: RiskCategory.MEDIUM, factors: { remainingShelfLife: 80, temp: 18, humidity: 70, storageQuality: 'Adequate' } },
    ]) {
      const exists = await prisma.riskAssessment.findFirst({ where: { batchId } });
      if (!exists) {
        await prisma.riskAssessment.create({ data: { batchId, riskScore: score, riskCategory: cat, factors } });
      }
    }
    console.log('✅ Risk Assessments seeded');

    // ====================================================
    // 14. MARKET PRICE HISTORY (7 days)
    // ====================================================
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const factor = 1 + (Math.random() * 0.1 - 0.05);
      
      await prisma.marketPriceHistory.upsert({
        where: { marketId_cropId_date: { marketId: apmcPune.id, cropId: wheat.id, date } },
        update: {},
        create: {
          marketId: apmcPune.id,
          cropId: wheat.id,
          date,
          minPrice: Math.round(2000 * factor),
          maxPrice: Math.round(2500 * factor),
          modalPrice: Math.round(2200 * factor),
          arrivalQuantity: Math.round(50 + Math.random() * 30),
        },
      });

      await prisma.marketPriceHistory.upsert({
        where: { marketId_cropId_date: { marketId: nashikMarket.id, cropId: onion.id, date } },
        update: {},
        create: {
          marketId: nashikMarket.id,
          cropId: onion.id,
          date,
          minPrice: Math.round(1200 * factor),
          maxPrice: Math.round(1800 * factor),
          modalPrice: Math.round(1500 * factor),
          arrivalQuantity: Math.round(100 + Math.random() * 50),
        },
      });
    }

    // Price Predictions (7 days ahead)
    for (let i = 1; i <= 7; i++) {
      const predictedDate = new Date();
      predictedDate.setDate(predictedDate.getDate() + i);
      predictedDate.setHours(0, 0, 0, 0);

      const trend = 1 + (i * 0.01);
      await prisma.pricePrediction.upsert({
        where: { marketId_cropId_predictedDate: { marketId: apmcPune.id, cropId: wheat.id, predictedDate } },
        update: {},
        create: {
          marketId: apmcPune.id,
          cropId: wheat.id,
          predictedDate,
          predictedMinPrice: Math.round(2100 * trend),
          predictedMaxPrice: Math.round(2600 * trend),
          predictedModalPrice: Math.round(2350 * trend),
          confidenceScore: 85 - (i * 2),
        },
      });
    }

    // Market Demand
    const today = new Date(); today.setHours(0, 0, 0, 0);
    await prisma.marketDemand.upsert({
      where: { marketId_cropId_date: { marketId: apmcPune.id, cropId: wheat.id, date: today } },
      update: {},
      create: { marketId: apmcPune.id, cropId: wheat.id, date: today, demandIndex: DemandLevel.HIGH, volatilityScore: 0.15 },
    });
    await prisma.marketDemand.upsert({
      where: { marketId_cropId_date: { marketId: nashikMarket.id, cropId: onion.id, date: today } },
      update: {},
      create: { marketId: nashikMarket.id, cropId: onion.id, date: today, demandIndex: DemandLevel.CRITICAL, volatilityScore: 0.08 },
    });
    console.log('✅ Market intelligence seeded (7-day history + predictions)');

    // ====================================================
    // 15. TRANSPORT REQUESTS
    // ====================================================
    const tr1 = await prisma.transportRequest.findFirst({ where: { batchId: batch1.id } });
    if (!tr1) {
      const tr = await prisma.transportRequest.create({
        data: {
          batchId: batch1.id,
          vehicleId: truck1.id,
          driverId: driver.id,
          pickupLocation: farmer1.village,
          dropoffLocation: coldStorage1.warehouseName,
          status: TransportStatus.DELIVERED,
          scheduledDate: new Date(Date.now() - 5 * 24 * 3600 * 1000),
          estimatedCost: 3500,
          distanceKm: 48.5,
          estimatedTimeMins: 95,
          actualPickupTime: new Date(Date.now() - 5 * 24 * 3600 * 1000 + 30 * 60 * 1000),
          actualDeliveryTime: new Date(Date.now() - 5 * 24 * 3600 * 1000 + 130 * 60 * 1000),
          fuelConsumed: 14.2,
        },
      });
      // Cold chain log
      await prisma.coldChainLog.create({
        data: {
          transportRequestId: tr.id,
          temperature: 16.5,
          humidity: 63,
          latitude: 18.82,
          longitude: 73.91,
        },
      });
    }

    const tr2 = await prisma.transportRequest.findFirst({ where: { batchId: batch3.id } });
    if (!tr2) {
      await prisma.transportRequest.create({
        data: {
          batchId: batch3.id,
          vehicleId: reefer.id,
          driverId: driver.id,
          pickupLocation: farmer2.village,
          dropoffLocation: nashikMarket.marketName,
          status: TransportStatus.IN_TRANSIT,
          scheduledDate: new Date(),
          estimatedCost: 2200,
          distanceKm: 28.0,
          estimatedTimeMins: 55,
          fuelConsumed: 9.5,
        },
      });
    }
    console.log('✅ Transport requests seeded');

    // ====================================================
    // 16. ALERTS
    // ====================================================
    const alertExists = await prisma.alert.findFirst({ where: { type: AlertType.HIGH_SPOILAGE_RISK } });
    if (!alertExists) {
      await prisma.alert.create({
        data: {
          title: '🚨 High Spoilage Risk — Tomato Batch HS-2026-TOMATO-001',
          description: 'Tomato batch has 12 days shelf life remaining and is currently at ambient temperature. Immediate cold storage transfer required to prevent 78% spoilage loss.',
          type: AlertType.HIGH_SPOILAGE_RISK,
          priority: AlertPriority.CRITICAL,
          status: AlertStatus.NEW,
          batchId: batch2.id,
          warehouseId: coldStorage1.id,
        },
      });

      await prisma.alert.create({
        data: {
          title: '📈 High Market Demand — Onion at Nashik APMC',
          description: 'Onion demand index is CRITICAL with prices at 3-month peak. Recommended window: next 48 hours.',
          type: AlertType.HIGH_MARKET_DEMAND,
          priority: AlertPriority.HIGH,
          status: AlertStatus.NEW,
        },
      });

      await prisma.alert.create({
        data: {
          title: '🤖 AI Recommendation Generated — Wheat Batch',
          description: 'Store for 30 days. Predicted 8% price rise. Confidence: 92.5%',
          type: AlertType.AI_RECOMMENDATION_GENERATED,
          priority: AlertPriority.MEDIUM,
          status: AlertStatus.ACKNOWLEDGED,
          batchId: batch1.id,
        },
      });
    }
    console.log('✅ Alerts seeded (3 demo alerts)');

    // ====================================================
    // 17. DASHBOARD SNAPSHOT
    // ====================================================
    await prisma.dashboardSnapshot.create({
      data: {
        metrics: {
          totalFarmers: 2,
          totalWarehouses: 3,
          totalBatches: 4,
          totalRevenue: 193000,
          spoilageRisk: 'HIGH',
          alertsCount: 3,
          batchesInTransit: 1,
          avgRecommendationConfidence: 92.7,
          estimatedFoodSaved: 12.4,
          co2Reduced: 8.9,
        },
      },
    });
    console.log('✅ Dashboard snapshot seeded');

    // ====================================================
    // 18. ANALYTICS SNAPSHOT
    // ====================================================
    await prisma.analyticsSnapshot.create({
      data: {
        periodStart: new Date(Date.now() - 30 * 24 * 3600 * 1000),
        periodEnd: new Date(),
        periodType: 'MONTHLY',
        metrics: {
          totalHarvest: 10800,
          totalRevenue: 193000,
          spoilagePreventedKg: 2400,
          spoilagePreventedValue: 57600,
          avgTransportCostKm: 72.5,
          recommendationsGenerated: 3,
          recommendationsAccepted: 3,
          co2SavedKg: 892,
        },
      },
    });
    console.log('✅ Analytics snapshot seeded');

    console.log('\n🎉 HarvestShield AI Demo Seed Complete!');
    console.log('\n📋 Demo Credentials:');
    console.log('  Admin:     admin@harvestshield.ai     / admin123');
    console.log('  Farmer:    ramesh.farmer@harvestshield.ai / farmer123');
    console.log('  Farmer 2:  sunita.farmer@harvestshield.ai / farmer123');
    console.log('  FPO:       fpo@harvestshield.ai       / fpo123');
    console.log('  Warehouse: warehouse@harvestshield.ai  / warehouse123');
    console.log('  Processor: processor@harvestshield.ai  / processor123');
    console.log('  Market:    market@harvestshield.ai     / market123');
    console.log('  Driver:    driver@harvestshield.ai     / driver123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
