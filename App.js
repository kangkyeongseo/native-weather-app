import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { Fontisto } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";

const { height, width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "8b46d1d2fb5be43ae110f89a6e57cab0";

const icons = {
  Clear: "day-sunny",
  Clouds: "cloudy",
  Atmosphere: "",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightnimg",
};

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState([]);
  const getWeather = async () => {
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
      const json = await (
        await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        )
      ).json();
      setDays(json.list);
    }
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          days
            .filter((day, index) => index % 8 === 0)
            .map((day, index) => (
              <View>
                <View style={styles.date}>
                  <Text style={styles.dayOfWeek}>Friday</Text>
                  <Text style={styles.dateDetail}>25 November</Text>
                </View>
                <View style={styles.day} key={index}>
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={styles.temp}>
                        {Math.round(day.main.temp)}°
                      </Text>
                      <Fontisto
                        name={icons[day.weather[0].main]}
                        size={68}
                        color="black"
                      />
                    </View>
                    <Text style={styles.description}>
                      {day.weather[0].main}
                    </Text>
                    <Text style={styles.description}>
                      {day.weather[0].description}
                    </Text>
                  </View>
                </View>
              </View>
            ))
        )}
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
    borderBottomWidth: 1,
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
    fontSize: 30,
  },
});
