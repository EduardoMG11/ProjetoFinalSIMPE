import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";

export default function TelaLogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const signIn = async () => {
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      const err = error.code;
      if (err === "auth/invalid-email") {
        alert("E-mail inválido");
      } else if (err === "auth/wrong-password") {
        alert("Senha incorreta");
      } else if (err === "auth/user-not-found") {
        alert("Usuário não encontrado");
      } else {
        alert("Erro desconhecido");
        console.log(error);
      }
    } finally {
      router.push("/(app)/homepage");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>
        Bem-vindo de volta. Faça login para continuar.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={signIn}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Entrando..." : "Entrar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    justifyContent: "space-between",
    paddingVertical: 80,
    paddingHorizontal: 30,
  },
  text1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    fontFamily: "System",
  },
  input: {
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "#fff",
    padding: 15,
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    fontFamily: "System",
    fontSize: 16,
    color: "#6b6b9a",
  },
});
