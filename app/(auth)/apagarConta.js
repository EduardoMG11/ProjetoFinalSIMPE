import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  ActivityIndicator,
} from "react-native";
import { useContext, useState } from "react";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import firestore from "@react-native-firebase/firestore";

export default function ApagarConta() {
  const user = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const deletarServicos = async () => {
    if (!user) return;

    const servicosUsuario = await firestore()
      .collection("servicos")
      .where("usuario", "==", user.uid)
      .get();
    const deletar = servicosUsuario.docs.map((doc) => doc.ref.delete());

    await Promise.all(deletar);
  };

  const deletarDados = async () => {
    if (!user) return;
    setLoading(true);
    try {
      console.log("deleção iniciada");
      await deletarServicos(user.uid);
      await Promise.all([
        firestore().collection("usuariosPublico").doc(user.uid).delete(),
        firestore().collection("usuarios").doc(user.uid).delete(),
      ]);

      user.delete();

      Alert.alert("Sucesso", "Conta deletada", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (error) {
      Alert.alert("Erro ao remover conta");
      console.error(error);
      if (error.code === "auth/requires-recent-login") {
        Alert.alert(
          "Erro",
          "Para excluir sua conta, você precisa fazer login novamente.",
        );
      } else {
        Alert.alert("Erro", "Não foi possível excluir sua conta agora.");
      }
      console.log("deleção terminada");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Uma pena ver você sair! Esperamos te ver novamente por aqui algum dia.
        Pedimos desculpa por qualquer coisa que te incomodou.
      </Text>
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={() =>
          !loading &&
          Alert.alert("Confirmar", "Tem certeza? Esta ação é irreversível.", [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", onPress: deletarDados, style: "destructive" },
          ])
        }
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Apagar minha conta
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    alignItems: "center",
  },
  text: {
    fontFamily: "System",
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e66a6",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 100,
    borderRadius: 5,
    width: "41%",
    alignContent: "center",
  },
});
