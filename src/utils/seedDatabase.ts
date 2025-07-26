import DatabaseService from '../database/DatabaseService';
import { User, Member, Route, ProductionUnit, MilkTank, Mission } from '../models';

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('Starting database seeding...');

    // Sample Users (Collection Agents)
    const users: User[] = [
      { name: 'Jean Dupont', is_active: true },
      { name: 'Marie Martin', is_active: true },
      { name: 'Pierre Durand', is_active: true },
      { name: 'Sophie Lefebvre', is_active: false },
    ];

    for (const user of users) {
      await DatabaseService.executeQuery(
        'INSERT INTO users (name, is_active) VALUES (?, ?)',
        [user.name, user.is_active]
      );
    }

    // Sample Members (Adherents)
    const members: Member[] = [
      { name: 'Ferme Dubois', is_active: true },
      { name: 'Ferme Moreau', is_active: true },
      { name: 'Ferme Leroy', is_active: true },
      { name: 'Ferme Simon', is_active: true },
      { name: 'Ferme Laurent', is_active: false },
    ];

    for (const member of members) {
      await DatabaseService.executeQuery(
        'INSERT INTO members (name, is_active) VALUES (?, ?)',
        [member.name, member.is_active]
      );
    }

    // Sample Routes (Tournées)
    const routes: Route[] = [
      { name: 'Route Nord', is_active: true },
      { name: 'Route Sud', is_active: true },
      { name: 'Route Est', is_active: true },
      { name: 'Route Ouest', is_active: false },
    ];

    for (const route of routes) {
      await DatabaseService.executeQuery(
        'INSERT INTO routes (name, is_active) VALUES (?, ?)',
        [route.name, route.is_active]
      );
    }

    // Sample Production Units
    const productionUnits: ProductionUnit[] = [
      { name: 'Unité A - Ferme Dubois', member_id: 1, is_active: true },
      { name: 'Unité B - Ferme Dubois', member_id: 1, is_active: true },
      { name: 'Unité A - Ferme Moreau', member_id: 2, is_active: true },
      { name: 'Unité A - Ferme Leroy', member_id: 3, is_active: true },
      { name: 'Unité A - Ferme Simon', member_id: 4, is_active: true },
    ];

    for (const unit of productionUnits) {
      await DatabaseService.executeQuery(
        'INSERT INTO production_units (name, member_id, is_active) VALUES (?, ?, ?)',
        [unit.name, unit.member_id, unit.is_active]
      );
    }

    // Sample Milk Tanks
    const milkTanks: MilkTank[] = [
      { reference: 'BAC-001', capacity: 500, production_unit_id: 1, is_active: true },
      { reference: 'BAC-002', capacity: 750, production_unit_id: 1, is_active: true },
      { reference: 'BAC-003', capacity: 600, production_unit_id: 2, is_active: true },
      { reference: 'BAC-004', capacity: 400, production_unit_id: 3, is_active: true },
      { reference: 'BAC-005', capacity: 800, production_unit_id: 4, is_active: true },
      { reference: 'BAC-006', capacity: 550, production_unit_id: 5, is_active: true },
    ];

    for (const tank of milkTanks) {
      await DatabaseService.executeQuery(
        'INSERT INTO milk_tanks (reference, capacity, production_unit_id, is_active) VALUES (?, ?, ?, ?)',
        [tank.reference, tank.capacity, tank.production_unit_id, tank.is_active]
      );
    }

    // Sample Missions
    const missions: Mission[] = [
      {
        reference: 'MISS-001',
        matricule: 'VEH-123',
        agent_id: 1,
        conductor_id: 2,
        route_id: 1,
        is_active: true,
      },
      {
        reference: 'MISS-002',
        matricule: 'VEH-456',
        agent_id: 2,
        conductor_id: 3,
        route_id: 2,
        is_active: true,
      },
      {
        reference: 'MISS-003',
        matricule: 'VEH-789',
        agent_id: 1,
        conductor_id: 2,
        route_id: 1,
        is_active: false,
      },
    ];

    for (const mission of missions) {
      await DatabaseService.executeQuery(
        'INSERT INTO missions (reference, matricule, agent_id, conductor_id, route_id, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [mission.reference, mission.matricule, mission.agent_id, mission.conductor_id, mission.route_id, mission.is_active]
      );
    }

    // Sample Collections
    const collections = [
      {
        route_id: 1,
        mission_id: 1,
        production_unit_id: 1,
        member_id: 1,
        agent_id: 1,
        is_active: true,
        activation_datetime: new Date().toISOString(),
      },
      {
        route_id: 1,
        mission_id: 1,
        production_unit_id: 2,
        member_id: 1,
        agent_id: 1,
        is_active: false,
        activation_datetime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        deactivation_datetime: new Date(Date.now() - 82800000).toISOString(), // Yesterday + 1 hour
      },
    ];

    for (const collection of collections) {
      await DatabaseService.executeQuery(
        'INSERT INTO collections (route_id, mission_id, production_unit_id, member_id, agent_id, is_active, activation_datetime, deactivation_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [
          collection.route_id,
          collection.mission_id,
          collection.production_unit_id,
          collection.member_id,
          collection.agent_id,
          collection.is_active,
          collection.activation_datetime,
          collection.deactivation_datetime || null,
        ]
      );
    }

    // Sample Collection Details
    const collectionDetails = [
      {
        collection_id: 2,
        milk_tank_id: 1,
        barcode_a: '123456789',
        barcode_b: '987654321',
        quality_code: 'A+',
        datetime_recorded: new Date(Date.now() - 86100000).toISOString(),
        is_active: true,
      },
      {
        collection_id: 2,
        milk_tank_id: 2,
        barcode_a: '111222333',
        barcode_b: '444555666',
        quality_code: 'A',
        datetime_recorded: new Date(Date.now() - 85800000).toISOString(),
        is_active: true,
      },
    ];

    for (const detail of collectionDetails) {
      await DatabaseService.executeQuery(
        'INSERT INTO collection_details (collection_id, milk_tank_id, barcode_a, barcode_b, quality_code, datetime_recorded, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          detail.collection_id,
          detail.milk_tank_id,
          detail.barcode_a,
          detail.barcode_b,
          detail.quality_code,
          detail.datetime_recorded,
          detail.is_active,
        ]
      );
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export const clearDatabase = async (): Promise<void> => {
  try {
    console.log('Clearing database...');

    const tables = [
      'collection_details',
      'collections',
      'production_unit_route_history',
      'missions',
      'milk_tanks',
      'production_units',
      'routes',
      'members',
      'users',
    ];

    for (const table of tables) {
      await DatabaseService.executeQuery(`DELETE FROM ${table}`);
    }

    console.log('Database cleared successfully!');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};