pipeline {
    agent any

    environment {
        IMAGE_NAME = 'rubemnascimento81/gym-app'
        
    }

    stages {

        stage('Scan') {
            steps {
                withSonarQubeEnv(installationName: 'server-sonar') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=rubem007_gym-project \
                        -Dsonar.sources=.
                        -Dsonar.host.url=https://sonarcloud.io/ \
                        -Dsonar.login=$jenkins-token
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 2, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        // stage('Build Image') {
        //     steps {
        //         script {
        //             dockerapp = docker.build("${IMAGE_NAME}:${env.BUILD_ID}",
        //                         '-f ./backoffice-api/Dockerfile ./backoffice-api')

        //         }
        //     }
        // }

        // stage('Push Image') {
        //     steps {
        //         script {
                    
        //             docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
        //                 dockerapp.push("${env.BUILD_ID}")
        //                 dockerapp.push('latest')
        //             }
        //         }
        //     }
        // }
    }
}