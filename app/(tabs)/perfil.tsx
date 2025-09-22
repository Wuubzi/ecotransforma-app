/* eslint-disable react-hooks/exhaustive-deps */
import ScreenView from "@/components/Screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View
} from "react-native";
import { Toast } from "toastify-react-native";

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

export default function ProfileScreen() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [Name, setName] = useState("");
  const [Email, SetEmail] = useState("");
  const [idUser, setIdUser] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

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


  const fetchUserData = async () => {
    try {
      const respuesta = await fetch(
        `${apiUrl}/users/get-user?id_user=${idUser}`,
        {
          method: "GET",
        }
      );

      const data = await respuesta.json();

      if (respuesta.ok) {
        setName(data.name);
        SetEmail(data.email);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateUserData = async () => {
  if (!idUser) return;

  try {
    setIsUpdating(true);
    const respuesta = await fetch(
      `${apiUrl}/users/update-user?id_user=${idUser}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: Name,
          email: Email,
        }),
      }
    );

    const dataUpdate = await respuesta.json();

    if (respuesta.ok) {
      // Aquí podrías mostrar un alert o toast
      Toast.success("Usuario actualizado con éxito:");
    } else {
      console.log("Error actualizando:", dataUpdate);
    }
  } catch (error) {
    console.error("Error actualizando user:", error);
  } finally {
    setIsUpdating(false);
  }
};
  
  
  



  const logout = async () => {
    const token = await AsyncStorage.getItem("isLogged");
    if (token) {
      AsyncStorage.removeItem("isLogged");
      router.replace("/(auth)/login");
    }
  };


  return (
    <ScreenView className="flex-1 bg-backgroundWhite dark:bg-backgroundDark">
      <View className="flex-1 px-4 pt-6">
        {/* Form Fields */}
        <View className="space-y-4">
          {/* Nombre Field */}
          <Text className="text-base font-semibold text-gray-900 mb-2 mt-4 dark:text-white">
            Nombre
          </Text>
          <View className="relative">
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-4 text-base bg-gray-50 pr-12 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={Name}
              onChangeText={setName}
              placeholderTextColor="#9CA3AF"
              placeholder="Ingresa tu nombre"
            />
          </View>
          
          {/* Email Field */}
          <Text className="text-base font-semibold text-gray-900 mb-2 mt-4 dark:text-white">
            Correo Electrónico
          </Text>
          <View className="relative">
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-4 text-base bg-gray-50 pr-12 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={Email}
              onChangeText={SetEmail}
              placeholderTextColor="#9CA3AF"
              placeholder="Ingresa tu correo"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Update Profile Button */}
          <Pressable
            onPress={updateUserData}
            disabled={isUpdating}
            className="bg-blue-500 m-6 p-4 rounded-xl items-center justify-center disabled:opacity-50"
          >
            <Text className="text-white text-xl font-outfitMedium">
              {isUpdating ? 'Actualizando...' : 'Actualizar Perfil'}
            </Text>
          </Pressable>

          {/* Logout Button */}
          <Pressable
            onPress={logout}
            className="bg-[#010100] m-6 p-4 rounded-xl items-center justify-center dark:bg-white"
          >
            <Text className="text-white text-xl font-outfitMedium dark:text-black">
              Logout
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenView>
  );
}