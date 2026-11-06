# TiA Front End (API Connected)

React-based frontend application for Tangatia.

## Prerequisites

Make sure the following are installed:

| Software | Version       |
| -------- | ------------- |
| Node.js  | 20.x or later |
| npm      | 10.x or later |
| Git      | Latest        |

Check the installed versions:

```bash
node --version
npm --version
git --version
```

## Run Locally

### 1. Get the Project

Clone the repository and enter the project directory:

```bash
git clone <REPOSITORY_URL>
cd <PROJECT_FOLDER>
```

Or open the project folder if it has already been downloaded.

### 2. Install Dependencies

From the project root:

```bash
npm install
```

### 3. Configure Environment Variables

If the project requires environment variables, create a `.env` file in the project root and add the required values.

Example:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Do not commit `.env` or other files containing sensitive credentials.

### 4. Start the Development Server

```bash
npm run dev
```

Open the URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Production Build

To create the production build:

```bash
npm run build
```

The production-ready files will be generated in:

```text
dist/
```

## Deployment

Deploy the **contents of the `dist/` folder** to the production web server or hosting platform.

The deployment should use the generated files inside `dist/` as the web application's root.

### Build and Deploy Flow

```bash
# Install dependencies
npm install

# Create production build
npm run build

# Deploy the contents of dist/
```

> **Note:** Run `npm run build` again whenever you make changes that need to be deployed.
