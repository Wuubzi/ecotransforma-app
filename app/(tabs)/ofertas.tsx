import OfertasListado from "@/components/OfertasListado";
import ScreenView from "@/components/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text } from "react-native";

export default function Ofertas() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [points, setPoints] = useState(0);
  const [idUser, setIdUser] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (idUser) {
        fetchUserData();
      }
    }, [idUser])
  );

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
        `http://192.168.1.11:3000/users/get-user?id_user=${idUser}`,
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const userData = await fetchUserData();
      setPoints(userData.points);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <ScreenView className="flex-1 bg-backgroundWhite dark:bg-backgroundDark my-10v">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#10B981", "#059669"]}
            tintColor={isDarkMode ? "#10B981" : "#059669"}
            title="Actualizando datos..."
            titleColor={isDarkMode ? "#ffffff" : "#000000"}
            progressBackgroundColor={isDarkMode ? "#1f2937" : "#ffffff"}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          className="flex-row items-center justify-between p-4 py-6"
          colors={isDarkMode ? ["#d2f5c0", "#6ec28d"] : ["#0d1f14", "#124a2c"]}
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
        <OfertasListado />
      </ScrollView>
    </ScreenView>
  );
}
