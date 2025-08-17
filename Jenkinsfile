pipeline {
    agent any

    environment {
        DOCKER_HUB = "afra1507"             // Docker Hub username
        K8S_NAMESPACE = "default"           // Kubernetes namespace
    }

    stages {

        stage('Build Backend Services') {
            steps {
                // Auth Service
                dir('Backend/authservice') {
                    bat 'mvn clean package -DskipTests'
                    bat "docker build -t %DOCKER_HUB%/authservice:latest ."
                    bat "docker push %DOCKER_HUB%/authservice:latest"
                }

                // Community Service
                dir('Backend/communityservice') {
                    bat 'mvn clean package -DskipTests'
                    bat "docker build -t %DOCKER_HUB%/communityservice:latest ."
                    bat "docker push %DOCKER_HUB%/communityservice:latest"
                }

                // Content Service
                dir('Backend/contentservice') {
                    bat 'mvn clean package -DskipTests'
                    bat "docker build -t %DOCKER_HUB%/contentservice:latest ."
                    bat "docker push %DOCKER_HUB%/contentservice:latest"
                }

                // Notification Service
                dir('Backend/notificationservice') {
                    bat 'mvn clean package -DskipTests'
                    bat "docker build -t %DOCKER_HUB%/notificationservice:latest ."
                    bat "docker push %DOCKER_HUB%/notificationservice:latest"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Frontend') {
                    bat "docker build -t %DOCKER_HUB%/frontend:latest ."
                    bat "docker push %DOCKER_HUB%/frontend:latest"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Fetch Gmail credentials from Jenkins
                    def gmailCreds = credentials('gmail-secret')
                    def gmailUsername = gmailCreds.username
                    def gmailPassword = gmailCreds.password

                    // Create Gmail secret if it doesn't exist
                    bat """
                        kubectl create secret generic gmail-secret ^
                            --from-literal=username=${gmailUsername} ^
                            --from-literal=password=${gmailPassword} || echo Secret already exists
                    """

                    // Apply Kubernetes manifests
                    bat 'kubectl apply -f Backend/k8s'
                    bat 'kubectl apply -f Frontend/k8s'
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                bat 'kubectl get pods -o wide'
                bat 'kubectl get svc -o wide'
            }
        }
    }
}
