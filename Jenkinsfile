pipeline {
    agent any

    environment {
        DOCKER_HUB = "afra1507"             // Docker Hub username
        K8S_NAMESPACE = "default"           // Kubernetes namespace
        GMAIL_USERNAME = credentials('gmail-secret').username
        GMAIL_PASSWORD = credentials('gmail-secret').password
    }

    stages {

        stage('Build Backend Services') {
            steps {
                // Auth Service
                dir('Backend/authservice') {
                    sh 'mvn clean package -DskipTests'
                    sh "docker build -t ${DOCKER_HUB}/authservice:latest ."
                    sh "docker push ${DOCKER_HUB}/authservice:latest"
                }

                // Community Service
                dir('Backend/communityservice') {
                    sh 'mvn clean package -DskipTests'
                    sh "docker build -t ${DOCKER_HUB}/communityservice:latest ."
                    sh "docker push ${DOCKER_HUB}/communityservice:latest"
                }

                // Content Service
                dir('Backend/contentservice') {
                    sh 'mvn clean package -DskipTests'
                    sh "docker build -t ${DOCKER_HUB}/contentservice:latest ."
                    sh "docker push ${DOCKER_HUB}/contentservice:latest"
                }

                // Notification Service
                dir('Backend/notificationservice') {
                    sh 'mvn clean package -DskipTests'
                    sh "docker build -t ${DOCKER_HUB}/notificationservice:latest ."
                    sh "docker push ${DOCKER_HUB}/notificationservice:latest"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Frontend') {
                    sh "docker build -t ${DOCKER_HUB}/frontend:latest ."
                    sh "docker push ${DOCKER_HUB}/frontend:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Create Gmail secret if it doesn't exist
                    sh """kubectl create secret generic gmail-secret \
                        --from-literal=username=${GMAIL_USERNAME} \
                        --from-literal=password=${GMAIL_PASSWORD} || echo "Secret already exists"
                    """

                    // Apply Kubernetes manifests
                    sh 'kubectl apply -f Backend/k8s'
                    sh 'kubectl apply -f Frontend/k8s'
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get pods -o wide'
                sh 'kubectl get svc -o wide'
            }
        }
    }
}
