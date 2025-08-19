import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

export default function Depositos() {
  const router = useRouter();
  const depositos = [
    { id: "1", puntos: 100, fecha: "2025-07-25" },
    { id: "2", puntos: 200, fecha: "2025-07-24" },
    // { id: "3", puntos: 150, fecha: "2025-07-23" },
    // { id: "4", puntos: 300, fecha: "2025-07-22" },
    // { id: "5", puntos: 120, fecha: "2025-07-21" },
    // { id: "6", puntos: 80, fecha: "2025-07-20" },
    // { id: "7", puntos: 50, fecha: "2025-07-19" },
    // { id: "8", puntos: 60, fecha: "2025-07-18" },
    // { id: "9", puntos: 110, fecha: "2025-07-17" },
    // { id: "10", puntos: 90, fecha: "2025-07-16" },
    // { id: "11", puntos: 70, fecha: "2025-07-15" },
  ];

  const detailsDeposit = () => {
    router.push({
      pathname: "/details-deposit",
      params: { id_deposit: depositos[0].id },
    });
  };

  const ultimos10 = [...depositos]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 10);

  return (
    <FlatList
      className="bg-white m-4 rounded-lg dark:bg-[#010100] dark:shadow-gray-800 shadow-md"
      data={ultimos10}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <Pressable
          className={`flex-row justify-between items-center p-3 ${
            index !== ultimos10.length - 1 ? "border-b border-gray-200" : ""
          }`}
        >
          <View>
            <Text className="text-lg font-outfitMedium font-bold dark:text-white">
              Ayer
            </Text>
            <Text className="text-md font-outfitMedium font-semibold dark:text-white">
              7:03 pm
            </Text>
          </View>
          <Text className="text-[#25884F] text-lg font-outfitMedium font-bold dark:text-[#7CB895]">
            +{item.puntos} pts
          </Text>
        </Pressable>
      )}
    />
  );
}
