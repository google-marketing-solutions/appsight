# Copyright 2024 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Web server to serve AppSight.
"""

import logging
import flask
from google.cloud import storage
from google.oauth2 import credentials

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = flask.Flask(__name__)


def get_gcs_client():
    """Returns a GCS client using the user's token or default credentials."""
    auth_header = flask.request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        logger.info("Using provided user token for GCS authentication")
        creds = credentials.Credentials(token)
        return storage.Client(credentials=creds)

    logger.info("Using Application Default Credentials")
    return storage.Client()


def get_blob_or_error(gcs_path, filename):
    """Retrieves a GCS blob or returns an error tuple."""
    if not gcs_path or not gcs_path.startswith("gs://"):
        return None, ("Invalid GCS path", 400)
    try:
        path_parts = gcs_path[5:].split("/", 1)
        bucket_name = path_parts[0]
        prefix = path_parts[1] if len(path_parts) > 1 else ""
        prefix = prefix.strip("/")

        client = get_gcs_client()
        bucket = client.bucket(bucket_name)
        blob_name = f"{prefix}/{filename}"
        blob = bucket.blob(blob_name)

        if not blob.exists():
            # Special case for logcat/logcat.txt fallback
            if filename == "logcat.txt":
                blob = bucket.blob(f"{prefix}/logcat")
                if blob.exists():
                    return blob, None
            return None, (f"{filename} not found", 404)

        return blob, None
    except Exception as e:  # pylint: disable=broad-exception-caught
        logger.exception("Error accessing GCS: %s", e)
        return None, (f"Backend Error: {str(e)}", 500)


@app.route("/api/gcs/metadata")
def gcs_metadata():
    """Returns metadata for a given GCS blob."""
    gcs_path = flask.request.args.get("path")
    filename = flask.request.args.get("file", "video.mp4")
    blob, error = get_blob_or_error(gcs_path, filename)
    if error:
        return error

    blob.reload()  # Get latest metadata
    return flask.jsonify({
        "size": blob.size,
        "name": blob.name,
        "contentType": blob.content_type
    })


@app.route("/api/gcs/download")
def gcs_download():
    """Downloads a GCS blob, optionally supporting range requests."""
    gcs_path = flask.request.args.get("path")
    filename = flask.request.args.get("file", "video.mp4")
    start = flask.request.args.get("start", type=int)
    end = flask.request.args.get("end", type=int)

    blob, error = get_blob_or_error(gcs_path, filename)
    if error:
        return error

    try:
        if start is not None and end is not None:
            # GCS download_as_bytes(start, end) is INCLUSIVE for 'end'.
            # The frontend sends 'end' as EXCLUSIVE (like slice).
            # So we must subtract 1 to get the correct bytes.
            actual_end = max(end - 1, start)

            logger.info("Downloading range %d-%d (requested end %d) for %s",
                        start, actual_end, end, blob.name)
            data = blob.download_as_bytes(start=start, end=actual_end)
            mimetype = blob.content_type or "application/octet-stream"
            return flask.Response(data, mimetype=mimetype)

        # Fallback to streaming for small files
        logger.info("Streaming full blob: %s", blob.name)

        def generate():
            with blob.open("rb") as f:
                while chunk := f.read(65536):
                    yield chunk
        mimetype = blob.content_type or "application/octet-stream"
        return flask.Response(generate(), mimetype=mimetype)
    except Exception as e:  # pylint: disable=broad-exception-caught
        logger.exception("Error downloading GCS blob: %s", e)
        return f"Backend Error: {str(e)}", 500


@app.route("/<path:path>", methods=["GET"])
def static_proxy(path):
    """Proxies static file requests to the dist/browser directory."""
    return flask.send_from_directory("./dist/browser", path)


@app.route("/")
def root():
    """Serves the index.html from the dist/browser directory."""
    return flask.send_from_directory("./dist/browser", "index.html")

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
