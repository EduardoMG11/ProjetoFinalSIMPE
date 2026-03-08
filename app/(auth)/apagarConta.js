import { Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useContext } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import firestore from "@react-native-firebase/firestore";

export default function ApagarConta() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const deletarDados = async () => {
    if (!user) {
      return;
    }
    try {
      await firestore().collection("usuariosPublico").doc(user.uid).delete();
      await firestore().collection("usuarios").doc(user.uid).delete();

      await user.delete();

      Alert.alert("Conta e dados deletados com sucesso!");
      router.replace("/");
    } catch (error) {
      Alert.alert("Erro ao remover conta: ", error);
      if (error.code === "auth/requires-recent-login") {
        Alert.alert(
          "Erro",
          "Para excluir sua conta, você precisa fazer login novamente.",
        );
      } else {
        Alert.alert("Erro", "Não foi possível excluir sua conta agora.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Uma pena ver você sair! Esperamos te ver novamente por aqui algum dia.
        Pedimos desculpa por qualquer coisa que te incomodou.
      </Text>
      <TouchableOpacity
        onPress={() =>
          Alert.alert("Confirmar", "Tem certeza? Esta ação é irreversível.", [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", onPress: deletarDados, style: "destructive" },
          ])
        }
      >
        <Text style={{ color: "red" }}>Apagar minha conta</Text>
      </TouchableOpacity>
      );
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeee",
  },
  text: {
    fontFamily: "System",
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e66a6",
  },
});
