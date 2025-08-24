# Mignum - Digital Services Marketplace

A comprehensive digital services marketplace platform for selling premium accounts and services like gaming accounts, AI services, and more.

## 🚀 Features

### Core Services
- **Gaming Accounts**: Premium accounts for popular games (Clash of Clans, Call of Duty, etc.)
- **AI Services**: ChatGPT Plus, Claude Pro, and other AI platform subscriptions
- **Digital Products**: Various digital services and products
- **User Management**: Secure authentication and user profiles
- **Payment Processing**: Integrated payment gateways
- **Order Management**: Complete order tracking and management

### Technical Features
- **Django Backend**: Robust and scalable backend framework
- **RESTful API**: Clean and documented API endpoints
- **Security**: JWT authentication, CSRF protection, and data encryption
- **Database**: PostgreSQL with optimized queries
- **Caching**: Redis for improved performance
- **Monitoring**: Comprehensive logging and error tracking

## 🏗️ Project Structure

```
mignum/
├── authenticate/     # User authentication and authorization
├── cart/            # Shopping cart functionality
├── common/          # Shared utilities and base classes
├── main/            # Main Django project settings
├── manage.py        # Django management script
└── requirements.txt # Python dependencies
```

## 🛠️ Installation

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- Redis 6+
- Node.js 16+ (for frontend assets)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mignum.git
   cd mignum
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Database setup**
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```

6. **Run development server**
   ```bash
   python manage.py runserver
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mignum

# Redis
REDIS_URL=redis://localhost:6379/0

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Payment Gateway
STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key

# AI Services API Keys
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
```

## 🚀 Deployment

### Docker Deployment

1. **Build the image**
   ```bash
   docker build -t mignum .
   ```

2. **Run with docker-compose**
   ```bash
   docker-compose up -d
   ```

### Production Deployment

1. **Set production environment**
   ```bash
   export DJANGO_SETTINGS_MODULE=main.settings.production
   ```

2. **Collect static files**
   ```bash
   python manage.py collectstatic --noinput
   ```

3. **Run migrations**
   ```bash
   python manage.py migrate
   ```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

### Product Endpoints
- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get product details
- `POST /api/products/` - Create new product (admin only)

### Cart Endpoints
- `GET /api/cart/` - Get user cart
- `POST /api/cart/add/` - Add item to cart
- `DELETE /api/cart/remove/{id}/` - Remove item from cart

### Order Endpoints
- `GET /api/orders/` - List user orders
- `POST /api/orders/create/` - Create new order
- `GET /api/orders/{id}/` - Get order details

## 🧪 Testing

### Run tests
```bash
python manage.py test
```

### Run with coverage
```bash
coverage run --source='.' manage.py test
coverage report
coverage html
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@mignum.com or create an issue in the repository.

## 🔒 Security

If you discover any security-related issues, please email security@mignum.com instead of using the issue tracker.

---

**Mignum** - Your Digital Services Marketplace
