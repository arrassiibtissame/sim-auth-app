import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { collectionRepository } from '../database/repositories';
import { CollectionWithDetails, CollectionDetailWithInfo, CollectionDetail } from '../models';
import { RootStackParamList } from '../navigation/AppNavigator';

type CollectionDetailRouteProp = RouteProp<RootStackParamList, 'CollectionDetail'>;

const CollectionDetailScreen: React.FC = () => {
  const route = useRoute<CollectionDetailRouteProp>();
  const { collectionId } = route.params;
  
  const [collection, setCollection] = useState<CollectionWithDetails | null>(null);
  const [details, setDetails] = useState<CollectionDetailWithInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state for new detail
  const [barcodeA, setBarcodeA] = useState('');
  const [barcodeB, setBarcodeB] = useState('');
  const [qualityCode, setQualityCode] = useState('');
  const [selectedTankId, setSelectedTankId] = useState<number | null>(null);

  useEffect(() => {
    loadCollectionData();
  }, [collectionId]);

  const loadCollectionData = async () => {
    try {
      const [collectionData, detailsData] = await Promise.all([
        collectionRepository.getCollectionWithDetails(collectionId),
        collectionRepository.getCollectionDetails(collectionId),
      ]);

      setCollection(collectionData);
      setDetails(detailsData);
    } catch (error) {
      console.error('Error loading collection data:', error);
      Alert.alert('Erreur', 'Impossible de charger les données de collecte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddDetail = async () => {
    if (!barcodeA && !barcodeB) {
      Alert.alert('Erreur', 'Veuillez saisir au moins un code-barres');
      return;
    }

    if (!selectedTankId) {
      Alert.alert('Erreur', 'Veuillez sélectionner un bac à lait');
      return;
    }

    try {
      const newDetail: CollectionDetail = {
        collection_id: collectionId,
        milk_tank_id: selectedTankId,
        barcode_a: barcodeA || undefined,
        barcode_b: barcodeB || undefined,
        quality_code: qualityCode || undefined,
        datetime_recorded: new Date().toISOString(),
        is_active: true,
      };

      await collectionRepository.createCollectionDetail(newDetail);
      
      // Clear form
      setBarcodeA('');
      setBarcodeB('');
      setQualityCode('');
      setSelectedTankId(null);
      
      // Reload data
      await loadCollectionData();
      
      Alert.alert('Succès', 'Détail de collecte ajouté avec succès');
    } catch (error) {
      console.error('Error adding detail:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le détail de collecte');
    }
  };

  const handleFinishCollection = async () => {
    Alert.alert(
      'Confirmer',
      'Voulez-vous terminer cette collecte ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Terminer',
          style: 'destructive',
          onPress: async () => {
            try {
              await collectionRepository.deactivateCollection(collectionId);
              await loadCollectionData();
              Alert.alert('Succès', 'Collecte terminée avec succès');
            } catch (error) {
              console.error('Error finishing collection:', error);
              Alert.alert('Erreur', 'Impossible de terminer la collecte');
            }
          },
        },
      ]
    );
  };

  if (isLoading || !collection) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        {/* Collection Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de Collecte</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Membre:</Text>
              <Text style={styles.infoValue}>{collection.member_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mission:</Text>
              <Text style={styles.infoValue}>{collection.mission_reference}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Route:</Text>
              <Text style={styles.infoValue}>{collection.route_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Unité:</Text>
              <Text style={styles.infoValue}>{collection.production_unit_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Statut:</Text>
              <View style={[
                styles.statusBadge,
                collection.is_active ? styles.activeBadge : styles.inactiveBadge
              ]}>
                <Text style={styles.statusText}>
                  {collection.is_active ? 'En cours' : 'Terminée'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Collection Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails de Collecte ({details.length})</Text>
          {details.map((detail, index) => (
            <View key={detail.id} style={styles.detailCard}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailIndex}>#{index + 1}</Text>
                <Text style={styles.detailTime}>
                  {new Date(detail.datetime_recorded).toLocaleTimeString('fr-FR')}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Bac:</Text>
                <Text style={styles.detailValue}>{detail.milk_tank_reference}</Text>
              </View>
              {detail.barcode_a && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Code A:</Text>
                  <Text style={styles.detailValue}>{detail.barcode_a}</Text>
                </View>
              )}
              {detail.barcode_b && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Code B:</Text>
                  <Text style={styles.detailValue}>{detail.barcode_b}</Text>
                </View>
              )}
              {detail.quality_code && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Qualité:</Text>
                  <Text style={styles.detailValue}>{detail.quality_code}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Add New Detail Form (only if collection is active) */}
        {collection.is_active && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ajouter un Détail</Text>
            <View style={styles.formCard}>
              <Text style={styles.inputLabel}>Code-barres A</Text>
              <TextInput
                style={styles.input}
                value={barcodeA}
                onChangeText={setBarcodeA}
                placeholder="Scanner ou saisir le code A"
              />

              <Text style={styles.inputLabel}>Code-barres B</Text>
              <TextInput
                style={styles.input}
                value={barcodeB}
                onChangeText={setBarcodeB}
                placeholder="Scanner ou saisir le code B"
              />

              <Text style={styles.inputLabel}>Code Qualité</Text>
              <TextInput
                style={styles.input}
                value={qualityCode}
                onChangeText={setQualityCode}
                placeholder="Code qualité (optionnel)"
              />

              <TouchableOpacity style={styles.button} onPress={handleAddDetail}>
                <Text style={styles.buttonText}>Ajouter Détail</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {collection.is_active && (
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.finishButton]} 
            onPress={handleFinishCollection}
          >
            <Text style={styles.buttonText}>Terminer la Collecte</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
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
  detailCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailIndex: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  detailTime: {
    fontSize: 12,
    color: '#999',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    width: 60,
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  formCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  finishButton: {
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  actionContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
});

export default CollectionDetailScreen;