import React, { FC } from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { GalleryImage } from '../../..'

interface ImageCardProps {
    onPress: () => void
    onLongPress: () => void
    imageItem: GalleryImage
}
const ImageCard: FC<ImageCardProps> = ({
    onLongPress,
    onPress,
    imageItem
}) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.imgWrapper}
        >
            <Image
                source={{ uri: imageItem?.uri }}
                style={styles.img}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    imgWrapper: {
        flex: 1 / 3,
        aspectRatio: 1,
        padding: 6
    },
    img: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
        backgroundColor: '#ddd'
    },
})

export default React.memo(ImageCard)