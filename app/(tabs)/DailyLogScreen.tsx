import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DailyLogScreen({ route, navigation }: any) {
  const { date } = route.params || {};
  const [water, setWater] = useState<string>("");
  const [steps, setSteps] = useState<string>("");
  const [sleep, setSleep] = useState<string>("");

  const saveData = async () => {
    // Validate inputs
    if (!water || !steps || !sleep) {
      Alert.alert("Missing Data", "Please fill out all fields before saving.");
      return;
    }

    try {
      const selectedDate = date || new Date().toISOString().split("T")[0];
      const data = { water, steps, sleep };
      await AsyncStorage.setItem(selectedDate, JSON.stringify(data)); // Save data using the correct date
      console.log(`Data saved for ${selectedDate}:`, data); // log data
      Alert.alert("Success", "Your data has been saved!");

      // Reset the input fields
      setWater("");
      setSteps("");
      setSleep("");

      navigation.navigate("WeeklyOverview");
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Error", "Failed to save your data.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Log Data for: {date || "Today's Date"}
      </Text>

      {/* Water Intake */}
      <View style={styles.inputRow}>
        <Text style={styles.label}>
          Water Intake (Liters): 
        </Text>
        <Ionicons name="water" size={24} color="#7CB9E8" style={styles.icon} />
      </View>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={water}
        onChangeText={setWater}
      />

      {/* Steps */}
      <View style={styles.inputRow}>
        <Text style={styles.label}>Steps:</Text>
        <Ionicons name="footsteps" size={24} color="black" style={styles.icon} />
      </View>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={steps}
        onChangeText={setSteps}
      />

      {/* Sleep Hours */}
      <View style={styles.inputRow}>
        <Text style={styles.label}>Sleep Hours:</Text>
        <MaterialCommunityIcons
          name="power-sleep"
          size={24}
          color="gold"
          style={styles.icon}
        />
      </View>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={sleep}
        onChangeText={setSleep}
      />

      <Button title="Save" onPress={saveData} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginLeft: 8,
  },
});
