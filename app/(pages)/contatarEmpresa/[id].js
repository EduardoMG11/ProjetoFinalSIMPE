import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import firestore from "@react-native-firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";
import { AuthContext } from "../../context/AuthContext";
import { enviarEmail } from "../../services/emailServices";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import storage from "@react-native-firebase/storage";

export default function ContatarEmpresa() {
  const user = useContext(AuthContext);
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [remetente, setRemetente] = useState(null);
  const [destinatario, setDestinatario] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [foto, setFoto] = useState([]);
  const [arquivo, setArquivo] = useState([]);

  useEffect(() => {
    console.log("1. ID recebido na rota:", id);
    console.log("2. UID do usuário logado:", user?.uid);
    const carregarDadosRemetente = async () => {
      if (!user?.uid) return;
      try {
        const dadosRemetente = await firestore()
          .collection("usuariosPublico")
          .doc(user.uid)
          .get();

        setRemetente(dadosRemetente.data());
      } catch (e) {
        Alert.alert("Erro ao buscar dados", e.message);
      }
    };
    const carregarDadosDestinatario = async () => {
      if (!user?.uid) return;
      try {
        const dadosDestinatario = await firestore()
          .collection("usuariosPublico")
          .doc(id)
          .get();
        setDestinatario(dadosDestinatario.data());
      } catch (e) {
        Alert.alert("Erro ao buscar dados", e.message);
      }
    };
    carregarDadosRemetente();
    carregarDadosDestinatario();
  }, [user, id]);

  // --- Funções de Upload ---
  const uploadFoto = async (userId, asset) => {
    const nomeOriginal = asset.fileName || `foto_${Date.now()}.jpg`;
    const reference = storage().ref(
      `fotosEmail/${userId}/${Date.now()}_${nomeOriginal}`,
    );
    await reference.putFile(asset.uri);
    return await reference.getDownloadURL();
  };

  const uploadArquivo = async (userId, doc) => {
    const nomeArquivo = `${Date.now()}_${doc.name}`;
    const reference = storage().ref(`pdf/${userId}/${nomeArquivo}`);
    await reference.putFile(doc.uri);
    return await reference.getDownloadURL();
  };

  // --- Funções de Seleção ---
  const escolherFonteFoto = () => {
    Alert.alert("Adicionar foto", "Escolha a origem", [
      { text: "Câmera", onPress: handleCamera },
      { text: "Galeria", onPress: pickImage },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const url = await uploadFoto(user.uid, result.assets[0]);
      setFoto((prev) => [...prev, url]);
    }
  };

  const handleCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      const url = await uploadFoto(user.uid, result.assets[0]);
      setFoto((prev) => [...prev, url]);
    }
  };

  const escolherArquivo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        multiple: true,
      });
      if (!result.canceled) {
        const urls = await Promise.all(
          result.assets.map((doc) => uploadArquivo(user.uid, doc)),
        );
        setArquivo((prev) => [...prev, ...urls]);
      }
    } catch (e) {
      Alert.alert("Erro ao escolher arquivo");
    }
  };

  const sendEmail = async () => {
    if (!user || !remetente || !destinatario) return;
    try {
      if (arquivo.length + foto.length > 6) {
        Alert.alert("Máximo de 6 arquivos!");
        return;
      }
      await firestore()
        .collection("usuariosPublico")
        .doc(id)
        .update({
          ...destinatario,
          negociacoes: firestore.FieldValue.increment(1),
        });
      await firestore()
        .collection("usuariosPublico")
        .doc(user.uid)
        .update({
          ...remetente,
          negociacoes: firestore.FieldValue.increment(1),
        });
      await enviarEmail({
        nome: remetente.nomeNegocio,
        emailRemetente: remetente.email,
        emailDestino: destinatario.email,
        mensagem: mensagem,
        arquivo: arquivo,
        foto: foto,
      });
      Alert.alert(
        "Mensagem enviada com sucesso! Acompanhe agora sua negociação através de seu e-mail.",
      );
      router.replace("/(app)/homepage");
    } catch (e) {
      Alert.alert("Erro ao enviar e-mail", e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text1}>
        {destinatario
          ? `Enviar mensagem para empresa: ${destinatario.nomeNegocio}`
          : "Buscando dados da empresa..."}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Digite aqui sua mensagem"
        value={mensagem}
        onChangeText={setMensagem}
        multiline={true}
      />
      <TouchableOpacity onPress={escolherFonteFoto} style={styles.button}>
        <Text style={styles.txtbutton}>
          Adicionar fotos (opcional) ({foto.length}/6)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={escolherArquivo} style={styles.button}>
        <Text style={styles.txtbutton}>
          Adicionar arquivos (opcional) ({arquivo.length}/6)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={sendEmail} style={styles.button}>
        <Text style={styles.txtbutton}>Enviar mensagem</Text>
      </TouchableOpacity>
    </ScrollView>
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
    paddingHorizontal: 20,
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
    placeholderTextColor: "#666666",
    height: "40%",
    textAlignVertical: "top",
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
