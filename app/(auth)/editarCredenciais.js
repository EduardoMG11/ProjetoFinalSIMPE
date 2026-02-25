import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useState, useContext } from "react";
import auth from "@react-native-firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { useRouter } from "expo-router";

export default function EditarCredenciais() {
  const user = useContext(AuthContext);
  const router = useRouter();
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const atualizarSenha = async () => {
    try {
      await auth().currentUser.updatePassword(novaSenha);
      alert("Senha atualizada com sucesso!");
      setNovaSenha("");
    } catch (error) {
      alert("Erro ao atualizar senha: " + error.message);
      if (error.code === "auth/requires-recent-login") {
        alert("Faça login novamente para continuar.");
        await auth().signOut();
        router.replace("/login");
      }
    }
  };

  const atualizarEmail = async () => {
    try {
      await auth().currentUser.updateEmail(novoEmail);

      alert("Email atualizado com sucesso!");
    } catch (error) {
      alert("Erro ao atualizar email: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar credenciais</Text>
      <View style={styles.senha}>
        <Text style={styles.text}>Alterar senha</Text>
        <TextInput
          value={novaSenha}
          onChangeText={setNovaSenha}
          placeholder="Nova senha"
          autocapitalize="none"
          secureTextEntry={true}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={atualizarSenha}>
          <Text style={styles.buttonText}>Atualizar senha</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.email}>
        <Text style={styles.text}>Alterar email</Text>
        <TextInput
          value={novoEmail}
          onChangeText={(text) => setNovoEmail(text.toLowerCase())}
          placeholder="Novo email"
          autocapitalize="none"
          style={styles.input}
          keyboardType="email-address"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.button} onPress={atualizarEmail}>
          <Text style={styles.buttonText}>Atualizar email</Text>
        </TouchableOpacity>
      </View>
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
  text: {
    fontFamily: "System",
    fontSize: 20,
    color: "#1e66a6",
    alignContent: "center",
    textAlign: "center",
    marginBottom: 10,
  },
  senha: {
    alignContent: "center",
    textAlign: "center",
    paddingVertical: 15,
    marginBottom: 10,
  },
});
