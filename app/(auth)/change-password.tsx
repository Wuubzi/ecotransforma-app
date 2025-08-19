import ScreenView from "@/components/Screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Toast } from "toastify-react-native";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const { email } = useLocalSearchParams<{ email?: string }>();

  const router = useRouter();

  const handleSubmit = async () => {
    let newErrors = { password: "", confirmPassword: "" };
    let valid = true;
    const passwordRegex = /^(?=.*[A-Z])(?=(?:.*\d){2,}).{8,}$/;

    // Validar contraseña vacía
    if (!password.trim()) {
      newErrors.password = "La contraseña no puede estar vacía";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Debe tener al menos 8 caracteres, 1 mayúscula y 2 números";
    }

    // Validar confirmación vacía
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);

    if (valid) {
      try {
        const respuesta = await fetch(
          `http://192.168.1.11:3000/auth/change-password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              password: password,
            }),
          }
        );
        if (respuesta.status === 401) {
          Toast.error("No estas autorizado para realizar esta accion");
          return;
        }

        if (respuesta.status === 404) {
          Toast.error("Este usuario no existe");
          return;
        }

        if (respuesta.ok) {
          Toast.success("Contraseña Actualizada Correctamente");
          router.replace("/(auth)/login");
        }
      } catch (error) {}
    }
  };

  return (
    <ScreenView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center items-center">
        <View className="w-full max-w-md">
          <Text className="text-2xl font-bold text-center mb-6">
            Nueva Contraseña
          </Text>

          {/* Password */}
          <View className="mb-4">
            <Text className="text-gray-700 mb-2 font-medium">Password</Text>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="border border-gray-300 rounded-lg px-4 py-3 pr-12"
                placeholder="Ingresa Tu Contraseña"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3"
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </Pressable>
            </View>
            {errors.password ? (
              <Text className="text-red-500 mt-1">{errors.password}</Text>
            ) : null}
          </View>

          {/* Confirm Password */}
          <View className="mb-8">
            <Text className="text-gray-700 mb-2 font-medium">
              Confirmar Contraseña
            </Text>
            <View className="relative">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                className="border border-gray-300 rounded-lg px-4 py-3 pr-12"
                placeholder="Vuelve a ingresar tu contraseña"
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </Pressable>
            </View>
            {errors.confirmPassword ? (
              <Text className="text-red-500 mt-1">
                {errors.confirmPassword}
              </Text>
            ) : null}
          </View>

          {/* Submit */}
          <Pressable
            onPress={handleSubmit}
            className="bg-green-500 w-full py-4 rounded-full"
          >
            <Text className="text-white text-center font-semibold text-lg">
              Crear Nueva Contraseña
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenView>
  );
}
