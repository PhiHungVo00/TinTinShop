import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/util/constant';

interface CategoryCardProps {
    title: string;
    subtitle: string;
    status: boolean;
    onPress: () => void;
    icon?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
    title,
    subtitle,
    status,
    onPress,
    icon = 'grid-outline'
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.card,
                !status && styles.inactiveCard
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[
                styles.iconContainer,
                !status && styles.inactiveIconContainer
            ]}>
                <Ionicons 
                    name={icon as any} 
                    size={32} 
                    color={status ? COLORS.PRIMARY : COLORS.ITEM_TEXT} 
                />
            </View>
            
            <View style={styles.content}>
                <Text style={[
                    styles.title,
                    !status && styles.inactiveTitle
                ]}>
                    {title}
                </Text>
                <Text style={[
                    styles.subtitle,
                    !status && styles.inactiveSubtitle
                ]}>
                    {subtitle}
                </Text>
            </View>

            <View style={[
                styles.statusIndicator,
                { backgroundColor: status ? COLORS.SUCCESS : COLORS.ERROR }
            ]} />

            {!status && (
                <View style={styles.inactiveOverlay}>
                    <Text style={styles.inactiveText}>Không hoạt động</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 180,
        height: 160,
        backgroundColor: COLORS.ITEM_BACKGROUND,
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'relative',
    },
    inactiveCard: {
        opacity: 0.7,
        backgroundColor: COLORS.ITEM_BORDER,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.PRIMARY + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        alignSelf: 'center',
    },
    inactiveIconContainer: {
        backgroundColor: COLORS.ITEM_TEXT + '15',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.TEXT,
        textAlign: 'center',
        marginBottom: 4,
    },
    inactiveTitle: {
        color: COLORS.ITEM_TEXT,
    },
    subtitle: {
        fontSize: 12,
        color: COLORS.ITEM_TEXT,
        textAlign: 'center',
        lineHeight: 16,
    },
    inactiveSubtitle: {
        color: COLORS.ITEM_TEXT + '80',
    },
    statusIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    inactiveOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.ERROR + '20',
        paddingVertical: 4,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        alignItems: 'center',
    },
    inactiveText: {
        fontSize: 10,
        color: COLORS.ERROR,
        fontWeight: '500',
    },
});

export default CategoryCard;