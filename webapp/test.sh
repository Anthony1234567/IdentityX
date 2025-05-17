#!/bin/bash

# --- CONFIG ---
BASE_URL="http://localhost:5001"
EMAIL="1234567anthony1234567"
PASSWORD="password123"

# --- LOGIN ---
echo "🔐 Logging in as $EMAIL..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"emailOrUsername\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [[ "$TOKEN" == "null" || -z "$TOKEN" ]]; then
  echo "❌ Login failed. Response:"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful. Token acquired."

# --- GET CONNECTIONS ---
echo ""
echo "📡 Fetching connections..."
CONNECTIONS=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/connections")

if [[ -z "$CONNECTIONS" || "$CONNECTIONS" == "null" ]]; then
  echo "❌ Failed to retrieve connections."
  exit 1
fi

CONNECTION_IDS=$(echo "$CONNECTIONS" | jq -r '.[]._id')

if [[ -z "$CONNECTION_IDS" ]]; then
  echo "⚠️  No connections found."
  exit 0
fi

echo "✅ Retrieved $(echo "$CONNECTION_IDS" | wc -l) connection(s)."

# --- GET EVENTS FOR EACH CONNECTION ---
for ID in $CONNECTION_IDS; do
  echo ""
  echo "📂 Events for Connection ID: $ID"
  curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/events/$ID" | jq .
done

# --- GET SUMMARY AGGREGATION ---
echo ""
echo "📊 Fetching 30d event summary..."
SUMMARY=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/events/summary/30d")
echo "$SUMMARY" | jq .