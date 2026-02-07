import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import Video from "react-native-video";

export default function Servico() {
  const { id } = useLocalSearchParams();
  const user = useContext(AuthContext);

  const [servico, setServico] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const listarServico = async () => {
      try {
        const serv = firestore().collection("servicos").doc(id);
        const doc = await serv.get();
        if (doc.exists) {
          setServico(doc.data());
        }
      } catch (error) {
        console.error("Erro ao buscar serviço:", error);
      }
    };
    listarServico();
  }, [id]);

  return (
    <View style={styles.container}>
      {servico && (
        <>
          <Text style={styles.title}>{servico.nome}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.descricao}>{servico.descricao}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Área de atuação: {servico.area}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>
              O que espero em troca: {servico.troca}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Estado: {servico.estado}</Text>
          </View>
          <Video source={{ uri: servico.video }} style={styles.video} />
          <Image source={{ uri: servico.fotos[0] }} style={styles.image} />
          <Image source={{ uri: servico.fotos[1] }} style={styles.image} />
          <Image source={{ uri: servico.fotos[2] }} style={styles.image} />
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  infoContainer: {
    width: "75%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  descricao: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: "center",
  },

  text: {
    fontSize: 16,
    marginBottom: 6,
    textAlign: "center",
  },

  video: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },

  image: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
});
