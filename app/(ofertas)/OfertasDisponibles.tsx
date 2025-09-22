import ScreenView from "@/components/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Toast } from "toastify-react-native";

type OfferDetail = {
  id_offer: number;
  name: string;
  description: string;
  cost: number;
  category: string;
};

export default function OfertasComponent() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL; 
  const router = useRouter();
  const { id_offer } = useLocalSearchParams();
  const [oferta, setOferta] = useState<OfferDetail | null>(null);
  const [idUser, setIdUser] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("id_user").then((value) => {
      setIdUser(value);
    });
    if (id_offer) {
      fetch(`${apiUrl}/offers/get-offer?id_offer=${id_offer}`)
        .then((res) => res.json())
        .then((data) => setOferta(data))
        .catch((err) => console.error(err));
    }
  }, [id_offer]);

  const redeem = async () => {
    
    try {
      const respuesta = await fetch(
        `${apiUrl}/users/get-user?id_user=${idUser}`,
        {
          method: "GET",
        }
      );

      const data = await respuesta.json();

      if (!oferta) {
        Toast.error("No se pudo obtener la oferta");
        return;
      }

      if (data.points < oferta.cost) {
        Toast.error("No tienes puntos suficientes para canjear esta oferta");
        return;
      }

      router.push({
        pathname: "/(ofertas)/OfertasCanjear",
        params: { id_offer: id_offer },
      });
    } catch (error) {}
  };
  return (
    <ScreenView className="bg-backgroundWhite dark:bg-backgroundDark p-4 h-full">
      <View className="bg-white p-4 rounded-lg shadow-md m-4">
        <Text className="text-3xl font-bold font-outfitMedium">
          {oferta?.name}
        </Text>
        <Text className="text-xl font-outfitMedium">{oferta?.description}</Text>
      </View>

      <View className="bg-white p-4 rounded-lg shadow-md m-4">
        <View className="flex-row justify-between items-center border-b border-gray-300 pb-4 mb-4">
          <Text className="text-xl font-outfitMedium">Categoria</Text>
          <Text className="text-lg font-outfitMedium">{oferta?.category}</Text>
        </View>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-outfitMedium">Costo</Text>
          <Text className="text-xl font-outfitMedium">{oferta?.cost}</Text>
        </View>
      </View>

      <Pressable
        onPress={redeem}
        className="bg-[#010100] m-6 p-4 rounded-xl items-center justify-center dark:bg-white"
      >
        <Text className="text-white text-2xl font-outfitMedium dark:text-black">
          Canjear
        </Text>
      </Pressable>
    </ScreenView>
  );
}
