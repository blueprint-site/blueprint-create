#!/bin/bash

echo "Adding validation fields to Appwrite addons collection..."

# Validation fields
echo "Adding validationScore..."
appwrite databases create-integer-attribute --database-id main --collection-id addons --key validationScore --min 0 --max 100 --xdefault 0 --required false

echo "Adding autoValidated..."
appwrite databases create-boolean-attribute --database-id main --collection-id addons --key autoValidated --xdefault false --required false

echo "Adding validationFlags..."
appwrite databases create-string-attribute --database-id main --collection-id addons --key validationFlags --size 1000 --xdefault "[]" --required false --array true

echo "Adding validationTimestamp..."
appwrite databases create-datetime-attribute --database-id main --collection-id addons --key validationTimestamp --required false

echo "Adding reviewNotes..."
appwrite databases create-string-attribute --database-id main --collection-id addons --key reviewNotes --size 5000 --required false

echo "Adding stage..."
appwrite databases create-enum-attribute --database-id main --collection-id addons --key stage --elements pending reviewing approved rejected archived --xdefault pending --required false

echo "Adding assignedTo..."
appwrite databases create-string-attribute --database-id main --collection-id addons --key assignedTo --size 255 --required false

echo "Adding priority..."
appwrite databases create-enum-attribute --database-id main --collection-id addons --key priority --elements high medium low --xdefault medium --required false

echo "Adding tags..."
appwrite databases create-string-attribute --database-id main --collection-id addons --key tags --size 255 --xdefault "[]" --required false --array true

echo "Adding lastReviewedAt..."
appwrite databases create-datetime-attribute --database-id main --collection-id addons --key lastReviewedAt --required false

echo "Adding reviewCount..."
appwrite databases create-integer-attribute --database-id main --collection-id addons --key reviewCount --min 0 --xdefault 0 --required false

echo "Adding autoApprovalEligible..."
appwrite databases create-boolean-attribute --database-id main --collection-id addons --key autoApprovalEligible --xdefault false --required false

echo "Adding autoApprovalReason..."
appwrite databases create-string-attribute --database-id main --collection-id addons --key autoApprovalReason --size 500 --required false

echo "Adding confidence..."
appwrite databases create-enum-attribute --database-id main --collection-id addons --key confidence --elements high medium low --xdefault low --required false

echo "Adding keywords..."
appwrite databases create-string-attribute --database-id main --collection-id addons --key keywords --size 100 --xdefault "[]" --required false --array true

echo "All fields added successfully!"