import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

interface StoreCardProps {
  store: any;
  onPress: () => void;
}

const StoreCard = ({ store, onPress }: StoreCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={store.image} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.title}>{store.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {store.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 10,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});

export default StoreCard;
