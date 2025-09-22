import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

type Offers = {
  id_offer: number;
  name: string;
  description: string;
  cost: number;
  category: string;
};

export default function OfertasCanjeadas() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [Ofertas, setOfertas] = useState<Offers[]>([]);
  const [idUser, setIdUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const ofertas = async () => {
    if (!idUser) return;
    
    try {
      setLoading(true);
      const respuesta = await fetch(`${apiUrl}/offers/get-offers-redeem?id_user=${idUser}`);
      if (respuesta.ok) {
        const data = await respuesta.json();
         setOfertas(data.map((item: any) => item.offer));

      }
    } catch (error) {
      console.error("Error fetching ofertas:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (idUser) {
        ofertas();
      }
    }, [idUser])
  );

  // Componente para mostrar cuando no hay ofertas
  const EmptyComponent = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-gray-500 dark:text-gray-400 font-outfitMedium text-lg text-center">
        🎁
      </Text>
      <Text className="text-gray-500 dark:text-gray-400 font-outfitMedium text-lg text-center mt-2">
        No hay ofertas canjeadas
      </Text>
      <Text className="text-gray-400 dark:text-gray-500 font-outfit text-sm text-center mt-1 px-8">
        Cuando canjees ofertas, aparecerán aquí
      </Text>
    </View>
  );

  // Componente para mostrar mientras carga
  const LoadingComponent = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-gray-500 dark:text-gray-400 font-outfitMedium text-lg text-center">
        Cargando ofertas...
      </Text>
    </View>
  );

  return (
    <View className="bg-white dark:bg-[#010001] m-4 rounded-xl flex-1">
      {loading ? (
        <LoadingComponent />
      ) : (
        <FlatList
          data={Ofertas}
          keyExtractor={(item) => item.id_offer.toString()}
          renderItem={({ item }) => (
           
              <Pressable className="p-4 border-b border-gray-200 dark:border-gray-700 flex-row justify-between items-center">
                <View>
                  <Text className="text-gray-600 w-60 dark:text-white font-outfitMedium text-2xl">
                    {item.name}
                  </Text>
                  <Text className="text-gray-600 w-60 dark:text-white font-outfitMedium">
                    {item.description}
                  </Text>
                </View>
                <Text className="text-md font-bold bg-[#eeeeee] dark:bg-gray-700 dark:text-white px-3 py-1 rounded-full">
                  {item.cost} pts
                </Text>
              </Pressable>

          )}
          ListEmptyComponent={EmptyComponent}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}
    </View>
  );
}