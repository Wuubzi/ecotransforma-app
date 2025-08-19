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

type UserDetail = {
  id_user: number;
  name: string;
  email: string;
  password: string;
  points: number;
  rol: string;
  createdAt: string;
  updatedAt: string;
};

export default function OfertasCanjear() {
  const { id_offer } = useLocalSearchParams();
  const router = useRouter();
  const [oferta, setOferta] = useState<OfferDetail | null>(null);
  const [idUser, setIdUser] = useState<string | null>(null);
  const [User, setUser] = useState<UserDetail>();

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

    if (id_offer) {
      fetch(`http://192.168.1.11:3000/offers/get-offer?id_offer=${id_offer}`)
        .then((res) => res.json())
        .then((data) => setOferta(data))
        .catch((err) => console.error(err));
    }
  }, [id_offer]);

  useEffect(() => {
    if (!idUser) return; // No ejecuta si no hay idUser
    fetch(`http://192.168.1.11:3000/users/get-user?id_user=${idUser}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, [idUser]); // Solo corre cuando idUser cambia

  if (!User) return;
  const redeem = async () => {
    try {
      const respueta = await fetch(
        `http://192.168.1.11:3000/offers/redeem-offer?id_offer=${id_offer}&id_user=${User.id_user}`,
        {
          method: "PUT",
        }
      );

      if (respueta.status === 400) {
        Toast.error("No tienes puntos suficientes para canjear esta oferta");
        return;
      }

      if (respueta.status === 404) {
        Toast.error("Esta oferta no existe");
        return;
      }
      Toast.success("Oferta canjeada exitosamente");
      router.replace("/");
    } catch (error) {}
  };
  if (!oferta) return;
  const restPoints = User.points - oferta.cost;
  return (
    <ScreenView className="bg-backgroundWhite dark:bg-backgroundDark p-4 h-full">
      <View className="bg-white p-4 rounded-lg shadow-md m-4">
        <Text className="text-2xl font-outfitMedium">{oferta?.name}</Text>
        <Text className="text-lg font-outfitMedium border-b border-gray-300 pb-2 mb-4">
          {oferta?.description}
        </Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-outfitMedium">Vence en</Text>
          <Text className="text-2xl font-outfitMedium">27 dias</Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row justify-between items-center ">
          <Text className="text-xl font-outfitMedium dark:text-white">
            Saldo Actual
          </Text>
          <Text className="text-2xl font-outfitMedium dark:text-white">
            {User.points}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-xl font-outfitMedium dark:text-white">
            Oferta
          </Text>
          <Text className="text-2xl font-outfitMedium text-red-500">
            -{oferta?.cost} pts
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-xl font-outfitMedium dark:text-white">
            Puntos Restantes
          </Text>
          <Text className="text-2xl font-outfitMedium dark:text-white">
            {restPoints} pts
          </Text>
        </View>
      </View>

      <Pressable
        onPress={redeem}
        className="bg-[#010100] m-6 p-4 rounded-xl items-center justify-center dark:bg-white"
      >
        <Text className="text-white dark:text-black text-2xl font-outfitMedium">
          Canjear
        </Text>
      </Pressable>
    </ScreenView>
  );
}
