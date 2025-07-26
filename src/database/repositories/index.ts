export { UserRepository } from './UserRepository';
export { MissionRepository } from './MissionRepository';
export { CollectionRepository } from './CollectionRepository';

// Create repository instances
export const userRepository = new UserRepository();
export const missionRepository = new MissionRepository();
export const collectionRepository = new CollectionRepository();