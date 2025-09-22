import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

interface DepositDetail {
  id_details_deposit: number;
  name: string;
  unit: string;
  quantity: number;
  points: number;
}

interface Deposit {
  id_deposit: number;
  createdAt: string;
  details: DepositDetail[];
}

interface UserData {
  id_user: number;
  name: string;
  email: string;
  deposits: Deposit[];
}

interface Props {
  refreshKey: Date;
}
export default function Depositos({ refreshKey }: Props) {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [idUser, setIdUser] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      if (idUser) {
        fetchUserData();
      }
    }, [idUser, refreshKey])
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

  // Función para calcular puntos totales
  const calculateTotalPoints = (data: UserData): number => {
    if (!data || !data.deposits || !Array.isArray(data.deposits)) {
      return 0;
    }
    
    return data.deposits.reduce((totalDeposits, deposit) => {
      if (!deposit.details || !Array.isArray(deposit.details)) {
        return totalDeposits;
      }
      
      const depositPoints = deposit.details.reduce((totalDetails, detail) => {
        return totalDetails + (detail.points || 0);
      }, 0);
      
      return totalDeposits + depositPoints;
    }, 0);
  };

  // Función para obtener puntos por depósito
  const getPointsByDeposit = (deposit: Deposit): number => {
    if (!deposit.details || !Array.isArray(deposit.details)) {
      return 0;
    }
    return deposit.details.reduce((total, detail) => total + (detail.points || 0), 0);
  };

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
    const diffInYears = Math.floor(diffInDays / 365);

    // Si es el mismo día
    if (diffInDays === 0) {
      if (diffInMinutes < 1) {
        return "Ahora mismo";
      } else if (diffInMinutes < 60) {
        return `Hace ${diffInMinutes} min`;
      } else {
        return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
      }
    }
    // Si fue ayer
    else if (diffInDays === 1) {
      return "Ayer";
    }
    // Si fue hace 2-6 días
    else if (diffInDays < 7) {
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
    }
    // Si fue hace 1-4 semanas
    else if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? "Hace 1 semana" : `Hace ${diffInWeeks} semanas`;
    }
    // Si fue hace 1-12 meses
    else if (diffInMonths < 12) {
      return diffInMonths === 1 ? "Hace 1 mes" : `Hace ${diffInMonths} meses`;
    }
    // Si fue hace más de un año
    else {
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

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const respuesta = await fetch(
        `${apiUrl}/deposit/get-deposits?id_user=${idUser}`,
        {
          method: "GET",
        }
      );

      const data: UserData = await respuesta.json();
      console.log(data);
      
      setUserData(data);
      setTotalPoints(calculateTotalPoints(data));
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const detailsDeposit = (id_deposit: number) => {
    router.push({
      pathname: "/details-deposit",
      params: { id_deposit: id_deposit.toString() },
    });
  };

  // Ordenar depósitos por fecha más reciente y tomar los últimos 10
  const getRecentDeposits = () => {
    if (!userData || !userData.deposits) return [];
    
    return [...userData.deposits]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  };

  const recentDeposits = getRecentDeposits();

  if (loading) {
    return (
      <View className="bg-white m-4 rounded-lg dark:bg-[#010100] dark:shadow-gray-800 shadow-md p-4">
        <Text className="text-center dark:text-white">Cargando depósitos...</Text>
      </View>
    );
  }

  return (
    <View className="bg-white m-4 rounded-lg dark:bg-[#010100] dark:shadow-gray-800 shadow-md">
   

      {/* Lista de depósitos */}
      <View style={{ maxHeight: 200 }}>
        {recentDeposits.length === 0 ? (
          <View className="p-4">
            <Text className="text-center text-gray-500 dark:text-gray-400">
              No hay depósitos disponibles
            </Text>
          </View>
        ) : (
          <FlatList
            data={recentDeposits}
            keyExtractor={(item) => item.id_deposit.toString()}
            nestedScrollEnabled={true}
            renderItem={({ item, index }) => {
              const depositPoints = getPointsByDeposit(item);
              const relativeTime = getRelativeTime(item.createdAt);
              const exactTime = getExactTime(item.createdAt);

              return (
                <Pressable
                  onPress={() => detailsDeposit(item.id_deposit)}
                  className={`flex-row justify-between items-center p-3 ${
                    index !== recentDeposits.length - 1 
                      ? "border-b border-gray-200 dark:border-gray-600" 
                      : ""
                  }`}
                >
                  <View>
                    <Text className="text-lg font-bold dark:text-white">
                      {relativeTime}
                    </Text>
                    <Text className="text-md text-gray-600 dark:text-gray-300">
                      {exactTime}
                    </Text>
                  </View>
                  <Text className="text-[#25884F] text-lg font-bold dark:text-[#7CB895]">
                    +{depositPoints.toLocaleString()} pts
                  </Text>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}