pipeline {

    agent any

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning GitHub repository...'

                git branch: 'main',
                    url: 'https://github.com/Pranavi7542/edu-analytics-platform-.git'
            }
        }

        stage('Docker Build') {
            steps {
                echo 'Building Docker images...'

                sh 'docker compose build'
            }
        }

        stage('Docker Run') {
            steps {
                echo 'Starting application containers...'

                sh 'docker compose up -d'
            }
        }
    }

    post {

        success {
            echo '================================='
            echo 'BUILD AND DEPLOYMENT SUCCESSFUL'
            echo '================================='
        }

        failure {
            echo '================================='
            echo 'BUILD OR DEPLOYMENT FAILED'
            echo '================================='
        }
    }
}