import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function Empresa() {
  const { id } = useLocalSearchParams();
  const [empresa, setEmpresa] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const listarEmpresa = async () => {
      try {
        const serv = firestore().collection("usuariosPublico").doc(id);
        const doc = await serv.get();
        if (doc.exists) {
          setEmpresa(doc.data());
        }
      } catch (error) {
        console.error("Erro ao buscar empresa:", error);
      }
    };
    listarEmpresa();
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {empresa && (
        <>
          <View style={styles.container}>
            <Image source={{ uri: empresa.foto }} style={styles.image} />
            <View style={styles.infoContainer}>
              <Text style={styles.text}>
                Nome do negócio: {empresa.nomeNegocio}
              </Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Área de atuação: {empresa.area}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Estado: {empresa.estado}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Endereço: {empresa.endereco}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>E-mail: {empresa.email}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.text}>Telefone: {empresa.telefone}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push(`/empresas/empresaServico/${id}`)}
          >
            <Text style={styles.textButton}>Ver os serviços dessa empresa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.textButton}>Entrar em contato</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const largura = Dimensions.get("window").width * 0.8;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },

  infoContainer: {
    width: largura,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: "center",
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
    marginBottom: 10,
    width: largura,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },

  text: {
    fontSize: 18,
    textAlign: "center",
  },

  textButton: {
    fontSize: 16,
    textAlign: "center",
  },
});
