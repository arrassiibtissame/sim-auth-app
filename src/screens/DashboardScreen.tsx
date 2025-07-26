import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { missionRepository, collectionRepository } from '../database/repositories';
import { MissionWithDetails, CollectionWithDetails } from '../models';

const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<MissionWithDetails[]>([]);
  const [collections, setCollections] = useState<CollectionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const [userMissions, userCollections] = await Promise.all([
        missionRepository.getMissionsByAgent(user.id!),
        collectionRepository.getCollectionsByAgent(user.id!),
      ]);

      setMissions(userMissions);
      setCollections(userCollections);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveCollections = () => {
    return collections.filter(c => c.is_active).length;
  };

  const getTodayCollections = () => {
    const today = new Date().toISOString().split('T')[0];
    return collections.filter(c => 
      c.activation_datetime.startsWith(today)
    ).length;
  };

  const getActiveMissions = () => {
    return missions.filter(m => m.is_active).length;
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={loadDashboardData}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bonjour, {user?.name}</Text>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getActiveMissions()}</Text>
          <Text style={styles.statLabel}>Missions Actives</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getActiveCollections()}</Text>
          <Text style={styles.statLabel}>Collectes en Cours</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{getTodayCollections()}</Text>
          <Text style={styles.statLabel}>Collectes Aujourd'hui</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{collections.length}</Text>
          <Text style={styles.statLabel}>Total Collectes</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Missions Récentes</Text>
        {missions.slice(0, 3).map((mission) => (
          <View key={mission.id} style={styles.missionCard}>
            <View style={styles.missionHeader}>
              <Text style={styles.missionReference}>{mission.reference}</Text>
              <View style={[
                styles.statusBadge,
                mission.is_active ? styles.activeBadge : styles.inactiveBadge
              ]}>
                <Text style={styles.statusText}>
                  {mission.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
            <Text style={styles.missionRoute}>Route: {mission.route_name}</Text>
            <Text style={styles.missionConductor}>
              Conducteur: {mission.conductor_name}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collectes Récentes</Text>
        {collections.slice(0, 3).map((collection) => (
          <View key={collection.id} style={styles.collectionCard}>
            <View style={styles.collectionHeader}>
              <Text style={styles.collectionMember}>
                {collection.member_name}
              </Text>
              <View style={[
                styles.statusBadge,
                collection.is_active ? styles.activeBadge : styles.inactiveBadge
              ]}>
                <Text style={styles.statusText}>
                  {collection.is_active ? 'Active' : 'Terminée'}
                </Text>
              </View>
            </View>
            <Text style={styles.collectionUnit}>
              Unité: {collection.production_unit_name}
            </Text>
            <Text style={styles.collectionDate}>
              {new Date(collection.activation_datetime).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Actions Rapides</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Nouvelle Collecte</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Voir Toutes les Missions</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    color: '#E3F2FD',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: 'white',
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  missionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  missionReference: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  missionRoute: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  missionConductor: {
    fontSize: 14,
    color: '#666',
  },
  collectionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  collectionMember: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  collectionUnit: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  collectionDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  quickActions: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;