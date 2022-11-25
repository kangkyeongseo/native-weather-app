import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

const { height, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [ok, setOk] = useState(true);
  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    } else {
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      const location = await Location.reverseGeocodeAsync(
        {
          latitude,
          longitude,
        },
        { useGoogleMaps: false }
      );
      setCity(location[0].city);
    }
  };
  useEffect(() => {
    ask();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <View style={styles.date}>
        <Text style={styles.dayOfWeek}>Friday</Text>
        <Text style={styles.dateDetail}>25 November</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        <View style={styles.day}>
          <View>
            <Text style={styles.temp}>27°</Text>
            <Text style={styles.description}>Sunny</Text>
          </View>
        </View>
        <View style={styles.day}>
          <View>
            <Text style={styles.temp}>27°</Text>
            <Text style={styles.description}>Sunny</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "tomato" },
  city: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 24,
    fontWeight: "600",
  },
  date: {
    flex: 0.4,
    margin: 25,
    borderBottomWidth: 2,
  },
  dayOfWeek: { fontSize: 28, fontWeight: "600" },
  dateDetail: { fontSize: 28, fontWeight: "200" },
  weather: {
    marginTop: 50,
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 178,
  },
  description: {
    marginTop: -30,
    fontSize: 30,
  },
});
