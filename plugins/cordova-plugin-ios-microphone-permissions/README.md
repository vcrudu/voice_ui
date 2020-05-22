## iOS 10 Microphone Permissions Plugin for Apache Cordova

**Cordova / PhoneGap Plugin Permission Settings for NSMicrophoneUsageDescription in iOS 10 by adding a declaration to the Info.plist file**

## Install

#### Latest published version on npm (with Cordova CLI >= 5.0.0)

```
cordova plugin add cordova-plugin-ios-camera-permissions --save
```

#### Latest version from GitHub

```
cordova plugin add https://github.com/Cordobo/cordova-plugin-ios-camera-permissions.git --save
```

## Usage

For the changes to `plugin.xml` to take effect, you must refresh the `ios.json` file (inside the `/plugin` folder):
```
$ cordova platform rm ios
$ cordova platform add ios
```

## Platforms

Applies to iOS (10+) only.

## License

[MIT License]
