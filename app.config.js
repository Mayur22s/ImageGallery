export default {
    expo: {
        name: "ImagePickerGallery",
        slug: "imagepicker-gallery",
        icon: "./src/assets/png/appIcon.png",

        ios: {
            icon: "./src/assets/png/appIcon.png",
            bundleIdentifier: "com.mayurl.imagegallery",
        },

        android: {
            adaptiveIcon: {
                foregroundImage: "./src/assets/png/appIcon.png",
                backgroundColor: "#FFFFFF",
            },
            package: "com.mayurl.imagegallery",
        },
    },
};