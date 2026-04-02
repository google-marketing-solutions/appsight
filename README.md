# Appsight - mobile app ads insights

Please note: this is not an officially supported Google product.

Appsight helps you visualize the ad request and rendering process with a clear timeline of SDK events, aligning a video capture to events to easily identify latency issues.

## Local Development

### Prerequisites

*   Node.js and npm
*   Python 3.11+
*   [Google Cloud SDK (gcloud)](https://cloud.google.com/sdk/docs/install)

### 1. Setup Backend

The backend is a Flask application that proxies requests to Google Cloud Storage (GCS).

```bash
cd server
pip install -r requirements.txt
# Authenticate to access GCS buckets
gcloud auth application-default login
python main.py
```
The backend will run on `http://127.0.0.1:8080`.

### 2. Setup Frontend

```bash
npm install
ng serve
```
Navigate to `http://localhost:4200/`. The frontend is configured to proxy `/api` requests to the backend at `http://127.0.0.1:8080`.

## Google Cloud Storage (GCS) Implementation

Appsight can load logs and videos directly from GCS using the end-user's credentials.

### Authentication
The application uses Google Identity Services for OAuth2 authentication.
*   **Scopes:** `https://www.googleapis.com/auth/devstorage.read_only`
*   **Access:** The user signed into the browser must have `storage.objects.get` and `storage.objects.list` permissions on the target GCS bucket.

### Setup (for maintainers)
If you are deploying your own instance:
1.  Create an OAuth 2.0 Client ID in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2.  Add your app's URL and `http://localhost:4200` to the **Authorized JavaScript origins**.
3.  Update the `CLIENT_ID` in `src/app/services/upload-service.ts`.

### Path format
Expected GCS path format: `gs://bucket-name/path/to/session/`
The directory should contain:
*   `logcat.txt` (or `logcat`)
*   `video.mp4`

### Usage
*   **Via UI:** Click "Load from GCS" and enter the path.
*   **Via URL:** Append `?gcs_path=gs://your-bucket/path/` to the URL.

## Hosting on Google App Engine

1.  **Build the frontend:**
    ```bash
    npm run build
    ```
    This generates the static files in `server/dist/`.

2.  **Deploy to App Engine:**
    ```bash
    cd server
    gcloud app deploy
    ```

## Capture logs on Android

1. Enable [Network Tracing](https://developers.google.com/ad-manager/mobile-ads-sdk/android/network-tracing) on your device/emulator:
2. Capture the data for your app:
    1. Enable USB debugging
    2. Install ADB on your computer
    3. Run the script: `./data_collection/video_tracing.sh`
    4. The script creates a new directory with screen recording and logs
    5. Navigate to the web app and follow the instructions from the script

## Testing

Run `ng test --watch` to test the project while watching for file changes.
