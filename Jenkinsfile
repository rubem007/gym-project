pipeline {
    agent any

    stages {
        stage('Build Image') {
            steps {
                script {
                    dockerapp = docker.build("rubemnascimento81/gym-app:${env.BUILD_ID}",
                                '-f ./backoffice-api/Dockerfile .')

                }
            }
        }

        stage('Push Image') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        docker.push('latest')
                        docker.push("${env.BUILD_ID}")
                    }
                    

                }
            }
        }
    }
}