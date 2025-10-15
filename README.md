# Appsight - mobile app ads insights

Please note: this is not an officially supported Google product.

Appsight helps you visualize the ad request and rendering process with a clear timeline of SDK events, aligning a video capture to events to easily identify latency issues.


## Usage

To run the web app to display captured logs:
1. Run `npm install`
1. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

### Capture logs on Android

1. Enable [Network Tracing](https://developers.google.com/ad-manager/mobile-ads-sdk/android/network-tracing) on your device/emulator.
2. Capture the data for your app:  
2.1. Enable [USB debugging](https://developer.android.com/studio/debug/dev-options)  
2.2. Install [ADB](https://developer.android.com/tools/adb) on your computer  
2.3. Run the script: `./data_collection/video_tracing.sh`  
2.4. The script creates a new directory with screen recording and logs  
2.5. Navigate to the web app and follow the instructions from the script

## Development

## Angular Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Testing

Run `ng test --watch` to test the project while watching for file changes
