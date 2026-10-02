# WhatsFlow Smart Commerce Platform V2 🚀

> An AI WhatsApp chatbot using RAG for business-tailored replies. Built for high-volume stores and companies, featuring a secure multi-tenant architecture. 

WhatsFlow V2 is a comprehensive, intelligent commerce platform designed to bridge the gap between businesses and their customers on WhatsApp. By leveraging an internally built Retrieval-Augmented Generation (RAG) AI system, it provides highly accurate, context-aware, and business-specific automated responses. 

## ✨ Core Features

*   **🤖 Custom AI-Powered RAG Chatbot:** Delivers customized, context-aware replies using the Gemini API. The RAG architecture is built from scratch, featuring custom tokenization and purely native Cosine Similarity calculations within PostgreSQL.
*   **🏢 Secure Multi-Tenant Architecture:** Complete data isolation for every business onboarded. Each tenant operates in a standalone, secure environment.
*   **👥 Advanced Accounts & Role Management:** A fully featured accounts ecosystem with robust Backend, Frontend, and Admin Panel integrations.
*   **📦 Comprehensive Order Management:** Track, update, and manage customer orders seamlessly from initiation to delivery.
*   **🚚 Dedicated Shipper Workflows:** Specialized tools and interfaces for delivery personnel to update shipping statuses on the go.
*   **📊 Tailored Interfaces:** Distinct, purpose-built UI dashboards for **Owners**, **Managers**, and **Shippers**.

## 🛠 Tech Stack

**Backend & Core:**
*   Python
*   Django (Fullstack setup)
*   Django Ninja (Ninja API) & FastAPI
*   Celery & Redis (Asynchronous task queues & caching)

**Frontend:**
*   HTML5, CSS3, JavaScript
*   Bootstrap

**Database & AI:**
*   PostgreSQL (Serving as both the primary database and the Vector store using native Cosine Similarity matching)
*   Gemini API (LLM generation)
*   Custom-built Tokenizer

**Integrations:**
*   WhatsApp Cloud API

## 🚦 Getting Started

### Prerequisites
*   Python 3.10+
*   PostgreSQL running locally or remotely
*   Redis server (for Celery workers)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/AmirMustafa10/WhatsFlow-Smart-Commerce-Platform-V2.git](https://github.com/AmirMustafa10/WhatsFlow-Smart-Commerce-Platform-V2.git)
   cd WhatsFlow-Smart-Commerce-Platform-V2


### 2. Create and activate a virtual environment:

**Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Install dependencies:
```bash
(Same command for Linux and Windows)
pip install -r requirements.txt
```

### 4. Environment Variables:
```bash
Create a .env file in the root directory and configure your keys. (Do not commit this file to version control):

SECRET_KEY=your_secret_key_here
DEBUG=True
ALLOWED_HOSTS=*

# WhatsApp Cloud API Credentials
WHATSAPP_VERIFY_TOKEN=WhatsFlow_Secure_Token_202_174200517420051742005
WHATSAPP_API_TOKEN=your_whatsapp_api_token_here
WHATSAPP_PHONE_NUMBER_ID=1355613624297087

# AI Credentials
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL Database Configuration
POSTGRES_DB=smart_commerce
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433
```

5. Apply Database Migrations:
**Linux / macOS:**
```bash
python3 manage.py migrate
```

**Windows:**
```bash
python manage.py migrate
```

6. Run the application:
To run the development server:

**Linux / macOS:**
```bash
python3 manage.py runserver
```

**Windows:**
```bash
python manage.py runserver
```

(Note: Ensure your Redis server is running, and start your Celery worker in a separate terminal for background tasks.)
```bash
# Start Celery Worker (Linux/Windows)
celery -A your_project_name worker -l info
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the MIT License.
