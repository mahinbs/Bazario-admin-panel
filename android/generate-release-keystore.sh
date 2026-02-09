#!/bin/bash

# Generate release keystore for Android production builds
echo "Generating release keystore..."

# Prompt for keystore details
read -p "Enter keystore password: " KEYSTORE_PASSWORD
read -p "Enter key alias: " KEY_ALIAS
read -p "Enter key password: " KEY_PASSWORD
read -p "Enter your name: " NAME
read -p "Enter your organization: " ORGANIZATION
read -p "Enter your country code (e.g., US): " COUNTRY

# Create release keystore
keytool -genkey -v -keystore app/release.keystore \
  -storepass "$KEYSTORE_PASSWORD" \
  -alias "$KEY_ALIAS" \
  -keypass "$KEY_PASSWORD" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=$NAME,O=$ORGANIZATION,C=$COUNTRY"

echo "Release keystore generated successfully!"
echo "Location: android/app/release.keystore"
echo ""
echo "IMPORTANT: Keep these credentials safe:"
echo "Keystore Password: $KEYSTORE_PASSWORD"
echo "Key Alias: $KEY_ALIAS"
echo "Key Password: $KEY_PASSWORD"
echo ""
echo "You can set these as environment variables:"
echo "export KEYSTORE_PASSWORD='$KEYSTORE_PASSWORD'"
echo "export KEY_ALIAS='$KEY_ALIAS'"
echo "export KEY_PASSWORD='$KEY_PASSWORD'"
