# ImageGallery
It is a simple/small **React Native** application built using **Expo**. 
It allow users to **pick single or multiple images** from the device gallery.
User can **view** and **delete** them from grid.

Tech Stack
    framework: react-native-expo
    media picker: expo-image-picker
    local storage: @react-native-async-storage/async-storage
    view & zoom image: react-native-image-zoom-viewer

Setup
# Clone repo
   git clone https://github.com/Mayur22s/ImageGallery.git
    cd ImageGallery
# Install dependencies
    npm install
# Run project
    npx expo start 
        => to run project
        => i: to run simulator (iOS)
        => a: to run emulator (android)
    npm run android or npm run ios to run emulator or simulator

# approach
    - use expo-image-picker to request access device photos
    - iOS: configure permission in info.plist 
    - android: configure permission in AndroidManifest.xml
    - in iOS, app crashes if permission did not ask
    - in android, from android version 13+ expo handles permission automatically
        for android version 12 and below, request permission need to be ask
    - if permission is granted, all good. select image/s and open in the app
        if not, alert is shown.
    - if user rejected permission twice then need to give permission manually from setting  (this is default behaviour)

    - User can select single/multiple image/images.
    - AsyncStorage is used to save and get images (on loading the app) locally using key. 
        selected images are merged with previously saved images.
    - Display image list in grid using Flatlist.
        single tap to open image in full view, then double tap to zoom
        long press to delete image with confirmation alert
    - reusable plain functions are implemented

# Known Issues
    : multiple delete images is missing
    : animation is missing