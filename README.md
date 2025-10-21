# String Analyzer Service

A RESTful API service that analyzes strings and stores their computed properties.

## Features

- Analyze string properties (length, palindrome check, unique characters, word count, etc.)
- Store and retrieve analyzed strings
- Filter strings by various criteria
- Natural language query support
- Persistent data storage

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm

## ⚙️ Tech Stack

- Node.js + Express.js
- File-based storage (`/database/strings.json`)
- Crypto for SHA-256 hashing
