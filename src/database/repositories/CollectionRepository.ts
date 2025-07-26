import DatabaseService from '../DatabaseService';
import { Collection, CollectionWithDetails, CollectionDetail, CollectionDetailWithInfo } from '../../models';

export class CollectionRepository {
  async createCollection(collection: Collection): Promise<number> {
    const query = `
      INSERT INTO collections (route_id, mission_id, production_unit_id, member_id, agent_id, is_active, activation_datetime)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await DatabaseService.executeQuery(query, [
      collection.route_id,
      collection.mission_id,
      collection.production_unit_id,
      collection.member_id,
      collection.agent_id,
      collection.is_active,
      collection.activation_datetime,
    ]);
    return result.insertId;
  }

  async getCollectionById(id: number): Promise<Collection | null> {
    const query = 'SELECT * FROM collections WHERE id = ?';
    const result = await DatabaseService.executeQuery(query, [id]);
    
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  async getCollectionWithDetails(id: number): Promise<CollectionWithDetails | null> {
    const query = `
      SELECT 
        c.*,
        m.reference as mission_reference,
        r.name as route_name,
        pu.name as production_unit_name,
        mem.name as member_name,
        u.name as agent_name
      FROM collections c
      LEFT JOIN missions m ON c.mission_id = m.id
      LEFT JOIN routes r ON c.route_id = r.id
      LEFT JOIN production_units pu ON c.production_unit_id = pu.id
      LEFT JOIN members mem ON c.member_id = mem.id
      LEFT JOIN users u ON c.agent_id = u.id
      WHERE c.id = ?
    `;
    const result = await DatabaseService.executeQuery(query, [id]);
    
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  async getAllCollections(): Promise<CollectionWithDetails[]> {
    const query = `
      SELECT 
        c.*,
        m.reference as mission_reference,
        r.name as route_name,
        pu.name as production_unit_name,
        mem.name as member_name,
        u.name as agent_name
      FROM collections c
      LEFT JOIN missions m ON c.mission_id = m.id
      LEFT JOIN routes r ON c.route_id = r.id
      LEFT JOIN production_units pu ON c.production_unit_id = pu.id
      LEFT JOIN members mem ON c.member_id = mem.id
      LEFT JOIN users u ON c.agent_id = u.id
      ORDER BY c.activation_datetime DESC
    `;
    const result = await DatabaseService.executeQuery(query);
    
    return result;
  }

  async getActiveCollections(): Promise<CollectionWithDetails[]> {
    const query = `
      SELECT 
        c.*,
        m.reference as mission_reference,
        r.name as route_name,
        pu.name as production_unit_name,
        mem.name as member_name,
        u.name as agent_name
      FROM collections c
      LEFT JOIN missions m ON c.mission_id = m.id
      LEFT JOIN routes r ON c.route_id = r.id
      LEFT JOIN production_units pu ON c.production_unit_id = pu.id
      LEFT JOIN members mem ON c.member_id = mem.id
      LEFT JOIN users u ON c.agent_id = u.id
      WHERE c.is_active = 1
      ORDER BY c.activation_datetime DESC
    `;
    const result = await DatabaseService.executeQuery(query);
    
    return result;
  }

  async getCollectionsByMission(missionId: number): Promise<CollectionWithDetails[]> {
    const query = `
      SELECT 
        c.*,
        m.reference as mission_reference,
        r.name as route_name,
        pu.name as production_unit_name,
        mem.name as member_name,
        u.name as agent_name
      FROM collections c
      LEFT JOIN missions m ON c.mission_id = m.id
      LEFT JOIN routes r ON c.route_id = r.id
      LEFT JOIN production_units pu ON c.production_unit_id = pu.id
      LEFT JOIN members mem ON c.member_id = mem.id
      LEFT JOIN users u ON c.agent_id = u.id
      WHERE c.mission_id = ?
      ORDER BY c.activation_datetime DESC
    `;
    const result = await DatabaseService.executeQuery(query, [missionId]);
    
    return result;
  }

  async getCollectionsByAgent(agentId: number): Promise<CollectionWithDetails[]> {
    const query = `
      SELECT 
        c.*,
        m.reference as mission_reference,
        r.name as route_name,
        pu.name as production_unit_name,
        mem.name as member_name,
        u.name as agent_name
      FROM collections c
      LEFT JOIN missions m ON c.mission_id = m.id
      LEFT JOIN routes r ON c.route_id = r.id
      LEFT JOIN production_units pu ON c.production_unit_id = pu.id
      LEFT JOIN members mem ON c.member_id = mem.id
      LEFT JOIN users u ON c.agent_id = u.id
      WHERE c.agent_id = ?
      ORDER BY c.activation_datetime DESC
    `;
    const result = await DatabaseService.executeQuery(query, [agentId]);
    
    return result;
  }

  async updateCollection(id: number, collection: Partial<Collection>): Promise<boolean> {
    const fields = [];
    const values = [];
    
    if (collection.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(collection.is_active);
    }
    
    if (collection.deactivation_datetime !== undefined) {
      fields.push('deactivation_datetime = ?');
      values.push(collection.deactivation_datetime);
    }
    
    if (fields.length === 0) return false;
    
    const query = `UPDATE collections SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await DatabaseService.executeQuery(query, values);
    return result.rowsAffected > 0;
  }

  async deactivateCollection(id: number): Promise<boolean> {
    const query = `
      UPDATE collections 
      SET is_active = 0, deactivation_datetime = datetime('now') 
      WHERE id = ?
    `;
    const result = await DatabaseService.executeQuery(query, [id]);
    return result.rowsAffected > 0;
  }

  // Collection Details methods
  async createCollectionDetail(detail: CollectionDetail): Promise<number> {
    const query = `
      INSERT INTO collection_details (collection_id, milk_tank_id, barcode_a, barcode_b, quality_code, datetime_recorded, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await DatabaseService.executeQuery(query, [
      detail.collection_id,
      detail.milk_tank_id,
      detail.barcode_a,
      detail.barcode_b,
      detail.quality_code,
      detail.datetime_recorded,
      detail.is_active,
    ]);
    return result.insertId;
  }

  async getCollectionDetails(collectionId: number): Promise<CollectionDetailWithInfo[]> {
    const query = `
      SELECT 
        cd.*,
        mt.reference as milk_tank_reference,
        mt.capacity as milk_tank_capacity,
        pu.name as production_unit_name
      FROM collection_details cd
      LEFT JOIN milk_tanks mt ON cd.milk_tank_id = mt.id
      LEFT JOIN production_units pu ON mt.production_unit_id = pu.id
      WHERE cd.collection_id = ?
      ORDER BY cd.datetime_recorded DESC
    `;
    const result = await DatabaseService.executeQuery(query, [collectionId]);
    
    return result;
  }

  async updateCollectionDetail(id: number, detail: Partial<CollectionDetail>): Promise<boolean> {
    const fields = [];
    const values = [];
    
    if (detail.barcode_a !== undefined) {
      fields.push('barcode_a = ?');
      values.push(detail.barcode_a);
    }
    
    if (detail.barcode_b !== undefined) {
      fields.push('barcode_b = ?');
      values.push(detail.barcode_b);
    }
    
    if (detail.quality_code !== undefined) {
      fields.push('quality_code = ?');
      values.push(detail.quality_code);
    }
    
    if (detail.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(detail.is_active);
    }
    
    if (detail.deactivation_datetime !== undefined) {
      fields.push('deactivation_datetime = ?');
      values.push(detail.deactivation_datetime);
    }
    
    if (fields.length === 0) return false;
    
    const query = `UPDATE collection_details SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await DatabaseService.executeQuery(query, values);
    return result.rowsAffected > 0;
  }
}