# ARDI - AI-Powered Data Exploration Agent

**ARDI** (AI Research & Data Intelligence) is a thesis graduation project from the **UNIBZ Master's in Data Science**, focused on developing an AI Agent to explore data in the news media industry.

This repository contains the **frontend application** that provides an interactive user interface for communicating with the ARDI AI Agent through a backend API.

---

## 🎓 Project Overview

ARDI is designed to help users explore and analyze user segments in the news media industry through natural language conversations. The AI Agent can answer questions about user behavior, segment characteristics, and provide data-driven insights through an intuitive chat interface.

### Key Features

- **💬 Interactive Chat Interface**: Engage with the AI Agent through a conversational interface
- **🧵 Thread Management**: Create, rename, and manage multiple conversation threads
- **👥 User Segment Exploration**: Browse and analyze different user segments
- **📊 Dataset Evaluation**: Monitor and evaluate the AI Agent's performance with detailed metrics
- **🔐 Authentication**: Secure user authentication with JWT tokens
- **📱 Responsive Design**: Modern, user-friendly interface built with Vue.js 3 and PrimeVue

---

## 🏗️ Architecture

This is the **frontend application** that communicates with a separate **backend API** containing the AI Agent logic.

### Technology Stack

- **Framework**: [Vue.js 3](https://vuejs.org/) with Composition API
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Library**: [PrimeVue 3](https://primevue.org/) - Enterprise-grade UI components
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router 4](https://router.vuejs.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: PrimeFlex + Custom SCSS
- **Markdown Rendering**: [Marked](https://marked.js.org/)
- **Data Visualization**: [ECharts](https://echarts.apache.org/)

---

## 📁 Project Structure

```
ARDI-UI/
├── src/
│   ├── assets/          # Styles and static assets
│   ├── boot/            # Application initialization (Axios config)
│   ├── components/      # Reusable Vue components
│   │   ├── FloatingChat.vue
│   │   └── UserSegmentCard.vue
│   ├── layout/          # Application layout components
│   │   ├── AppLayout.vue
│   │   ├── AppTopbar.vue
│   │   ├── AppMenu.vue
│   │   └── ...
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia state management
│   ├── views/           # Page components
│   │   ├── chats.vue              # Main chat interface
│   │   ├── UserSegments.vue       # User segments list
│   │   ├── UserSegmentsDetail.vue # Segment details
│   │   ├── DatasetEvaluation.vue  # AI performance metrics
│   │   ├── users.vue              # User management
│   │   └── pages/                 # Auth pages (login, error, etc.)
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── public/              # Static assets
├── Dockerfile           # Docker configuration
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v20 or higher recommended)
- **npm** or **yarn**
- Access to the ARDI backend API

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ARDI-UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the backend API URL**
   
   Edit `src/boot/axios.js` to point to your backend API:
   ```javascript
   const api = axios.create({
       baseURL: "http://127.0.0.1:8000",  // Update this URL
       timeout: 120000,
       headers: { Accept: 'application/json' }
   });
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

---

## 🐳 Docker Deployment

The application includes a multi-stage Dockerfile for containerized deployment.

### Build the Docker image

```bash
docker build -t ardi-ui .
```

### Run the container

```bash
docker run -p 80:80 ardi-ui
```

The application will be available at `http://localhost`

---

## 🎯 Main Features

### 1. Chat Interface (`/chats`)

The core feature of ARDI - an interactive chat interface where users can:
- Ask questions about user segments in natural language
- View AI-generated responses with markdown formatting
- Access references and data sources used by the AI
- Manage multiple conversation threads
- Rename and delete chat threads

### 2. User Segments (`/userSegments`)

Browse and explore different user segments identified in the news media data:
- View segment cards with key information
- Navigate to detailed segment analysis
- Understand user behavior patterns

### 3. Dataset Evaluation (`/datasetEvaluation`)

Monitor the AI Agent's performance with detailed metrics:
- **Total Requests**: Number of questions processed
- **Overall Match Ratio**: Accuracy of tool selection
- **Average Tools per Request**: Efficiency metrics
- View expected vs. actual tool usage
- Filter evaluations by thread name
- Expandable rows for detailed inspection

### 4. User Management (`/users`)

Administrative interface for managing system users (requires authentication).

---

## 🔐 Authentication

ARDI uses JWT-based authentication:

1. Users log in through `/auth/login`
2. JWT token is stored in `localStorage` as `ardiUserData`
3. Token is automatically attached to all API requests via Axios interceptors
4. Token expiration is validated on route navigation
5. Expired sessions redirect to login page

---

## 🎨 UI Components

### PrimeVue Components Used

- **DataTable**: For displaying evaluation results and user data
- **Dialog**: For modals (rename, delete confirmations)
- **Chip/Tag**: For displaying tools and metrics
- **Toolbar**: For action bars
- **TabView**: For organizing reference data
- **InputText**: For form inputs
- **Button**: For actions

### Custom Components

- **UserSegmentCard**: Displays user segment information in card format
- **FloatingChat**: Floating chat widget component

---

## 📊 Data Flow

1. **User Input** → Chat interface
2. **Frontend** → POST request to `/chat/ask` with question and thread_id
3. **Backend API** → AI Agent processes the question
4. **AI Agent** → Selects appropriate tools and retrieves data
5. **Backend API** → Returns response with answer and references
6. **Frontend** → Displays formatted response with markdown and reference links

---

## 🔧 Configuration

### API Endpoints

The frontend communicates with the following backend endpoints:

- `POST /chat/ask` - Send a question to the AI Agent
- `GET /chat/history/:threadId` - Retrieve chat history
- `POST /chat/newThread` - Create a new conversation thread
- `PUT /chat/thread/:threadId/rename` - Rename a thread
- `DELETE /chat/thread/:threadId` - Delete a thread
- `GET /threads` - Get all user threads
- `GET /UserSegments` - Retrieve user segments
- `GET /dataset_evaluations` - Get evaluation metrics
- `POST /dataset_evaluation` - Run a new evaluation

### Environment Variables

Currently, the API base URL is hardcoded in `src/boot/axios.js`. For production deployments, consider using environment variables:

```javascript
baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
```

---

## 🧪 Development

### Code Style

- Uses Vue 3 Composition API with `<script setup>` syntax
- Component-based architecture
- Reactive state management with `ref()` and `reactive()`
- Async/await for API calls

### Key Files to Understand

1. **`src/boot/axios.js`**: HTTP client configuration with interceptors
2. **`src/router/index.js`**: Route definitions and authentication guards
3. **`src/views/chats.vue`**: Main chat interface logic
4. **`src/layout/AppLayout.vue`**: Application shell layout

---

## 📝 License

This project is part of a thesis graduation project from UNIBZ Master's in Data Science.

---

## 👨‍🎓 Author

**Jose Andres**  
Master's in Data Science - UNIBZ

---

## 🙏 Acknowledgments

- UNIBZ Faculty of Computer Science
- David Massimo for the supervision of this thesis
---

## 📞 Support

For questions or issues related to this thesis project, please contact the project maintainer.
