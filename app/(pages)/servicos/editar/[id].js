import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import { useLocalSearchParams } from "expo-router";

export default function editarServico() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const [servico, setServico] = useState({
    nome: "",
    descricao: "",
    area: "",
    troca: "",
    estado: "",
    fotos: [],
    video: null,
    disponivel: true,
  });

  useEffect(() => {
    const identificaServico = async () => {
      try {
        const refServico = firestore().collection("servicos").doc(id);
        const servico = await refServico.get();
        setServico(servico.data());
      } catch (error) {
        console.error("Erro ao buscar serviço:", error);
      }
    };
    identificaServico();
  }, [id]);

  const atualizaServico = async () => {
    try {
      if (!servico) return;
      setLoading(true);
      if (servico.emNegociacao !== true) {
        await firestore().collection("servicos").doc(id).update({
          nome: servico.nome,
          descricao: servico.descricao,
          area: servico.area,
          troca: servico.troca,
          estado: servico.estado,
          disponivel: servico.disponivel,
        });
        Alert.alert("Sucesso", "Serviço atualizado com sucesso!");
      } else if (servico.emNegociacao == true) {
        Alert.alert("Erro", "Serviço em negociação não pode ser editado!");
        return;
      }
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Serviço: {servico.nome}</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do serviço"
        value={servico.nome}
        onChangeText={(text) => setServico({ ...servico, nome: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição do serviço"
        value={servico.descricao}
        onChangeText={(text) => setServico({ ...servico, descricao: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Área de atuação"
        value={servico.area}
        onChangeText={(text) => setServico({ ...servico, area: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Troca pelo serviço"
        value={servico.troca}
        onChangeText={(text) => setServico({ ...servico, troca: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Estado (UF) -> exemplo: Rio de Janeiro"
        value={servico.estado}
        onChangeText={(text) => setServico({ ...servico, estado: text })}
      />
      <TouchableOpacity
        onPress={() =>
          setServico({ ...servico, disponivel: !servico.disponivel })
        }
        style={styles.button}
      >
        <Text style={styles.txtbutton}>
          {servico.disponivel ? "Disponível" : "Indisponível"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={atualizaServico} style={styles.button}>
        <Text style={styles.txtbutton}>
          {loading ? "Salvando..." : "Editar serviço"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  text1: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    fontFamily: "System",
  },
  input: {
    width: "90%",
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
    marginBottom: 12,
  },
  button: {
    width: "90%",
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
    marginBottom: 10,
  },
  txtbutton: {
    fontFamily: "System",
    fontSize: 16,
    color: "#6b6b9a",
  },
});
