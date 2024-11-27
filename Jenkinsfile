pipeline {
    agent any

    environment {
        IMAGE_NAME = 'rubemnascimento81/gym-app'
    }

    stages {
        stage('test') {
            steps {
                sh 'echo "Only Test"'
            }
        }
    }


    // stages {
    //     stage('Build Image') {
    //         steps {
    //             script {
    //                 dockerapp = docker.build("${IMAGE_NAME}:${env.BUILD_ID}",
    //                             '-f ./backoffice-api/Dockerfile ./backoffice-api')

    //             }
    //         }
    //     }

    //     stage('Push Image') {
    //         steps {
    //             script {
                    
    //                 docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
    //                     dockerapp.push("${env.BUILD_ID}")
    //                     dockerapp.push('latest')
    //                 }
    //             }
    //         }
    //     }
    // }
}