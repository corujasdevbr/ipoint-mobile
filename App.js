import React, { useState, useEffect } from 'react';
import { Platform, Text, View, StyleSheet, ActivityIndicator, Alert, FlatList } from 'react-native';
import { List } from 'react-native-paper';
import * as Location from 'expo-location';

export default function App() {
  const [locais, setLocais] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Insufficient permissions!")
          return;
        }
      }

      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, maximumAge: 10000 });
      buscarLocais(location.coords.latitude, location.coords.longitude)
      setLoading(false);
    })();
  }, []);

  const buscarLocais = (latitude, longitude) => {
    const url = `http://172.18.208.1:5128/api/Local?Latitude=${latitude}&Longitude=${longitude}&metros=3000`

    fetch(url).then(response => {
      return response.json();
    }).then(data => {
      setLocais(data);
    })
  }

  return (
    <View style={styles.container}>
      {
        loading ? <ActivityIndicator size="small" color="#0000ff" /> : <FlatList
          data={locais}
          renderItem={({ item }) => (
            <List.Item
              title={`${item.nome} - ${item.distancia.toString().split('.', 1)[0]}m`}
              description={item.endereco}
            />
          )} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
