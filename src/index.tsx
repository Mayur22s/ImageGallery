
import React, { useCallback, useEffect, useState } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Modal,
    StyleSheet,
    Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Ionicons } from '@expo/vector-icons'

import { ImageCard } from './components'
import { loadFromStorage, pickImages, requestPermissions, saveToStorage } from './utils/galleyUtils'

const STORAGE_KEY = '@my_gallery_images_v1'

export interface GalleryImage {
    uri: string;
}

const Gallery = () => {
    const [images, setImages] = useState<GalleryImage[]>([])
    const [viewerVisible, setViewerVisible] = useState<boolean>(false)
    const [viewerIndex, setViewerIndex] = useState<number>(0)

    useEffect(() => {
        requestPermissions();
        loadFromStorage(STORAGE_KEY, setImages);
    }, [])

    const pickImagesHandler = async () => {
        await pickImages(STORAGE_KEY, images, setImages, saveToStorage);
    }

    const confirmDelete = (index: number) => {
        Alert.alert('Delete image', 'Remove this image from gallery?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: () => deleteImage(index),
            },
        ])
    }

    const deleteImage = async (index: number) => {
        const updated = images.filter((_, i) => i !== index);
        setImages(updated);
        await saveToStorage(STORAGE_KEY, updated);
    };

    const openViewer = (index: number) => {
        setViewerIndex(index)
        setViewerVisible(true)
    }

    const renderItem = ({ item, index }: { item: GalleryImage, index: number }) => {
        return <ImageCard
            onPress={() => openViewer(index)}
            onLongPress={() => confirmDelete(index)}
            imageItem={item}
            key={item?.uri}
        />
    }

    const renderHeader = useCallback(() => (
        <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setViewerVisible(false)}
        >
            <Ionicons name="close" size={30} color="#fff" />
        </TouchableOpacity>
    ), [])

    const renderIndicator = useCallback((currentIndex, allSize) => (
        <View style={styles.indicator}>
            <Text style={{ color: 'white' }}>{`${currentIndex} / ${allSize}`}</Text>
        </View>
    ), [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Gallery</Text>
                <TouchableOpacity
                    style={styles.pickBtn}
                    onPress={pickImagesHandler}
                >
                    <Ionicons
                        name="images-outline"
                        size={20}
                    />
                    <Text style={styles.pickBtnText}>Pick Images</Text>
                </TouchableOpacity>
            </View>

            {images?.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>No images yet. Tap "Pick Images" to add.</Text>
                </View>
            ) : (
                <FlatList
                    data={images}
                        keyExtractor={(item) => item?.uri}
                    renderItem={renderItem}
                    numColumns={3}
                    contentContainerStyle={styles.list}
                />
            )}

            <Modal
                visible={viewerVisible}
                transparent={true}
                onRequestClose={() => setViewerVisible(false)}
            >
                <ImageViewer
                    imageUrls={images.map((item) => ({ url: item?.uri }))}
                    index={viewerIndex}
                    onCancel={() => setViewerVisible(false)}
                    enableSwipeDown={true}
                    onSwipeDown={() => setViewerVisible(false)}
                    saveToLocalByLongPress={false}
                    renderIndicator={renderIndicator}
                    renderHeader={renderHeader}
                />
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20
    },
    title: { fontSize: 20, fontWeight: '600' },
    pickBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    pickBtnText: { marginLeft: 6 },
    empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#666' },
    list: { paddingHorizontal: 6, paddingBottom: 24 },

    indicator: { position: 'absolute', top: 50, alignSelf: 'center' },
    closeBtn: { position: 'absolute', top: 40, right: 20, zIndex: 2 },
})

export default Gallery