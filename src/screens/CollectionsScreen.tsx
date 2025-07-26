import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import { collectionRepository } from '../database/repositories';
import { CollectionWithDetails } from '../models';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const CollectionsScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [collections, setCollections] = useState<CollectionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCollections();
  }, [user]);

  const loadCollections = async () => {
    if (!user) return;

    try {
      const userCollections = await collectionRepository.getCollectionsByAgent(user.id!);
      setCollections(userCollections);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectionPress = (collectionId: number) => {
    navigation.navigate('CollectionDetail', { collectionId });
  };

  const renderCollectionItem = ({ item }: { item: CollectionWithDetails }) => (
    <TouchableOpacity 
      style={styles.collectionCard}
      onPress={() => handleCollectionPress(item.id!)}
    >
      <View style={styles.collectionHeader}>
        <Text style={styles.memberName}>{item.member_name}</Text>
        <View style={[
          styles.statusBadge,
          item.is_active ? styles.activeBadge : styles.inactiveBadge
        ]}>
          <Text style={styles.statusText}>
            {item.is_active ? 'En cours' : 'Terminée'}
          </Text>
        </View>
      </View>
      
      <View style={styles.collectionDetails}>
        <Text style={styles.detailLabel}>Mission:</Text>
        <Text style={styles.detailValue}>{item.mission_reference}</Text>
      </View>
      
      <View style={styles.collectionDetails}>
        <Text style={styles.detailLabel}>Route:</Text>
        <Text style={styles.detailValue}>{item.route_name}</Text>
      </View>
      
      <View style={styles.collectionDetails}>
        <Text style={styles.detailLabel}>Unité:</Text>
        <Text style={styles.detailValue}>{item.production_unit_name}</Text>
      </View>
      
      <Text style={styles.collectionDate}>
        Début: {new Date(item.activation_datetime).toLocaleString('fr-FR')}
      </Text>
      
      {item.deactivation_datetime && (
        <Text style={styles.collectionDate}>
          Fin: {new Date(item.deactivation_datetime).toLocaleString('fr-FR')}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Collectes</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Nouvelle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={collections}
        renderItem={renderCollectionItem}
        keyExtractor={(item) => item.id!.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadCollections}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune collecte trouvée</Text>
            <Text style={styles.emptySubtext}>
              Appuyez sur "Nouvelle" pour commencer une collecte
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  collectionCard: {
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
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
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
  collectionDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  collectionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
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
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default CollectionsScreen;