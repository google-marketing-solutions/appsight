# Copyright 2026 Google LLC
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

"""Unit tests for GCS authentication and path validation in server/main.py."""

import unittest
from unittest import mock

from google.cloud import storage
import main


class MainGcsAuthTest(unittest.TestCase):
    """Tests Bearer token enforcement and GCS path/filename validation."""

    def test_missing_or_malformed_bearer_returns_401_without_adc(self):
        client = main.app.test_client()
        invalid_headers = (
            {},
            {"Authorization": "Basic dXNlcjpwYXNz"},
            {"Authorization": "Bearer"},
            {"Authorization": "Bearer   "},
            {"Authorization": "Bearer token1 token2"},
        )
        for headers in invalid_headers:
            with self.subTest(headers=headers), mock.patch.object(
                main.storage, "Client", autospec=True, spec_set=True
            ) as mock_storage_client:
                resp = client.get(
                    "/api/gcs/metadata?path=gs://my-bucket/run1&file=video.mp4",
                    headers=headers,
                )
                self.assertEqual(resp.status_code, 401)
                self.assertEqual(resp.mimetype, "text/plain")
                self.assertEqual(
                    resp.get_data(as_text=True), "Authorization required"
                )
                mock_storage_client.assert_not_called()

    def test_valid_bearer_constructs_client_with_caller_token(self):
        client = main.app.test_client()
        for scheme in ("Bearer", "bearer"):
            with self.subTest(scheme=scheme), mock.patch.object(
                main.storage, "Client", autospec=True, spec_set=True
            ) as mock_storage_client:
                mock_blob = mock.create_autospec(storage.Blob, instance=True)
                mock_blob.exists.return_value = True
                mock_blob.size = 42
                mock_blob.name = "run1/video.mp4"
                mock_blob.content_type = "video/mp4"
                mock_bucket = mock_storage_client.return_value.bucket
                mock_bucket.return_value.blob.return_value = mock_blob

                resp = client.get(
                    "/api/gcs/metadata?path=gs://my-bucket/run1&file=video.mp4",
                    headers={"Authorization": f"{scheme} user-oauth-token"},
                )

                self.assertEqual(resp.status_code, 200)
                self.assertEqual(
                    resp.get_json(),
                    {
                        "size": 42,
                        "name": "run1/video.mp4",
                        "contentType": "video/mp4",
                    },
                )
                mock_storage_client.assert_called_once()
                passed_creds = mock_storage_client.call_args.kwargs[
                    "credentials"
                ]
                self.assertEqual(passed_creds.token, "user-oauth-token")

    def test_disallowed_filename_returns_400_without_gcs_call(self):
        client = main.app.test_client()
        with mock.patch.object(
            main.storage, "Client", autospec=True, spec_set=True
        ) as mock_storage_client:
            resp = client.get(
                "/api/gcs/download?path=gs://my-bucket/run1&file=secret.json",
                headers={"Authorization": "Bearer user-oauth-token"},
            )
            self.assertEqual(resp.status_code, 400)
            self.assertEqual(resp.mimetype, "text/plain")
            self.assertEqual(resp.get_data(as_text=True), "Invalid filename")
            mock_storage_client.assert_not_called()

    def test_invalid_or_empty_bucket_path_returns_400_without_gcs_call(self):
        client = main.app.test_client()
        invalid_urls = (
            "/api/gcs/download?file=logcat.txt",
            "/api/gcs/download?path=https://example.com/x&file=logcat.txt",
            "/api/gcs/download?path=gs://&file=logcat.txt",
            "/api/gcs/download?path=gs:///logcat.txt&file=logcat.txt",
        )
        for url in invalid_urls:
            with self.subTest(url=url), mock.patch.object(
                main.storage, "Client", autospec=True, spec_set=True
            ) as mock_storage_client:
                resp = client.get(
                    url, headers={"Authorization": "Bearer user-oauth-token"}
                )
                self.assertEqual(resp.status_code, 400)
                self.assertEqual(resp.mimetype, "text/plain")
                self.assertEqual(
                    resp.get_data(as_text=True), "Invalid GCS path"
                )
                mock_storage_client.assert_not_called()


if __name__ == "__main__":
    unittest.main()
