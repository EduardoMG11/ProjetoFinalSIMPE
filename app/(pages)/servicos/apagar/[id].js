import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AuthContext } from "../../../context/AuthContext";

export default function ApagarServico() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [servico, setServico] = useState(null);
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarServico() {
      try {
        const serv = await firestore().collection("servicos").doc(id).get();

        if (serv.exists) {
          setServico(serv.data());
        }
      } catch (error) {
        console.error("Erro ao carregar serviço:", error);
      }
    }

    carregarServico();
  }, [id]);

  async function apagarServico() {
    setLoading(true);
    try {
      if (servico?.nome === nome) {
        await firestore().collection("servicos").doc(id).delete();
        router.replace("/");
        Alert.alert("Serviço apagado com sucesso!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!servico) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Você está buscando apagar esse serviço: {servico.nome}
      </Text>

      <Text style={styles.description}>
        Tem certeza que deseja apagar este serviço? Antes escreva o nome dele
        novamente para ter certeza.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite o nome do serviço"
        onChangeText={setNome}
      />

      <TouchableOpacity style={styles.button} onPress={apagarServico}>
        <Text style={styles.buttonText}>Apagar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
