#!/bin/bash
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


# Usage reminder: chmod u+x video_tracing.sh
echo ""
echo "Welcome to the video & ad logs capture tool!"
echo ""

# Remind the user to enable Network Tracing
echo "How to use:"
echo "1. Turn on Network Tracing (if not already)"
echo "   https://developers.google.com/ad-manager/mobile-ads-sdk/android/network-tracing#enable_tracing"
echo ""
# Prompt user to get ready
echo "2. Plug-in your Android device and allow usb debugging"
echo "3. Keep screen unlocked"
echo ""
echo "Note: Screen recording starts at the next step"
echo ""
echo "Press any key when ready (Ctrl-C to abort)"
read anything

# Make directory for this run
# Get the current timestamp in YYYY-MM-DD_HH-MM-SS format
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
mkdir "appsight_$timestamp"
echo "Directory created for output: appsight_$timestamp"

# Capture screen in its own process (setsid) so we can send Control+C to end nicely
adb shell screenrecord --bugreport /data/local/tmp/screenrecord.mp4 &
recordPid=$!

# Clear and Capture network tracing
adb logcat -c
adb logcat '*:S' Ads:I Ads-cont:I > "appsight_$timestamp/adsLogs.txt" &
logcatPid=$!

# Prompt user for when they are done
echo "Use the app that you're auditing."
echo "When you are done, press any key to stop data capture."
read anything

echo ""
echo "ANY key pressed ... hang tight, saving data!"
echo ""

kill $recordPid

# Send control C to close file and then send second kill to actually kill process
kill -SIGINT $logcatPid
kill $logcatPid

# Wait for a few seconds
sleep 5

# Pull recording
adb pull /data/local/tmp/screenrecord.mp4 appsight_$timestamp

# End
echo ""
echo ""
echo "Recording and Logs captured!"
echo ""
echo "Go to AppSight and select the directory:"
echo "'appsight_$timestamp'"
