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

const monthsLabel = {
  0: "January",
  1: "February",
  2: "March",
  3: "April",
  4: "May",
  5: "June",
  6: "July",
  7: "August",
  8: "September",
  9: "October",
  10: "November",
  11: "December",
};

const daysLabel = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  0: "Sunday",
};

export default function App() {
  const [city, setCity] = useState("");
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
              <View key={index}>
                <View style={styles.date}>
                  <Text style={styles.getDay}>
                    {daysLabel[new Date(day.dt * 1000).getDay()]}
                  </Text>
                  <View style={styles.dateDetail}>
                    <Text style={styles.getDate}>
                      {new Date(day.dt * 1000).getDate()}
                    </Text>
                    <Text style={styles.getMonth}>
                      {monthsLabel[new Date(day.dt * 1000).getMonth()]}
                    </Text>
                  </View>
                </View>
                <View style={styles.day} key={index}>
                  <View>
                    <Text style={styles.temp}>
                      {Math.round(day.main.temp)}°
                    </Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.description}>
                        {day.weather[0].main}
                      </Text>
                      <Fontisto
                        name={icons[day.weather[0].main]}
                        size={24}
                        color="white"
                      />
                    </View>
                    <Text style={styles.descriptionDetail}>
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
    color: "white",
    marginTop: 24,
    fontSize: 24,
    fontWeight: "600",
  },
  weather: {},
  date: {
    margin: 25,
    marginBottom: 150,
  },
  getDay: { fontSize: 28, fontWeight: "600", color: "white" },
  dateDetail: { flexDirection: "row" },
  getDate: {
    fontSize: 28,
    fontWeight: "200",
    paddingRight: 10,
    color: "white",
  },
  getMonth: { fontSize: 28, fontWeight: "200", color: "white" },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    fontSize: 100,
    color: "white",
  },
  description: {
    fontSize: 24,
    color: "white",
    paddingRight: 10,
  },
  descriptionDetail: {
    fontSize: 16,
    color: "white",
  },
});
