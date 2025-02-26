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

import flask

app = flask.Flask(__name__)


@app.route("/<path:path>", methods=["GET"])
def static_proxy(path):
  """Serves static files."""
  return flask.send_from_directory("./dist/browser", path)


@app.route("/")
def root():
  """Serve Angular FE upon base path access."""
  return flask.send_from_directory("./dist/browser", "index.html")

if __name__ == "__main__":
  app.run(host="127.0.0.1", port=8080, debug=True)
