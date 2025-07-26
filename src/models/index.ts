// User (Collection Agent) interface
export interface User {
  id?: number;
  name: string;
  is_active: boolean;
  created_at?: string;
}

// Member (Adherent) interface
export interface Member {
  id?: number;
  name: string;
  is_active: boolean;
  created_at?: string;
}

// Route (Tournée) interface
export interface Route {
  id?: number;
  name: string;
  is_active: boolean;
  created_at?: string;
}

// Production Unit (Unité de Production) interface
export interface ProductionUnit {
  id?: number;
  name: string;
  member_id: number;
  is_active: boolean;
  created_at?: string;
}

// Production Unit Route History interface
export interface ProductionUnitRouteHistory {
  id?: number;
  production_unit_id: number;
  route_id: number;
  member_id: number;
  activation_datetime: string;
  deactivation_datetime?: string;
}

// Milk Tank (Bac à Lait) interface
export interface MilkTank {
  id?: number;
  reference: string;
  is_active: boolean;
  capacity: number;
  production_unit_id: number;
  created_at?: string;
}

// Mission interface
export interface Mission {
  id?: number;
  reference: string;
  matricule: string;
  agent_id: number;
  conductor_id: number;
  route_id: number;
  is_active: boolean;
  created_at?: string;
}

// Collection (Collecte) interface
export interface Collection {
  id?: number;
  route_id: number;
  mission_id: number;
  production_unit_id: number;
  member_id: number;
  agent_id: number;
  is_active: boolean;
  activation_datetime: string;
  deactivation_datetime?: string;
}

// Collection Details interface
export interface CollectionDetail {
  id?: number;
  collection_id: number;
  milk_tank_id: number;
  barcode_a?: string;
  barcode_b?: string;
  quality_code?: string;
  datetime_recorded: string;
  is_active: boolean;
  deactivation_datetime?: string;
}

// Extended interfaces for views with related data
export interface MissionWithDetails extends Mission {
  agent_name?: string;
  conductor_name?: string;
  route_name?: string;
}

export interface CollectionWithDetails extends Collection {
  mission_reference?: string;
  route_name?: string;
  production_unit_name?: string;
  member_name?: string;
  agent_name?: string;
}

export interface CollectionDetailWithInfo extends CollectionDetail {
  milk_tank_reference?: string;
  milk_tank_capacity?: number;
  production_unit_name?: string;
}