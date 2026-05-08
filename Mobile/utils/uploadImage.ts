import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
export const GetImageFromLibrary = async () => {
    try {
        // Xin quyền truy cập thư viện ảnh
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Toast.show({
                type: "error",
                text1: "Permission to access camera roll is required!",
            })
            return null;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            return result.assets[0].uri;
        } else {
            console.log("User cancelled image picker.");
            return null;
        }
    } catch (error) {
        console.error("Error while picking the image:", error);
        return null;
    }
};
