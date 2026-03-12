import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image 
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";

import data from "./data";
import Accordion from "./Accordion";

export default function plataformaensino() {
  return (
    <ScrollView style={styles.container}>
      <View showsVerticalScrollIndicator={false}>
        {data.map((value, index) => {
          return <Accordion value={value} key={index} />;
        })}
      </View>
    </ScrollView> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  }
});