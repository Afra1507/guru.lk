# GURU.lk - Multilingual E-Learning Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Kubernetes](https://img.shields.io/badge/Kubernetes-Minikube-blue)
![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-red)

GURU.lk is a full-stack, containerized e-learning platform designed to empower Sri Lankan learners and educators through a modern, inclusive, and accessible online knowledge-sharing system. The platform supports Sinhala, Tamil, and English, helping bridge digital learning gaps across regions.

---

# Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [Local Development](#local-development-without-docker)
  - [Docker Setup](#docker-setup)
  - [Kubernetes Deployment](#kubernetes-deployment-minikube)
- [CI/CD Pipeline](#cicd-pipeline)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Security](#security)
- [Challenges & Solutions](#challenges--solutions)
- [Future Roadmap](#future-roadmap)
- [Contributors](#contributors)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Support](#support)

---

# Overview

The initiative was inspired by the growing demand for digital education in Sri Lanka, particularly after the pandemic-era shift toward e-learning. Existing platforms were either commercial, lacked regional language support, or provided limited accessibility for low-income or rural users.

GURU.lk addresses these issues by providing a free, community-driven, role-based platform optimized for local educational needs.

The system follows a containerized microservices architecture, ensuring modularity, scalability, and independent deployment. Each major function, including authentication, content management, community Q&A, and notifications, is implemented as a separate Spring Boot service and deployed individually inside Docker containers orchestrated through Kubernetes using Minikube.

---

# Key Features

## Role-Based Access Control

### Learners
- Browse and search lessons
- Stream and download educational content
- Ask questions and participate in discussions
- Upvote useful answers

### Contributors
- Create and manage lessons
- Upload videos, documents, and educational resources
- Answer community questions
- Moderate comments on owned content

### Administrators
- Approve or reject uploaded lessons
- Manage users and permissions
- Monitor platform analytics and reports

---

## Multilingual Support

- Full interface localization in Sinhala, Tamil, and English
- Built using react-i18next
- Language preferences stored per user profile

---

## Lesson Management

- Upload video, audio, and text-based lessons
- Categorize lessons by:
  - Subject
  - Grade
  - Language
- Admin moderation workflow for content approval

---

## Community Q&A

- Post questions and answers
- Upvote and downvote responses
- Mark accepted answers
- Reputation tracking system

---

## Offline Learning

- Download educational resources
- Secure signed download URLs
- Offline access support

---

## Notifications

- In-app notifications
- Email notifications using Gmail SMTP integration
- Notifications for approvals, answers, and moderation updates

---

## Modern UI/UX

- Built with React 18 and Material UI
- Responsive design for desktop and mobile
- Accessibility support following WCAG 2.1 AA standards

---

## DevOps & Automation

- Docker containerization
- Kubernetes orchestration using Minikube
- Jenkins CI/CD automation pipeline
- Automated build, push, and deployment workflow

---

# System Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
│                    http://localhost:30080                       │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React + MUI)                       │
│                     Nginx Container :30080                      │
└─────────────────────────────┬───────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Auth Service  │    │Content Service│    │Community Svc  │
│   :31081      │    │   :31083      │    │   :31082      │
│ Spring Boot   │    │ Spring Boot   │    │ Spring Boot   │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │Notification Svc│
                    │    :31084      │
                    │  Spring Boot   │
                    └───────┬────────┘
                            │
                            ▼
                    ┌────────────────┐
                    │    MySQL 8     │
                    │   ClusterIP    │
                    │     :3306      │
                    └────────────────┘
```

---

# Architectural Layers

1. Presentation Layer
   - React 18
   - Material UI
   - Nginx

2. Application Layer
   - Authentication Service
   - Content Service
   - Community Service
   - Notification Service

3. Data Layer
   - MySQL 8
   - Separate schemas per service

4. Infrastructure Layer
   - Docker
   - Kubernetes
   - Minikube
   - Jenkins CI/CD

---

# Technology Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React 18, Material UI, React Router, Axios, React Query, i18next |
| Backend | Spring Boot 3, Java 21, Spring Security, JWT, Hibernate |
| Database | MySQL 8 |
| DevOps | Docker, Kubernetes, Minikube, Jenkins |
| Build Tools | Maven, NPM, Vite |
| Testing | JUnit, Cypress, Postman, Lighthouse, JMeter |
| Security | JWT, BCrypt, Kubernetes Secrets, Trivy |
| Version Control | GitHub |

---

# Project Structure

```text
guru.lk/
├── Backend/
│   ├── authservice/
│   │   ├── src/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── communityservice/
│   │   ├── src/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── contentservice/
│   │   ├── src/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   ├── notificationservice/
│   │   ├── src/
│   │   ├── pom.xml
│   │   └── Dockerfile
│   │
│   └── k8s/
│       ├── mysql-pv.yaml
│       ├── mysql-deployment.yaml
│       ├── auth-deployment.yaml
│       ├── community-deployment.yaml
│       ├── content-deployment.yaml
│       └── notification-deployment.yaml
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── i18n/
│   │   └── services/
│   │
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── Jenkinsfile
└── README.md
```

---

# Prerequisites

Before running the project, ensure the following tools are installed:

- Windows 11 / Linux / macOS
- Docker Desktop
- Minikube v1.33+
- kubectl
- Java 21
- Maven 3.8+
- Node.js 18+
- npm
- Jenkins

Recommended system requirements:

- 4 CPU cores
- 8 GB RAM
- 20 GB free storage

---

# Installation & Setup

# Local Development (Without Docker)

## Backend Setup

```bash
# Clone repository
git clone https://github.com/your-repo/guru.lk.git

cd guru.lk/Backend/authservice

# Build project
mvn clean package -DskipTests

# Run service
java -jar target/*.jar
```

Repeat the same process for:
- communityservice
- contentservice
- notificationservice

---

## Frontend Setup

```bash
cd Frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# Docker Setup

## Build Backend Services

```bash
cd Backend/authservice

docker build -t afra1507/authservice:latest .

docker run -p 31081:8081 afra1507/authservice:latest
```

Repeat for all backend services.

---

## Build Frontend

```bash
cd Frontend

docker build -t afra1507/frontend:latest .

docker run -p 30080:80 afra1507/frontend:latest
```

---

# Kubernetes Deployment (Minikube)

## Step 1: Clean Existing Cluster

```bash
docker rm -f minikube

minikube delete
```

---

## Step 2: Start Minikube

```bash
minikube start --ports=127.0.0.1:30080:30080 ^
    --ports=127.0.0.1:31081:31081 ^
    --ports=127.0.0.1:31082:31082 ^
    --ports=127.0.0.1:31083:31083 ^
    --ports=127.0.0.1:31084:31084
```

---

## Step 3: Verify Cluster Status

```bash
minikube status

kubectl get nodes
```

---

## Step 4: Deploy MySQL

```bash
kubectl apply -f Backend/k8s/mysql-pv.yaml

kubectl apply -f Backend/k8s/mysql-deployment.yaml
```

Verify pods:

```bash
kubectl get pods
```

---

## Step 5: Create Databases

```bash
kubectl exec -it mysql-<pod-id> -- bash

mysql -u root -p
```

```sql
CREATE DATABASE guru_authdb;
CREATE DATABASE guru_contentdb;
CREATE DATABASE guru_communitydb;
CREATE DATABASE guru_notificationdb;
```

---

## Step 6: Create Gmail Secret

```bash
kubectl create secret generic gmail-secret \
    --from-literal=username=your-email@gmail.com \
    --from-literal=password=your-app-password \
    --dry-run=client -o yaml | kubectl apply -f -
```

---

## Step 7: Deploy Backend Services

```bash
kubectl apply -f Backend/k8s

kubectl get pods -w
```

---

## Step 8: Deploy Frontend

```bash
kubectl apply -f Frontend/k8s
```

---

## Step 9: Access Application

```text
http://localhost:30080
```

---

# CI/CD Pipeline

The Jenkins pipeline automates:

- Building services
- Creating Docker images
- Pushing images to Docker Hub
- Deploying to Kubernetes
- Deployment verification

---

## Pipeline Stages

1. Start Minikube
2. Build Backend Services
3. Build Frontend
4. Push Docker Images
5. Deploy to Kubernetes
6. Verify Deployment

---

## Jenkinsfile Example

```groovy
pipeline {
    agent any

    triggers {
        githubPush()
    }

    options {
        disableConcurrentBuilds()
    }

    environment {
        DOCKER_HUB = "afra1507"
        K8S_NAMESPACE = "default"
    }

    stages {

        stage('Build Backend Services') {
            steps {
                bat 'mvn clean package'
            }
        }

        stage('Build Frontend') {
            steps {
                bat 'npm install && npm run build'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f Backend/k8s'
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get pods'
            }
        }
    }
}
```

---

# API Endpoints

## Authentication Service

Base URL:

```text
http://localhost:31081
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register user |
| POST | /auth/login | Authenticate and receive JWT |
| POST | /auth/refresh | Refresh access token |

---

## Content Service

Base URL:

```text
http://localhost:31083
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /lessons | Get all lessons |
| POST | /lessons | Upload lesson |
| PUT | /lessons/{id}/approve | Approve lesson |
| GET | /lessons/{id}/download | Download lesson |

---

## Community Service

Base URL:

```text
http://localhost:31082
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /questions | Get all questions |
| POST | /questions | Create question |
| POST | /questions/{id}/answers | Submit answer |
| POST | /answers/{id}/vote | Vote on answer |

---

## Notification Service

Base URL:

```text
http://localhost:31084
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notifications | Get notifications |

---

# Environment Variables

## Frontend Variables

```env
REACT_APP_AUTH_BASE_URL=http://localhost:31081
REACT_APP_CONTENT_BASE_URL=http://localhost:31083
REACT_APP_COMMUNITY_BASE_URL=http://localhost:31082
REACT_APP_NOTIFICATION_BASE_URL=http://localhost:31084
```

---

## Backend Variables

```yaml
spring:
  datasource:
    url: jdbc:mysql://mysql-service:3306/guru_authdb
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

  jpa:
    hibernate:
      ddl-auto: update

jwt:
  secret: ${JWT_SECRET}
  expiration: 3600000
```

---

## Kubernetes Secrets

```bash
kubectl create secret generic gmail-secret \
    --from-literal=username=your-email@gmail.com \
    --from-literal=password=your-app-password

kubectl create secret generic mysql-secret \
    --from-literal=root-password=your-password
```

---

# Testing

## Backend Testing

```bash
cd Backend/authservice

mvn test
```

---

## Frontend Testing

```bash
cd Frontend

npm run test

npm run test:e2e

npm run test:lighthouse
```

---

## Load Testing

```bash
jmeter -n -t guru_load_test.jmx -l results.jtl
```

---

# Security

## Implemented Security Measures

- JWT authentication
- Refresh token support
- Role-based access control
- BCrypt password hashing
- Kubernetes Secrets
- SQL injection prevention using JPA
- Trivy vulnerability scanning
- Internal ClusterIP database networking

---

## Security Verification

```bash
trivy image afra1507/authservice:latest
```

Check Kubernetes secrets:

```bash
kubectl describe secret gmail-secret
```

---

# Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| CORS errors | Enabled global CORS configuration |
| Jenkins on Windows | Replaced shell commands with bat |
| Minikube networking issues | Used explicit port mappings |
| Gmail SMTP authentication | Used App Passwords |
| Docker image bloat | Added cleanup stages |
| Localization issues | Refactored i18n structure |
| UI performance issues | Optimized Material UI asset loading |

---

# Future Roadmap

- Cloud deployment using AWS or GCP
- HTTPS support with TLS certificates
- AI-based lesson recommendations
- Native mobile applications
- Gamification system
- Analytics dashboard
- Premium subscription support
- Real-time virtual classrooms

---

# Contributors

## Afra Banu ZH

- Full-Stack Developer
- DevOps Engineer
- CSC 313 – Service Oriented Computing
- AS2022468

---

# License

This project was developed for educational purposes as part of the CSC 313 – Service Oriented Computing course.

---

# Acknowledgments

- Sri Lankan educators and learners
- Open-source contributors
- University supervisors and mentors

---

# Support

Email:

```text
mathuthiyagar40@gmail.com
```

GitHub Issues:

```text
https://github.com/your-repo/guru.lk/issues
```

---

# Built for Sri Lankan Education
