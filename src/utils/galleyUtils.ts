import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

export const STORAGE_KEY = '@my_gallery_images_v1';


// Ask for media library permission (both iOS & Android)
export const requestPermissions = async (): Promise<void> => {
    try {
        if (Platform.OS !== 'web') {
            // request media library permission for both iOS & Android
            // in android 13+, expo handles permission automatically
            // but you need permission in iOS, else app crashes
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            // if permission denied, ask again
            if (status !== 'granted') {
                Alert.alert(
                    'Permission required',
                    'We need access to your photo library to pick images.'
                );
            }
        }
    } catch (err) {
        console.error('Permission error:', err);
    }
};

// load saved images from AsyncStorage
export const loadFromStorage = async <T>(STORAGE_KEY: string, setImages: (data: T) => void): Promise<void> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) setImages(JSON.parse(data));
    } catch (err) {
        console.error('load', err);
    }
};

// save images array to AsyncStorage
export const saveToStorage = async (STORAGE_KEY: string, arr: any[]): Promise<void> => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    } catch (err) {
        console.error('error', err);
    }
};

// pick images from gallery
export const pickImages = async (
    STORAGE_KEY: string,
    images: any[],
    setImages: (data: any[]) => void,
    saveToStorage: (STORAGE_KEY: string, arr: any[]) => Promise<void>
): Promise<void> => {
    try {
        // check permission first
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (newStatus !== 'granted') {
                Alert.alert(
                    'Permission required',
                    'Please allow photo library access to select images.'
                );
                return;
            }
        }

        // proceed to open picker only if permission is granted
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        console.log(result, 'result');
        let selectedImg = [];

        if (!result) return;

        // when images are selected
        if (!result?.canceled && result?.assets?.length) {
            selectedImg = result?.assets.map((item) => ({ uri: item?.uri }));
        }

        if (selectedImg?.length === 0) return

        const merged = [...selectedImg, ...images];
        setImages(merged)

        // saving in the async storage
        await saveToStorage(STORAGE_KEY, merged);
    } catch (error) {
        console.error(error);
    }
};
