# OmniAdmin E-Commerce Dashboard (GVRADMIN)

OmniAdmin is a modern, responsive, and feature-rich React-based admin dashboard designed to manage e-commerce operations seamlessly. It provides a centralized interface for store owners and administrators to handle products, orders, categories, deliveries, and discounts. 

## 🚀 Features

- **Dashboard Overview**: Get high-level statistics and insights into your e-commerce platform.
- **Product Management**: Complete CRUD operations for products. Add new products, update existing ones, toggle active/inactive status, and connect to your backend inventory.
- **Order Tracking**: Comprehensive view of customer orders. Track purchases from placement to delivery.
- **Delivery Management**: Monitor and update shipping and delivery statuses.
- **Discount & Coupons**: Manage promotional codes, sales, and discounts effectively.
- **Dynamic Categories**: Add, remove, and manage product categories seamlessly.
- **Responsive Design**: Built with modern UI practices, ensuring a smooth experience across devices.
- **Sidebar Navigation**: Intuitive layout with easy access to all administrative modules.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) powered by [Vite](https://vitejs.dev/) for fast development and building.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first, responsive design.
- **Icons**: [Lucide React](https://lucide.dev/) for clean and consistent iconography.
- **Charts**: [Recharts](https://recharts.org/) for data visualization and analytics.
- **API**: Standard `fetch` API connecting to a local Node.js/Express backend.

## 📦 Getting Started

### Prerequisites

- Node.js installed on your machine.
- The corresponding e-commerce backend must be running locally (usually on `http://localhost:5000`) for data fetching features like Products and Orders to work.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate into the project directory:
   ```bash
   cd omniadmin-e-commerce-dashboard
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

4. Configure Environment Variables (if needed):
   - Check `.env.local` for any required keys (e.g., specific API configurations). By default, the app expects the backend API at `http://localhost:5000`.

### Running the Application

To start the development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).

### Building for Production

To create a production build, run:

```bash
npm run build
```

You can preview the production build using:

```bash
npm run preview
```

## 📂 Project Structure

- `src/components/`: Contains all the modular UI components (e.g., `Dashboard.jsx`, `Products.jsx`, `Orders.jsx`, `Sidebar.jsx`, etc.).
- `src/App.jsx`: The main layout and routing hub that manages state for the dashboard and renders the active views.
- `index.html`: The main HTML template.
- `vite.config.js`: Vite configuration file.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is open-source and available under the MIT License.
