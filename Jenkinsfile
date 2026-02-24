pipeline {
    agent any

    environment {
        IMAGE_NAME = "pavanrapolu16/my-k8s-app"
    }

    stages {

        stage('Checkout from GitHub') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/pavanrapolu16/node-k8s-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat """
                docker build -t my-k8s-app:%BUILD_NUMBER% .
                docker tag my-k8s-app:%BUILD_NUMBER% %IMAGE_NAME%:%BUILD_NUMBER%
                """
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'DockerHubCredentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat """
                    docker login -u %DOCKER_USER% -p %DOCKER_PASS%
                    docker push %IMAGE_NAME%:%BUILD_NUMBER%
                    """
                }
            }
        }

        stage('Start Minikube if not running') {
            steps {
                bat """
                minikube status | findstr /C:"Running"
                IF %ERRORLEVEL% NEQ 0 (
                    echo Minikube is not running. Starting now...
                    minikube start --driver=docker --memory=2048 --cpus=2
                )
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                powershell """
                # Replace IMAGE_TAG in deployment.yaml
                (Get-Content k8s/deployment.yaml) `
                -replace 'IMAGE_TAG', '${env:BUILD_NUMBER}' `
                | Set-Content k8s/deployment.yaml
                """

                bat """
                minikube image load %IMAGE_NAME%:%BUILD_NUMBER%
                minikube kubectl -- apply -f k8s/deployment.yaml
                minikube kubectl -- apply -f k8s/service.yaml
                """
            }
        }
    }
}