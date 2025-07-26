import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { missionRepository } from '../database/repositories';
import { MissionWithDetails } from '../models';

const MissionsScreen: React.FC = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<MissionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMissions();
  }, [user]);

  const loadMissions = async () => {
    if (!user) return;

    try {
      const userMissions = await missionRepository.getMissionsByAgent(user.id!);
      setMissions(userMissions);
    } catch (error) {
      console.error('Error loading missions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMissionItem = ({ item }: { item: MissionWithDetails }) => (
    <TouchableOpacity style={styles.missionCard}>
      <View style={styles.missionHeader}>
        <Text style={styles.missionReference}>{item.reference}</Text>
        <View style={[
          styles.statusBadge,
          item.is_active ? styles.activeBadge : styles.inactiveBadge
        ]}>
          <Text style={styles.statusText}>
            {item.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>
      
      <View style={styles.missionDetails}>
        <Text style={styles.detailLabel}>Matricule:</Text>
        <Text style={styles.detailValue}>{item.matricule}</Text>
      </View>
      
      <View style={styles.missionDetails}>
        <Text style={styles.detailLabel}>Route:</Text>
        <Text style={styles.detailValue}>{item.route_name}</Text>
      </View>
      
      <View style={styles.missionDetails}>
        <Text style={styles.detailLabel}>Conducteur:</Text>
        <Text style={styles.detailValue}>{item.conductor_name}</Text>
      </View>
      
      <Text style={styles.createdDate}>
        Créé le: {new Date(item.created_at!).toLocaleDateString('fr-FR')}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Missions</Text>
      </View>

      <FlatList
        data={missions}
        renderItem={renderMissionItem}
        keyExtractor={(item) => item.id!.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadMissions}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune mission trouvée</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  missionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  missionReference: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: '#4CAF50',
  },
  inactiveBadge: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  missionDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  createdDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default MissionsScreen;