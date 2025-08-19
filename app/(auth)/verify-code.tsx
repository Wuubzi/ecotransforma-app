import ScreenView from "@/components/Screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Toast } from "toastify-react-native";

export default function VerifyCode() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const { email } = useLocalSearchParams<{ email?: string }>();

  // Guardamos referencias a cada input
  const inputsRef = useRef<TextInput[]>([]);

  const handleCodeChange = (value: string, index: number) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < code.length - 1) {
      inputsRef.current[index + 1]?.focus(); // pasa al siguiente
    }

    if (!value && index > 0) {
      inputsRef.current[index - 1]?.focus(); // si borra, va al anterior
    }
  };

  const resendCode = async () => {
    try {
      const respuesta = await fetch(
        `http://192.168.1.11:3000/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (respuesta.status === 404) {
        Toast.error("Este Correo Electronico no Existe");
        return;
      }

      if (respuesta.ok) {
        Toast.success("Codigo Enviado al correo electronico");
        router.push({
          pathname: "/(auth)/verify-code",
          params: { email: email },
        });
      }
    } catch (error) {}
  };

  const handleVerify = async () => {
    if (code.includes("") || code.some((digit) => digit.trim() === "")) {
      alert("Por favor ingresa todos los dígitos del código.");
      return;
    }

    const codeString = code.join("");

    try {
      const respuesta = await fetch(
        `http://192.168.1.11:3000/auth/verify-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, code: codeString }),
        }
      );

      if (respuesta.status === 400) {
        Toast.error("El codigo ingresado no es correcto");
        return;
      }

      if (respuesta.ok) {
        Toast.success("Codigo Verificado");
        router.push({
          pathname: "/(auth)/change-password",
          params: { email: email },
        });
      }
    } catch (error) {}
  };

  return (
    <ScreenView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full items-center">
            <Text className="text-2xl font-bold text-center mb-2">
              Verificar Codigo
            </Text>
            <Text className="text-gray-500 text-center mb-8 px-4">
              Por favor ingresa el codigo enviado al correo Electrónico{"\n"}
              {email}
            </Text>

            {/* Code Input */}
            <View className="flex-row justify-center space-x-4 mb-8">
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el!;
                  }}
                  value={digit}
                  onChangeText={(value) => handleCodeChange(value, index)}
                  className="w-12 h-15 border-2 border-gray-200 rounded-lg text-center text-xl font-semibold"
                  keyboardType="numeric"
                  maxLength={1}
                  returnKeyType="next"
                />
              ))}
            </View>

            {/* Resend Code */}
            <View className="flex-row justify-center mb-8">
              <Text className="text-gray-500">No has recibido el codigo? </Text>
              <Pressable onPress={resendCode}>
                <Text className="text-green-500 font-medium">
                  Reenviar codigo
                </Text>
              </Pressable>
            </View>

            {/* Verify Button */}
            <Pressable
              onPress={handleVerify}
              className="bg-green-500 w-full py-4 rounded-full"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Verificar
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenView>
  );
}
