import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { enableScreens } from "react-native-screens";

if (Platform.OS === "web") {
  enableScreens(false);
}

import TelaInicial from "./src/Telas/telainicial";
import TelaRegistro from "./src/Telas/registro";
import TelaLogIn from "./src/Telas/login";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TelaInicial"
          component={TelaInicial}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TelaRegistro"
          component={TelaRegistro}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="TelaLogIn"
          component={TelaLogIn}
          options={{ title: "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
