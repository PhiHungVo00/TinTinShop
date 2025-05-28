import { View, Text, StyleSheet, FlatList } from "react-native"
import { COLORS } from "@/util/constant";
import HeaderList from "@/components/HeaderList";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { IAddressUser } from "@/types/backend";
import { useAppContext } from "@/context/AppContext";
import {getAllAddressOfUser} from "@/config/api";
import ItemAddress from "@/components/ItemAddress";
const Address = () => {
    const {user} = useAppContext();
    const [refreshing, setRefreshing] = useState(false);
    const account = user?.user;
    const [Addresses, setAddresses] = useState<IAddressUser[]>();

    const onRefresh = async () => {
        setRefreshing(true);
        fetchAddresses();
        setRefreshing(false);
    }
    const fetchAddresses = async () =>{
        if(account!=null){
         const res = await getAllAddressOfUser(account.id);
         if(res.data){
             const defaultIndex = res.data.findIndex((item)=>item.defaultAddress);
             const temp = res.data[0];
             res.data[0] = res.data[defaultIndex];
             res.data[defaultIndex] = temp;
             setAddresses(res.data);
         }
        }
     }
    useEffect(()=>{
        fetchAddresses();
    },[])

    const handleEditAddress = (id: string) => {
        if(id){
            router.push({pathname: '/address/AddressDetail', params: {id: id}})
        }

    }
    return (
        <View style={styles.container}>
            <HeaderList title="Địa chỉ" 
            addPress={() => router.push("/address/CreateAddress")}
            backPress={() => router.back()}
            />
             <FlatList
        data={Addresses}
        renderItem={({item}) => <ItemAddress 
                                    receiverName={item.receiverName}
                                    receiverPhone={item.receiverPhone}
                                    description={item.description}
                                    defaultAddress={item.defaultAddress}
                                    address={`${item.addressLine}, ${item.district}, ${item.ward}, ${item.province}`}
                                    onPress={() => handleEditAddress(item.id as string)}
                                    />
    }
        keyExtractor={(item, index) => index.toString()}
        refreshing={refreshing}
        onRefresh={onRefresh}

      />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    }
})
export default Address;