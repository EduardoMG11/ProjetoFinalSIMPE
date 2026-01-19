import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";

export default function TelaInicial() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("(app)/perfil")}>
          <Image
            source={require("../../assets/perfil.png")}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("(app)/config")}>
          <Image
            source={require("../../assets/config.png")}
            style={{ width: 30, height: 30 }}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.txtboasvindas}>Bem vindo de volta!</Text>

      {/* Atalhos */}
      <View style={styles.atalhos}>
        <TouchableOpacity
          style={styles.opcao}
          onPress={() => router.push("(app)/regserv")}
        >
          <Image
            source={require("../../assets/servico.png")}
            style={{ width: 35, height: 35 }}
          />
          <Text style={styles.txtopcao}>Registrar Serviço</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.opcao}>
          <Text style={styles.txtopcao}>Outra opção</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.opcao}>
          <Text style={styles.txtopcao}>Mais uma</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <View style={styles.funcionalidades}>
        {/* seu conteúdo continua aqui */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eeeeee",
    paddingVertical: 80,
    paddingHorizontal: 30,
  },

  txtboasvindas: {
    fontSize: 30,
    fontWeight: "500",
    color: "#1e66a6",
    fontFamily: "System",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    textAlign: "left",
  },

  atalhos: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  opcao: {
    width: "30%",
    aspectRatio: 1,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },

  txtopcao: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    fontFamily: "System",
    textAlign: "center",
    marginTop: 5,
  },

  funcionalidades: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
