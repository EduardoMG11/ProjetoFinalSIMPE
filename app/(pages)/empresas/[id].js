import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AuthContext } from "../../context/AuthContext";

export default function Empresa() {
  const { id } = useLocalSearchParams();
  const [empresa, setEmpresa] = useState(null);
  const router = useRouter();
  const user = useContext(AuthContext);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
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
    const carregarUsuario = async () => {
      try {
        const usuario = await firestore()
          .collection("usuariosPublico")
          .doc(user.uid)
          .get();
        if (usuario.exists) {
          setPerfil(usuario.data());
        }
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
      }
    };
    carregarUsuario();
  }, [id, user?.uid]);

  const demonstrarInteresse = async () => {
    try {
      if (!perfil) {
        throw new Error("Perfil não encontrado");
      }
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      if (perfil.interessadoEmpresa?.includes(id)) {
        console.log("Usuário já demonstrou interesse");
        return;
      }
      if (
        perfil.interessadoEmpresa.length >= 15 ||
        perfil.interessadoServico.length >= 15
      ) {
        throw new Error(
          "Limite de interesses atingido, remova algum para demonstrar interesse",
        );
      }
      await firestore()
        .collection("usuariosPublico")
        .doc(user.uid)
        .update({
          interessadoEmpresa: firestore.FieldValue.arrayUnion(id),
        });
      setPerfil((prev) => ({
        ...prev,
        interessadoEmpresa: [...prev.interessadoEmpresa, id],
      }));
      Alert.alert("Interesse demonstrado com sucesso!");
    } catch (error) {
      console.error("Erro ao demonstrar interesse:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {empresa && (
        <>
          <Image source={{ uri: empresa.foto }} style={styles.image} />
          <View style={styles.infoContainer}>
            <Text style={styles.text}>
              Nome do negócio: {empresa.nomeNegocio}
            </Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>
              Participou em {empresa.negociacoes} negociações
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

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push(`/empresas/empresaServico/${id}`)}
          >
            <Text style={styles.textButton}>Ver os serviços dessa empresa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={demonstrarInteresse}>
            <Text>Demonstrar interesse nesta empresa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              router.push({
                pathname: "/contatarEmpresa/[id]",
                params: { id: id },
              })
            }
          >
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
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 20,
    paddingBottom: 50,
    backgroundColor: "#e3e3e3",
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
