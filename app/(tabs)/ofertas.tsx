import OfertasCanjeadas from "@/components/OfertasCanjeadas";
import OfertasDisponibles from "@/components/OfertasListado";
import ScreenView from "@/components/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function Ofertas() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [activeTab, setActiveTab] = useState<'disponibles' | 'canjeadas'>('disponibles');
  const [points, setPoints] = useState(0);
  const [idUser, setIdUser] = useState<string | null>(null);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedId = await AsyncStorage.getItem("id_user");
        if (storedId) {
          setIdUser(storedId);
        }
      } catch (error) {
        console.error("Error leyendo AsyncStorage:", error);
      }
    };

    loadUserId();
  }, []);

  const fetchUserData = async (): Promise<{ points: number }> => {
    try {
      const respuesta = await fetch(
        `${apiUrl}/users/get-user?id_user=${idUser}`,
        {
          method: "GET",
        }
      );

      const data = await respuesta.json();

      if (respuesta.ok) {
        setPoints(data.points);
        return {
          points: data?.points,
        };
      }
    } catch (error) {}
    return { points: 0 };
  };

  useEffect(() => {
    if (idUser) {
      fetchUserData();
    }
  }, [idUser]);

  return (
    <ScreenView className="flex-1 bg-backgroundWhite dark:bg-backgroundDark my-10v">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header con puntos */}
                <LinearGradient
          className="flex-row items-center justify-between p-4 py-6"
          colors={
            isDarkMode ? ["#d2f5c0", "#6ec28d"] : ["#0d1f14", "#124a2c"]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 16,
            margin: 16,
            paddingVertical: 12,
          }}
        >
          <Text className="text-white text-xl">Tus Puntos</Text>
          <Text className="text-white text-2xl"> {points} pts</Text>
        </LinearGradient>

        {/* Tabs */}
        <View className="mx-4 mb-4">
          <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <Pressable
              className={`flex-1 py-3 rounded-lg ${
                activeTab === 'disponibles'
                  ? 'bg-white dark:bg-gray-700'
                  : ''
              }`}
              onPress={() => setActiveTab('disponibles')}
            >
              <Text className={`text-center ${
                activeTab === 'disponibles'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                Disponibles
              </Text>
            </Pressable>
            
            <Pressable
              className={`flex-1 py-3 rounded-lg ${
                activeTab === 'canjeadas'
                  ? 'bg-white dark:bg-gray-700'
                  : ''
              }`}
              onPress={() => setActiveTab('canjeadas')}
            >
              <Text className={`text-center ${
                activeTab === 'canjeadas'
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                Canjeadas
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Contenido */}
            {activeTab === 'disponibles' ? <OfertasDisponibles /> : <OfertasCanjeadas />}
      </ScrollView>
    </ScreenView>
  );
}