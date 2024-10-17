pipeline {
    agent any

    environment {
        IMAGE_NAME = 'rubemnascimento81/gym-app'
    }

    stages {
        stage('Build Image') {
            steps {
                script {
                    dockerapp = docker.build("${IMAGE_NAME}:${env.BUILD_ID}",
                                '-f ./backoffice-api/Dockerfile ./backoffice-api')

                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin https://registry.hub.docker.com"
                    }
                    
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        dockerapp.push("${env.BUILD_ID}")
                        dockerapp.push('latest')
                    }
                }
            }
        }
    }
}