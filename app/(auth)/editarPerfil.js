import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "@react-native-firebase/firestore";
import * as ImagePicker from "expo-image-picker";

export default function EditarPerfil() {
  const user = useContext(AuthContext);
  const router = useRouter();
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fotoPerfilUrl = async (uri) => {
      {
        /* Transformar a foto de perfil em url */
      }
      const user = auth().currentUser;
      if (!user) throw new Error("Usuário não autenticado");

      const ref = storage().ref(`users/${user.uid}/profile.jpg`);

      const response = await fetch(uri);
      const blob = await response.blob();

      await ref.put(blob);

      return await ref.getDownloadURL();
    };

    async function carregarPerfil() {
      {
        /* Carregar perfil  */
      }
      if (!user) return;

      const snap = await firestore().collection("usuarios").doc(user.uid).get();

      if (snap.exists) {
        setPerfil(snap.data());
      }

      setLoading(false);
    }

    carregarPerfil();
  }, [user]);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!perfil) {
    return <Text>Perfil não encontrado</Text>;
  }

  const updateUser = async () => {
    try {
      await firestore().collection("usuarios").doc(user.uid).update(perfil);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
    }
  };
  const pickImage = async () => {
    {
      /* Imagem da galeria */
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPerfil({ ...perfil, foto: uri });
    }
  };

  const handleFoto = async () => {
    {
      /* Tirar foto  */
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPerfil({ ...perfil, foto: uri });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      <Image
        key={perfil.foto}
        source={{ uri: perfil.foto }}
        style={styles.image}
      />
      <TextInput
        value={perfil.nome}
        onChangeText={(text) => setPerfil({ ...perfil, nome: text })}
        style={styles.input}
        placeholder="Nome"
      />
      <TextInput
        value={perfil.sobrenome}
        onChangeText={(text) => setPerfil({ ...perfil, sobrenome: text })}
        style={styles.input}
        placeholder="Sobrenome"
      />
      <TextInput
        value={perfil.endereco}
        onChangeText={(text) => setPerfil({ ...perfil, endereco: text })}
        style={styles.input}
        placeholder="Endereço"
      />
      <TextInput
        value={perfil.area}
        onChangeText={(text) => setPerfil({ ...perfil, area: text })}
        style={styles.input}
        placeholder="Área de atuação"
      />
      <TextInput
        value={perfil.telefone}
        onChangeText={(text) => setPerfil({ ...perfil, telefone: text })}
        style={styles.input}
        placeholder="Telefone"
      />
      <TextInput
        value={perfil.nomeNegocio}
        onChangeText={(text) => setPerfil({ ...perfil, nomeNegocio: text })}
        style={styles.input}
        placeholder="Nome do negócio"
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Selecionar nova foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleFoto}>
        <Text style={styles.buttonText}>Tirar nova foto</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={updateUser}>
        <Text style={styles.buttonText}>Atualizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FB",
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
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
    marginBottom: 12,
    placeholderTextColor: "#666666",
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
  },
  buttonText: {
    fontFamily: "System",
    fontSize: 16,
    color: "#6b6b9a",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: "center",
    marginBottom: 20,
    backgroundColor: "#eaeaea",
  },
});
