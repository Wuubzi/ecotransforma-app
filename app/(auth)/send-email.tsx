import ScreenView from "@/components/Screen";
import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function SendEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ email?: string }>({});

  const validate = () => {
    let valid = true;
    let newErrors: { email?: string } = {};
    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "El correo no es válido";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const sendEmail = async () => {
    if (!validate()) return;
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
              Enviar Codigo
            </Text>
            <Text className="text-gray-500 text-center mb-8 px-4">
              Por favor ingresa el correo Electrónico asociado a su cuenta
            </Text>

            <TextInput
              className={`w-full border rounded-xl px-4 py-4 text-base bg-gray-50 ${
                errors.email ? "border-red-500" : "border-gray-200"
              }`}
              placeholder="Ingresa tu Correo Electrónico"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#9CA3AF"
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
            )}

            <Pressable
              onPress={sendEmail}
              className="bg-green-500 my-5 w-full py-4 rounded-full"
            >
              <Text className="text-white text-center font-semibold text-lg">
                Enviar Codigo
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenView>
  );
}
