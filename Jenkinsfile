pipeline {
    agent any

    environment {
        DOCKER_HUB = "afra1507"        // Docker Hub username
        K8S_NAMESPACE = "default"      // Kubernetes namespace
    }

    stages {

        stage('Start Minikube') {
            steps {
                echo "=== Starting Minikube with specific port mappings ==="
                bat """
                    minikube start ^
                        --ports=127.0.0.1:30080:30080 ^
                        --ports=127.0.0.1:31081:31081 ^
                        --ports=127.0.0.1:31082:31082 ^
                        --ports=127.0.0.1:31083:31083 ^
                        --ports=127.0.0.1:31084:31084
                """
                echo "=== Minikube started successfully! ==="
            }
        }

        stage('Build Backend Services') {
            steps {
                echo "=== Building Backend Services ==="

                dir('Backend/authservice') {
                    echo "Building Auth Service..."
                    bat 'mvn clean package -DskipTests'
                    echo "Building Docker image for Auth Service..."
                    bat "docker build -t %DOCKER_HUB%/authservice:latest ."
                    echo "Pushing Auth Service image to Docker Hub..."
                    bat "docker push %DOCKER_HUB%/authservice:latest"
                }

                dir('Backend/communityservice') {
                    echo "Building Community Service..."
                    bat 'mvn clean package -DskipTests'
                    echo "Building Docker image for Community Service..."
                    bat "docker build -t %DOCKER_HUB%/communityservice:latest ."
                    echo "Pushing Community Service image to Docker Hub..."
                    bat "docker push %DOCKER_HUB%/communityservice:latest"
                }

                dir('Backend/contentservice') {
                    echo "Building Content Service..."
                    bat 'mvn clean package -DskipTests'
                    echo "Building Docker image for Content Service..."
                    bat "docker build -t %DOCKER_HUB%/contentservice:latest ."
                    echo "Pushing Content Service image to Docker Hub..."
                    bat "docker push %DOCKER_HUB%/contentservice:latest"
                }

                dir('Backend/notificationservice') {
                    echo "Building Notification Service..."
                    bat 'mvn clean package -DskipTests'
                    echo "Building Docker image for Notification Service..."
                    bat "docker build -t %DOCKER_HUB%/notificationservice:latest ."
                    echo "Pushing Notification Service image to Docker Hub..."
                    bat "docker push %DOCKER_HUB%/notificationservice:latest"
                }

                echo "=== Backend Services Build Complete ==="
            }
        }

        stage('Build Frontend') {
            steps {
                echo "=== Building Frontend ==="
                dir('Frontend') {
                    echo "Building Docker image for Frontend..."
                    bat "docker build -t %DOCKER_HUB%/frontend:latest ."
                    echo "Pushing Frontend image to Docker Hub..."
                    bat "docker push %DOCKER_HUB%/frontend:latest"
                }
                echo "=== Frontend Build Complete ==="
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo "=== Deploying to Kubernetes ==="

                echo "Creating Gmail secret in Kubernetes..."
                bat """
                    kubectl create secret generic gmail-secret ^
                        --from-literal=username=mathuthiyagar40@gmail.com ^
                        --from-literal=password=lomusncdinabctdn ^
                        --dry-run=client -o yaml | kubectl apply -f -
                """

                echo "Applying Backend Kubernetes manifests..."
                bat 'kubectl apply -f Backend/k8s'

                echo "Applying Frontend Kubernetes manifests..."
                bat 'kubectl apply -f Frontend/k8s'

                echo "=== Deployment Complete ==="
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "=== Verifying Deployment ==="
                bat 'kubectl get pods -o wide'
                bat 'kubectl get svc -o wide'
                echo "=== Verification Complete ==="
            }
        }

    }
}
