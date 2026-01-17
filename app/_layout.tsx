import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsub = auth().onAuthStateChanged((u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (initializing) return;

    const inAuth = segments[0] === "(auth)";

    if (!user && !inAuth) {
      router.replace("/(auth)/login");
    }

    if (user && inAuth) {
      router.replace("/(app)/homepage");
    }
  }, [user, initializing]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
