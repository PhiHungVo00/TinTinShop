
import * as ImagePicker from 'expo-image-picker';

export const requestImagePickerPermission = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Ứng dụng cần quyền truy cập ảnh để tiếp tục!');
    return false;
  }
  return true;
};
