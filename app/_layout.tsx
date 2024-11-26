import React, { useEffect } from "react";
import { SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DailyLogScreen from "./(tabs)/DailyLogScreen";
import WeeklyOverviewScreen from "./(tabs)/WeeklyOverviewScreen";

const Stack = createStackNavigator();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#ffffff", // Customize as per your design
    },
  };

  return (
    <ThemeProvider value={theme}>
      <Stack.Navigator initialRouteName="DailyLog">
        <Stack.Screen
          name="DailyLog"
          component={DailyLogScreen}
          options={{ title: "Daily Log" }}
        />
        <Stack.Screen
          name="WeeklyOverview"
          component={WeeklyOverviewScreen}
          options={{ title: "Weekly Overview" }}
        />
      </Stack.Navigator>
    </ThemeProvider>
  );
}
