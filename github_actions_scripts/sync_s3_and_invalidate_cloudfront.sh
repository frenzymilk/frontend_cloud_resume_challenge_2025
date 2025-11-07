#!/bin/bash

# --- SYNC FILES TO S3 ---
# Capture output from the sync command
SYNC_OUTPUT=$(aws s3 sync . "s3://$BUCKET_NAME" --delete --size-only --exclude ".git/*" --exclude ".github/*" --exclude "README.md" --exclude ".gitignore" --exclude "github_actions_scripts/*")
echo $SYNC_OUTPUT
# --- EXTRACT FILES UPLOADED ---
# Pull only the file paths from "upload:" lines
FILES=$(echo "$SYNC_OUTPUT" | grep -oP 'upload:\s+\K(.\S+)')
echo $FILES
# --- BUILD INVALIDATION PATHS ---
# CloudFront paths must start with "/"
INVALIDATION_PATHS=""
for FILE in $FILES; do
  INVALIDATION_PATHS="$INVALIDATION_PATHS /$FILE"
done
echo $INVALIDATION_PATHS
# --- CREATE INVALIDATION ---
if [ -n "$INVALIDATION_PATHS" ]; then
  echo "Creating CloudFront invalidation for:"
  echo $INVALIDATION_PATHS

  #aws cloudfront create-invalidation \
  #  --distribution-id "$DISTRIBUTION_ID" \
  #  --paths $INVALIDATION_PATHS
else
  echo "No files uploaded — skipping CloudFront invalidation."
fi

