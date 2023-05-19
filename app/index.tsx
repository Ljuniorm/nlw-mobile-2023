import { StatusBar } from "expo-status-bar";
import { ImageBackground, Text, View, TouchableOpacity } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

import blurBg from "../src/assets/luz.png";
import Stripes from "../src/assets/stripes.svg";
import NLWLogo from "../src/assets/nlwLogo.svg";

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";

import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import { styled } from "nativewind";

import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { useEffect } from "react";
import { api } from "../src/lib/api";

const StyledStripes = styled(Stripes);

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/7b0a6b0e5179a4783265",
};

export default function App() {
  const router = useRouter();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "7b0a6b0e5179a4783265",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  );

  async function handleGithubAuth(code: string) {
    const resp = await api.post("/register", {
      code,
    });

    const { token } = resp.data;
    await SecureStore.setItemAsync("token", token);

    router.push("/memories");
  }

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;

      handleGithubAuth(code);
    }
  }, [response]);

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  if (!hasLoadedFonts) return null;

  return (
    <ImageBackground
      source={blurBg}
      className="relative px-8 bg-gray-900 flex-1 items-center py-10"
      imageStyle={{ position: "absolute", left: "-100%" }}
    >
      <StyledStripes className="absolute left-2" />

      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo></NLWLogo>

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base  leading-relaxed text-gray-100 ">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => promptAsync()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar Lembraça
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>

      <StatusBar style="light" translucent />
    </ImageBackground>
  );
}
