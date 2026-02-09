# Study Boosters - Java Backend

Java Spring Boot backend with Firebase integration for Study Boosters application.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Firebase Project with Realtime Database

## Firebase Setup

### Get Firebase Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `study-boosters` project
3. Click the gear icon ⚙️ → **Project settings**
4. Navigate to **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file
7. Rename it to `firebase-service-account.json`
8. Place it in `src/main/resources/`

### Update Configuration

Edit `src/main/resources/application.properties`:
- Update `firebase.database.url` with your Firebase database URL
- Update `jwt.secret` with a strong secret key (in production)

## Running the Application

```bash
# Clean and install dependencies
./mvnw clean install

# Run the application
./mvnw spring-boot:run
```

The server will start on `http://localhost:8080`

## API Documentation

Once running, access Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with roll number
- `GET /api/auth/me` - Get current user
- `POST /api/auth/promote-admin` - Promote to admin

### Files
- `GET /api/files` - Get all files
- `POST /api/files/upload` - Upload file
- `POST /api/files/{id}/approve` - Approve file (admin)
- `DELETE /api/files/{id}` - Delete file (admin)
- `POST /api/files/{id}/download` - Download file

### Subjects
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Add subject (admin)
- `DELETE /api/subjects/{id}` - Delete subject (admin)

### Doubts
- `GET /api/doubts` - Get all doubts
- `POST /api/doubts` - Submit doubt

### Mentors
- `GET /api/mentors/requests` - Get mentor requests
- `POST /api/mentors/requests` - Submit mentor request
- `PUT /api/mentors/requests/{id}/approve` - Approve (admin)
- `PUT /api/mentors/requests/{id}/reject` - Reject (admin)

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings (admin)

### Logs
- `GET /api/logs` - Get activity logs (admin)

## Testing

```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"rollNumber":"2520090137"}'

# Use the token from response for authenticated requests
curl -X GET http://localhost:8080/api/files \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
src/main/java/com/studyboosters/
├── config/          - Configuration classes
├── controller/      - REST controllers
├── dto/             - Data Transfer Objects
├── exception/       - Exception handlers
├── model/           - Domain models
├── security/        - JWT security
└── service/         - Business logic
```
