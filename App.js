<<<<<<< HEAD
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
=======
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
>>>>>>> f9e8e5fe5191d419c2e186b24b07acd119501ac3
