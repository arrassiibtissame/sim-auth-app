import * as SQLite from 'expo-sqlite';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initializeDatabase(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('MilkCollectionDB.db');

      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      // Users table (Collection Agents)
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Members table (Adherents)
      `CREATE TABLE IF NOT EXISTS members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Routes table (Tournées)
      `CREATE TABLE IF NOT EXISTS routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Production Units table (Unités de Production)
      `CREATE TABLE IF NOT EXISTS production_units (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        member_id INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (member_id) REFERENCES members(id)
      )`,

      // Production Unit Route History
      `CREATE TABLE IF NOT EXISTS production_unit_route_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        production_unit_id INTEGER NOT NULL,
        route_id INTEGER NOT NULL,
        member_id INTEGER NOT NULL,
        activation_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
        deactivation_datetime DATETIME,
        FOREIGN KEY (production_unit_id) REFERENCES production_units(id),
        FOREIGN KEY (route_id) REFERENCES routes(id),
        FOREIGN KEY (member_id) REFERENCES members(id)
      )`,

      // Milk Tanks table (Bacs à Lait)
      `CREATE TABLE IF NOT EXISTS milk_tanks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        capacity REAL NOT NULL,
        production_unit_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (production_unit_id) REFERENCES production_units(id)
      )`,

      // Missions table
      `CREATE TABLE IF NOT EXISTS missions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reference TEXT NOT NULL,
        matricule TEXT NOT NULL,
        agent_id INTEGER NOT NULL,
        conductor_id INTEGER NOT NULL,
        route_id INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES users(id),
        FOREIGN KEY (conductor_id) REFERENCES users(id),
        FOREIGN KEY (route_id) REFERENCES routes(id)
      )`,

      // Collections table (Collectes)
      `CREATE TABLE IF NOT EXISTS collections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_id INTEGER NOT NULL,
        mission_id INTEGER NOT NULL,
        production_unit_id INTEGER NOT NULL,
        member_id INTEGER NOT NULL,
        agent_id INTEGER NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        activation_datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
        deactivation_datetime DATETIME,
        FOREIGN KEY (route_id) REFERENCES routes(id),
        FOREIGN KEY (mission_id) REFERENCES missions(id),
        FOREIGN KEY (production_unit_id) REFERENCES production_units(id),
        FOREIGN KEY (member_id) REFERENCES members(id),
        FOREIGN KEY (agent_id) REFERENCES users(id)
      )`,

      // Collection Details table (Détails de la collecte)
      `CREATE TABLE IF NOT EXISTS collection_details (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        collection_id INTEGER NOT NULL,
        milk_tank_id INTEGER NOT NULL,
        barcode_a TEXT,
        barcode_b TEXT,
        quality_code TEXT,
        datetime_recorded DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1,
        deactivation_datetime DATETIME,
        FOREIGN KEY (collection_id) REFERENCES collections(id),
        FOREIGN KEY (milk_tank_id) REFERENCES milk_tanks(id)
      )`
    ];

    for (const table of tables) {
      await this.db.execAsync(table);
    }
  }

  async executeQuery(query: string, params?: any[]): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    
    if (query.trim().toUpperCase().startsWith('SELECT')) {
      return await this.db.getAllAsync(query, params);
    } else {
      const result = await this.db.runAsync(query, params);
      return {
        insertId: result.lastInsertRowId,
        rowsAffected: result.changes,
        rows: {
          length: 0,
          item: () => null,
        }
      };
    }
  }

  async closeDatabase(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync();
      this.db = null;
    }
  }
}

export default new DatabaseService();