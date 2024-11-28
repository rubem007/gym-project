pipeline {
    agent any

    environment {
        IMAGE_NAME = 'rubemnascimento81/gym-app'
        
    }

    stages {

        stage('SonarQube analysis') {
            environment {
                SCANNER_HOME = tool 'SonarQubeScanner';    
            }

        steps {
                
                withSonarQubeEnv('sonar-server') {
                    sh "${SCANNER_HOME}/bin/sonar-scanner"
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

        stage('Scan') {
            steps {
                sh "trivy --no-progress --exit-code 1 --severity HIGH,CRITICAL,MEDIUM ${IMAGE_NAME}:${env.BUILD_ID}"
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