import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { COLORS } from '@/util/constant';
import { ITopping } from '@/types/backend';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ToppingStatus } from '@/types/enums/ToppingStatus.enum';

interface ItemToppingProps {
    topping: ITopping;
    imageUri: string;
    editPress: () => void;
    deletePress: () => void;
}

const { width } = Dimensions.get('window');
const itemWidth = (width - 48) / 2; // 16px padding on each side + 16px gap between items

const ItemTopping: React.FC<ItemToppingProps> = ({
    topping,
    imageUri,
    editPress,
    deletePress
}) => {
    const getStatusColor = (status: ToppingStatus) => {
        switch (status) {
            case ToppingStatus.ACTIVE:
                return '#4CAF50';
            case ToppingStatus.INACTIVE:
                return '#FF9800';
            case ToppingStatus.DELETED:
                return '#F44336';
            default:
                return COLORS.ITEM_TEXT;
        }
    };

    const getStatusText = (status: ToppingStatus) => {
        switch (status) {
            case ToppingStatus.ACTIVE:
                return 'Hoạt động';
            case ToppingStatus.INACTIVE:
                return 'Tạm ngưng';
            case ToppingStatus.DELETED:
                return 'Đã xóa';
            default:
                return 'Unknown';
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <View style={styles.container}>
            {/* Image Container */}
            <View style={styles.imageContainer}>
                {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Ionicons name="fast-food-outline" size={32} color={COLORS.ITEM_TEXT} />
                    </View>
                )}
                
                {/* Status Badge */}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(topping.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(topping.status)}</Text>
                </View>
            </View>

            {/* Content Container */}
            <View style={styles.contentContainer}>
                {/* Title */}
                <Text style={styles.title} numberOfLines={2}>{topping.name}</Text>
                
                {/* Description */}
                {topping.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {topping.description}
                    </Text>
                )}

                {/* Price */}
                <View style={styles.priceContainer}>
                    <Text style={styles.price}>{formatPrice(topping.price)}</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={editPress}
                    >
                        <MaterialIcons name="edit" size={16} color="#fff" />
                        <Text style={styles.actionButtonText}>Sửa</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={deletePress}
                    >
                        <MaterialIcons name="delete" size={16} color="#fff" />
                        <Text style={styles.actionButtonText}>Xóa</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: itemWidth,
        backgroundColor: COLORS.ITEM_BACKGROUND,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 120,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.BACKGROUND,
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.BACKGROUND,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 60,
        alignItems: 'center',
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    contentContainer: {
        padding: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.ITEM_TEXT,
        marginBottom: 4,
        lineHeight: 20,
    },
    description: {
        fontSize: 12,
        color: COLORS.ITEM_TEXT,
        opacity: 0.7,
        marginBottom: 8,
        lineHeight: 16,
    },
    priceContainer: {
        marginBottom: 12,
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E91E63',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 4,
    },
    editButton: {
        backgroundColor: '#2196F3',
    },
    deleteButton: {
        backgroundColor: '#F44336',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default ItemTopping;