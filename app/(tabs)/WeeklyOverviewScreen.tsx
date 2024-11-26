import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Alert, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BarChart } from "react-native-chart-kit";

export default function WeeklyOverviewScreen({ navigation }: any) {
  const [weeklyData, setWeeklyData] = useState<
    { date: string; water: string; steps: string; sleep: string }[]
  >([]);
  const [missingDays, setMissingDays] = useState<string[]>([]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const today = new Date();
        const currentDay = today.getDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
        const monday = new Date(today);
        monday.setDate(today.getDate() + mondayOffset);

        const dates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(monday);
          date.setDate(monday.getDate() + i);
          return date;
        });

        const data = await Promise.all(
          dates.map(async (date) => {
            const formattedDate = date.toISOString().split("T")[0];
            const value = await AsyncStorage.getItem(formattedDate);
            return value
              ? { date: formattedDate, ...JSON.parse(value) }
              : { date: formattedDate, water: "0", steps: "0", sleep: "0" };
          })
        );

        setWeeklyData(data);

        const validDates = dates.filter((date) => date <= today);
        const missing = data
          .filter(
            (item) =>
              validDates.some((date) => item.date === date.toISOString().split("T")[0]) &&
              parseFloat(item.water) === 0 &&
              parseFloat(item.steps) === 0 &&
              parseFloat(item.sleep) === 0
          )
          .map((item) => item.date);

        setMissingDays(missing);
      } catch (error) {
        console.error("Error fetching weekly data:", error);
        Alert.alert("Error", "Failed to fetch weekly data.");
      }
    };

    fetchWeeklyData();
  }, []);

  // navigate 
  const handleLogData = (date: string) => {
    navigation.navigate("DailyLog", { date });
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.text}>Weekly Overview</Text>

        {/* Bar Chart Section */}
        {weeklyData.length > 0 && (
          <>
            <View style={styles.chartTitleContainer}>
              <Ionicons name="water" size={24} color="#7CB9E8" />
              <Text style={styles.chartTitle}>Water Intake</Text>
            </View>
            <BarChart
              data={{
                labels: weeklyData.map((item) => {
                  const date = new Date(item.date);
                  return date.toLocaleDateString("en-US", { weekday: "short" });
                }),
                datasets: [
                  {
                    data: weeklyData.map((item) => parseFloat(item.water || "0")),
                  },
                ],
              }}
              width={Dimensions.get("window").width - 32}
              height={220}
              yAxisLabel=""
              yAxisSuffix="L"
              fromZero
              showBarTops={false}
              withInnerLines={false}
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 1,
                barPercentage: 0.7,
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                propsForBackgroundLines: { strokeWidth: 0 },
              }}
              style={{ marginVertical: 8, borderRadius: 16 }}
            />
          </>
        )}

        {/* Steps and Sleep Summary Section */}
        {weeklyData.filter((item) => parseFloat(item.steps) > 0 || parseFloat(item.sleep) > 0).length > 0 && (
          <View style={styles.summary}>
            <Text style={styles.summaryText}>Steps and Sleep Summary</Text>
            {weeklyData
              .filter((item) => parseFloat(item.steps) > 0 || parseFloat(item.sleep) > 0)
              .map((item, index) => (
                <View key={index} style={styles.daySummary}>
                  <Text style={styles.dayLabel}>
                    {`Day ${index + 1} (${new Date(item.date).toLocaleDateString("en-US", { weekday: "long" })})`}
                  </Text>
                  <View style={styles.metricRow}>
                    <Ionicons name="footsteps" size={24} color="black" style={styles.icon} />
                    <Text style={styles.metric}>{item.steps}</Text>
                  </View>
                  <View style={styles.metricRow}>
                    <MaterialCommunityIcons name="power-sleep" size={24} color="gold" style={styles.icon} />
                    <Text style={styles.metric}>{item.sleep} hrs</Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* Missing Data Section */}
        {missingDays.length > 0 && (
          <View style={styles.missingData}>
            <Text style={styles.missingDataTitle}>Missing Data</Text>
            {missingDays.map((date, index) => (
              <TouchableOpacity key={index} onPress={() => handleLogData(date)}>
                <Text style={styles.missingDataText}>
                  Log your data for {new Date(date).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  text: {
    fontSize: 20,
    marginBottom: 16,
  },
  chartTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 18,
    marginLeft: 8,
    fontWeight: "bold",
  },
  summary: {
    marginTop: 16,
    width: "100%",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  daySummary: {
    flexDirection: "column",
    marginBottom: 16,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  metric: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  missingData: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#f8d7da",
    borderRadius: 8,
  },
  missingDataTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#721c24",
    marginBottom: 8,
  },
  missingDataText: {
    fontSize: 14,
    color: "blue",
    textDecorationLine: "underline",
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
});
