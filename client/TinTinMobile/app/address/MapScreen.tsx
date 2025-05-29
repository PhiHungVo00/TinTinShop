import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Button,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { mockStores } from "@/util/store";
import StoreCard from "@/components/StoreCard";

export default function MapScreen() {
    const mapRef = useRef<MapView>(null);
  const navigation = useNavigation();

  const focusStore = (store: any) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: store.latitude,
          longitude: store.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500 
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 10.7700,
          longitude: 106.6700,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {mockStores.map((store, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: store.latitude,
              longitude: store.longitude,
            }}
            title={store.name}
          />
        ))}
      </MapView>

      <View style={styles.listContainer}>
        <FlatList
          data={mockStores}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          renderItem={({ item }) => (
           <StoreCard store={item} onPress={() => focusStore(item)}  />
          )}
        />
      </View>

      <View style={styles.backButton}>
        <Button title="Quay lại Cài đặt" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  listContainer: {
    position: "absolute",
    bottom: 100,
  },
  item: {
    backgroundColor: "#fff",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 10,
    elevation: 2,
  },
  itemText: {
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
});
