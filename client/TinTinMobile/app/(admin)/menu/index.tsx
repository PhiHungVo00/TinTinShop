import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { router } from "expo-router";
import HeaderList from "@/components/HeaderList";
import ItemTopping from "@/components/ItemTopping";
import EmptyState from "@/components/EmptyState";
import { getToppings } from "@/config/api";
import { ITopping } from "@/types/backend";
import { COLORS } from "@/util/constant";

const MenuScreen = () => {
  const [toppings, setToppings] = useState<ITopping[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const res = await getToppings();
    if (res.data) {
      setToppings(res.data);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <HeaderList title="Toppings" backPress={() => router.back()} showAdd={false} />
      <FlatList
        data={toppings}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ItemTopping topping={item} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<EmptyState title="No toppings" description="" />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
});

export default MenuScreen;
