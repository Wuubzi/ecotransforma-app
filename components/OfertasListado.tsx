import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

type Offers = {
  id_offer: number;
  name: string;
  description: string;
  cost: number;
  category: string;
};

export default function OfertasComponent() {
  const [Ofertas, setOfertas] = useState<Offers[]>([]);

  const ofertas = async () => {
    const respuesta = await fetch("http://192.168.1.11:3000/offers/get-offers");
    if (respuesta.ok) {
      setOfertas(await respuesta.json());
    }
  };

  useFocusEffect(
    useCallback(() => {
      ofertas();
    }, [])
  );

  return (
    <FlatList
      className="bg-white dark:bg-[#010001] m-4 rounded-xl flex-grow-0"
      data={Ofertas}
      keyExtractor={(item) => item.id_offer.toString()}
      renderItem={({ item }) => (
        <Link
          href={{
            pathname: "/OfertasDisponibles",
            params: { id_offer: item.id_offer },
          }}
          asChild
        >
          <Pressable className="p-4 border-b border-gray-200 flex-row justify-between items-center">
            <View>
              <Text className="text-gray-600 w-60 dark:text-white font-outfitMedium text-2xl">
                {item.name}
              </Text>
              <Text className="text-gray-600 w-60 dark:text-white font-outfitMedium">
                {item.description}
              </Text>
            </View>
            <Text className="text-md font-bold bg-[#eeeeee] px-3 py-1 rounded-full">
              {item.cost} pts
            </Text>
          </Pressable>
        </Link>
      )}
    />
  );
}
