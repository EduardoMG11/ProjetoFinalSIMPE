import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { AuthContext } from "./context/AuthContext";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const router = useRouter();
  const segments = useSegments();

  const uid = user?.uid ?? null;
  /* função de identificação do usuário  */
  useEffect(() => {
    const unsub = auth().onAuthStateChanged((u) => {
      setUser(u);
      setInitializing(false);
    });
    return unsub;
  }, []);

  // uid === null  → não logado
  // uid !== null  → usuário logado e identificado

  return (
    <AuthContext.Provider value={user}>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthContext.Provider>
  );
}
