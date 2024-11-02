# RentNexis

RentNexis is a SaaS for rental property management designed to simplify the lives of landlords and tenants. This repository contains the backend code for the RentNexis project.

© 2024 Daniel Marques. All rights reserved.

## License

This project is licensed under the terms of the End-User License Agreement (EULA). See the [EULA](./EULA.txt) file for details.

## Setup Instructions

To set up the project locally, follow these steps:

1.  **Clone the repository**

    ```sh
    git clone https://github.com/yourusername/rentnexis-backend.git
    cd rentnexis-backend
    ```

2.  **Install dependencies**

    Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed. Then, install the required dependencies:

    ```sh
    npm install
    ```

3.  **Create necessary configuration files**

    Some configuration files are ignored by git for security reasons. You will need to create them manually.

    - **`src/config/auth.config.js`**

      Create a file at `src/config/auth.config.js` with the following content:

      ```javascript
      module.exports = {
        secret: "rentnexis_secret_key",
        jwtExpiration: 3600, // 1 hour
        jwtRefreshExpiration: 86400, // 24 hours
      };
      ```

4.  **Run the application**

    Start the application using the following command:

    ```sh
    npm start
    ```

5.  **Access the application**

    Open your browser and navigate to `http://localhost:3000`.

If you encounter any issues during the setup, please refer to the project's documentation or raise an issue on the GitHub repository.
