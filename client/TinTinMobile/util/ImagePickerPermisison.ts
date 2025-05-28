
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';


import { Alert } from 'react-native';


export const requestImagePickerPermission = async () => {
  const { status, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync();

  if (status === 'granted') return true;

  if (!canAskAgain) {
    Alert.alert(
      'Yêu cầu quyền truy cập',
      'Bạn đã từ chối quyền truy cập ảnh. Vui lòng mở Cài đặt để cấp lại quyền.',
      [
        { text: 'Huỷ' },
        {
          text: 'Mở cài đặt',
          onPress: () => {
            Linking.openSettings();
          },
        },
      ]
    );
  }

  const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (newStatus !== 'granted') {
    alert('Ứng dụng cần quyền truy cập ảnh để tiếp tục!');
    return false;
  }

  return true;
};
