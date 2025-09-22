import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StatusBar, Text, View } from 'react-native';

interface DepositDetail {
  id_details_deposit: number;
  name: string;
  unit: string;
  quantity: number;
  points: number;
  totalValue?: number; 
}

interface DepositData {
  id_deposit: number;
  createdAt: string;
  userId: number;
  details: DepositDetail[];
}

interface ApiResponse {
  message: string;
  code: string;
  data: DepositData;
}

export default function DepositDetailsScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const { id_deposit } = useLocalSearchParams();
  console.log(id_deposit)
  
  const [depositData, setDepositData] = useState<DepositData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para formatear fecha relativa
  const getRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInDays === 0) {
      if (diffInMinutes < 1) return "Ahora mismo";
      if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else if (diffInDays === 1) {
      return "Ayer";
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? "Hace 1 semana" : `Hace ${diffInWeeks} semanas`;
    } else if (diffInMonths < 12) {
      return diffInMonths === 1 ? "Hace 1 mes" : `Hace ${diffInMonths} meses`;
    } else {
      const diffInYears = Math.floor(diffInDays / 365);
      return diffInYears === 1 ? "Hace 1 año" : `Hace ${diffInYears} años`;
    }
  };

  // Función para formatear hora exacta
  const getExactTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Función para calcular total de puntos
  const getTotalPoints = (): number => {
    if (!depositData?.details) return 0;
    return depositData.details.reduce((total, detail) => total + (detail.points || 0), 0);
  };

  // Función para calcular valor total del depósito
  const getTotalValue = (): number => {
    if (!depositData?.details) return 0;
    return depositData.details.reduce((total, detail) => total + (detail.totalValue || 0), 0);
  };

  // Función para formatear números con separadores de miles
  const formatNumber = (num: number): string => {
    return num.toLocaleString('es-CO');
  };

  // Función para obtener emoji según el tipo de material
  const getMaterialEmoji = (materialName: string): string => {
    const name = materialName.toLowerCase();
    if (name.includes('botella') || name.includes('plástico')) return '🍶';
    if (name.includes('lata') || name.includes('aluminio')) return '🥤';
    if (name.includes('papel') || name.includes('cartón')) return '📄';
    if (name.includes('vidrio')) return '🍾';
    if (name.includes('metal')) return '🔩';
    return '♻️';
  };

  // Cargar datos del depósito desde la API
  const fetchDepositDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${apiUrl}/deposit/get-deposit?id_deposit=${id_deposit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar los detalles del depósito');
      }

      const result = await response.json();
      setDepositData(result);
      console.log(depositData)

    } catch (error) {
      console.error('Error fetching deposit details:', error);
      setError('No se pudieron cargar los detalles del depósito');
      Alert.alert('Error', 'No se pudieron cargar los detalles del depósito');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (id_deposit) {
        fetchDepositDetails();
      }
    }, [id_deposit])
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#25884F" />
        <Text className="text-gray-600 dark:text-gray-400 mt-4">Cargando detalles...</Text>
      </View>
    );
  }

  if (error || !depositData) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-gray-900 justify-center items-center p-4">
        <Text className="text-red-500 dark:text-red-400 text-center text-lg mb-4">
          {error || 'No se encontraron datos del depósito'}
        </Text>
        <Pressable 
          onPress={() => router.back()}
          className="bg-gray-200 dark:bg-gray-700 px-6 py-3 rounded-lg"
        >
          <Text className="text-gray-700 dark:text-gray-300 font-medium">Volver</Text>
        </Pressable>
      </View>
    );
  }

  const totalPoints = getTotalPoints();
  const totalValue = getTotalValue();
  const relativeTime = getRelativeTime(depositData.createdAt);
  const exactTime = getExactTime(depositData.createdAt);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Header principal */}
          <View className="bg-green-800 dark:bg-green-900 rounded-2xl p-6 mb-4">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-lg font-medium text-white mb-2">
                  Depósito #{depositData.id_deposit}
                </Text>
                <View className="flex-row items-center">
                  <View className="flex-row items-center mr-4">
                    <Text className="text-sm text-green-100 dark:text-green-200 mr-1">📅</Text>
                    <Text className="text-sm text-green-100 dark:text-green-200">
                      {relativeTime}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-sm text-green-100 dark:text-green-200 mr-1">🕰️</Text>
                    <Text className="text-sm text-green-100 dark:text-green-200">
                      {exactTime}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="bg-green-700 dark:bg-green-800 w-10 h-10 rounded-full items-center justify-center">
                <Text className="text-white text-lg">🏆</Text>
              </View>
            </View>
            
            <View className="border-t border-green-700 dark:border-green-800 pt-4">
              <Text className="text-green-100 dark:text-green-200 text-sm mb-1">
                Total de Puntos Ganados
              </Text>
              <Text className="text-3xl font-bold text-white">
                +{formatNumber(totalPoints)} pts
              </Text>
              {totalValue > 0 && (
                <Text className="text-green-200 dark:text-green-300 text-xs mt-1">
                  Valor total: ${formatNumber(totalValue)} COP (10% = ${formatNumber(totalValue * 0.1)} COP)
                </Text>
              )}
            </View>
          </View>

          {/* Resumen de materiales */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Materiales Depositados ({depositData.details.length})
            </Text>
            
            {depositData.details.map((material, index) => (
              <View 
                key={material.id_details_deposit} 
                className="flex-row justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3"
              >
                <View className="flex-1 mr-4">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-lg mr-2">
                      {getMaterialEmoji(material.name)}
                    </Text>
                    <Text className="font-medium text-gray-800 dark:text-white text-base flex-1">
                      {material.name}
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-500 dark:text-gray-400 ml-6">
                    {formatNumber(material.quantity)} {material.unit}
                  </Text>
                  {material.totalValue && (
                    <Text className="text-xs text-gray-400 dark:text-gray-500 ml-6 mt-1">
                      Valor: ${formatNumber(material.totalValue)} COP
                    </Text>
                  )}
                </View>
                <View className="items-end">
                  <View className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">
                    <Text className="text-green-700 dark:text-green-300 font-semibold text-sm">
                      +{formatNumber(material.points)} pts
                    </Text>
                  </View>
                  {material.totalValue && (
                    <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      ${formatNumber(material.totalValue * 0.1)} COP
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Información adicional */}
          <View className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Text className="text-lg mr-2">💡</Text>
              <Text className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                Información del Sistema
              </Text>
            </View>
            
            <View className="space-y-2">
              <View className="flex-row justify-between py-2">
                <Text className="text-blue-700 dark:text-blue-300 font-medium">Comisión aplicada:</Text>
                <Text className="text-blue-800 dark:text-blue-200 font-semibold">10%</Text>
              </View>
              
              <View className="flex-row justify-between py-2">
                <Text className="text-blue-700 dark:text-blue-300 font-medium">Valor por punto:</Text>
                <Text className="text-blue-800 dark:text-blue-200 font-semibold">$1,000 COP</Text>
              </View>
              
              <View className="flex-row justify-between py-2">
                <Text className="text-blue-700 dark:text-blue-300 font-medium">Poder de compra:</Text>
                <Text className="text-blue-800 dark:text-blue-200 font-semibold">
                  ${formatNumber(totalPoints * 1000)} COP
                </Text>
              </View>

              {totalValue > 0 && (
                <>
                  <View className="border-t border-blue-200 dark:border-blue-700 mt-2 pt-2">
                    <View className="flex-row justify-between py-2">
                      <Text className="text-blue-700 dark:text-blue-300 font-medium">Valor total materiales:</Text>
                      <Text className="text-blue-800 dark:text-blue-200 font-semibold">
                        ${formatNumber(totalValue)} COP
                      </Text>
                    </View>
                    
                    <View className="flex-row justify-between py-2">
                      <Text className="text-blue-700 dark:text-blue-300 font-medium">Tu parte (10%):</Text>
                      <Text className="text-blue-800 dark:text-blue-200 font-semibold">
                        ${formatNumber(totalValue * 0.1)} COP
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Estadísticas rápidas */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-4">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Resumen del Depósito
            </Text>
            
            <View className="flex-row justify-between">
              <View className="flex-1 items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mr-2">
                <Text className="text-2xl mb-1">📦</Text>
                <Text className="text-xl font-bold text-gray-800 dark:text-white">
                  {depositData.details.length}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Tipo{depositData.details.length > 1 ? 's' : ''} de Material{depositData.details.length > 1 ? 'es' : ''}
                </Text>
              </View>
              
              <View className="flex-1 items-center bg-gray-50 dark:bg-gray-700 rounded-xl p-4 ml-2">
                <Text className="text-2xl mb-1">⚖️</Text>
                <Text className="text-xl font-bold text-gray-800 dark:text-white">
                  {formatNumber(
                    depositData.details.reduce((total, detail) => total + detail.quantity, 0)
                  )}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Total{depositData.details.length > 1 ? ' Combinado' : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
