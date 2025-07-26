import DatabaseService from '../DatabaseService';
import { Mission, MissionWithDetails } from '../../models';

export class MissionRepository {
  async createMission(mission: Mission): Promise<number> {
    const query = `
      INSERT INTO missions (reference, matricule, agent_id, conductor_id, route_id, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await DatabaseService.executeQuery(query, [
      mission.reference,
      mission.matricule,
      mission.agent_id,
      mission.conductor_id,
      mission.route_id,
      mission.is_active,
    ]);
    return result.insertId;
  }

  async getMissionById(id: number): Promise<Mission | null> {
    const query = 'SELECT * FROM missions WHERE id = ?';
    const result = await DatabaseService.executeQuery(query, [id]);
    
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  async getMissionWithDetails(id: number): Promise<MissionWithDetails | null> {
    const query = `
      SELECT 
        m.*,
        a.name as agent_name,
        c.name as conductor_name,
        r.name as route_name
      FROM missions m
      LEFT JOIN users a ON m.agent_id = a.id
      LEFT JOIN users c ON m.conductor_id = c.id
      LEFT JOIN routes r ON m.route_id = r.id
      WHERE m.id = ?
    `;
    const result = await DatabaseService.executeQuery(query, [id]);
    
    if (result.length > 0) {
      return result[0];
    }
    return null;
  }

  async getAllMissions(): Promise<MissionWithDetails[]> {
    const query = `
      SELECT 
        m.*,
        a.name as agent_name,
        c.name as conductor_name,
        r.name as route_name
      FROM missions m
      LEFT JOIN users a ON m.agent_id = a.id
      LEFT JOIN users c ON m.conductor_id = c.id
      LEFT JOIN routes r ON m.route_id = r.id
      ORDER BY m.created_at DESC
    `;
    const result = await DatabaseService.executeQuery(query);
    
    return result;
  }

  async getActiveMissions(): Promise<MissionWithDetails[]> {
    const query = `
      SELECT 
        m.*,
        a.name as agent_name,
        c.name as conductor_name,
        r.name as route_name
      FROM missions m
      LEFT JOIN users a ON m.agent_id = a.id
      LEFT JOIN users c ON m.conductor_id = c.id
      LEFT JOIN routes r ON m.route_id = r.id
      WHERE m.is_active = 1
      ORDER BY m.created_at DESC
    `;
    const result = await DatabaseService.executeQuery(query);
    
    return result;
  }

  async getMissionsByAgent(agentId: number): Promise<MissionWithDetails[]> {
    const query = `
      SELECT 
        m.*,
        a.name as agent_name,
        c.name as conductor_name,
        r.name as route_name
      FROM missions m
      LEFT JOIN users a ON m.agent_id = a.id
      LEFT JOIN users c ON m.conductor_id = c.id
      LEFT JOIN routes r ON m.route_id = r.id
      WHERE m.agent_id = ?
      ORDER BY m.created_at DESC
    `;
    const result = await DatabaseService.executeQuery(query, [agentId]);
    
    return result;
  }

  async getMissionsByRoute(routeId: number): Promise<MissionWithDetails[]> {
    const query = `
      SELECT 
        m.*,
        a.name as agent_name,
        c.name as conductor_name,
        r.name as route_name
      FROM missions m
      LEFT JOIN users a ON m.agent_id = a.id
      LEFT JOIN users c ON m.conductor_id = c.id
      LEFT JOIN routes r ON m.route_id = r.id
      WHERE m.route_id = ?
      ORDER BY m.created_at DESC
    `;
    const result = await DatabaseService.executeQuery(query, [routeId]);
    
    return result;
  }

  async updateMission(id: number, mission: Partial<Mission>): Promise<boolean> {
    const fields = [];
    const values = [];
    
    if (mission.reference !== undefined) {
      fields.push('reference = ?');
      values.push(mission.reference);
    }
    
    if (mission.matricule !== undefined) {
      fields.push('matricule = ?');
      values.push(mission.matricule);
    }
    
    if (mission.agent_id !== undefined) {
      fields.push('agent_id = ?');
      values.push(mission.agent_id);
    }
    
    if (mission.conductor_id !== undefined) {
      fields.push('conductor_id = ?');
      values.push(mission.conductor_id);
    }
    
    if (mission.route_id !== undefined) {
      fields.push('route_id = ?');
      values.push(mission.route_id);
    }
    
    if (mission.is_active !== undefined) {
      fields.push('is_active = ?');
      values.push(mission.is_active);
    }
    
    if (fields.length === 0) return false;
    
    const query = `UPDATE missions SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    
    const result = await DatabaseService.executeQuery(query, values);
    return result.rowsAffected > 0;
  }

  async deleteMission(id: number): Promise<boolean> {
    const query = 'DELETE FROM missions WHERE id = ?';
    const result = await DatabaseService.executeQuery(query, [id]);
    return result.rowsAffected > 0;
  }
}