pipeline {
    agent any
    environment {
        // user= en credenciales de jenkins
        // password = en credenciales de jenkins
        host='localhost'
        database = 'reserva'
        port = 5432
        registry = 'backend_cont_test'
    }

    stages {
        stage('Clone repo') {
            steps {
                git 'https://github.com/jkauze/backend'
            }
        }
        stage('Building') {
            steps {
                sh 'echo Backend no amerita compilacion' //Este paso no es necesario para el backend
            }
        }
        stage('Tests Result') {
            steps {
                script {
                    def dockerfile = './Dockerfile'
                    def dockerImage = docker.build("${registry}:${env.BUILD_ID}", "-f ${dockerfile} .")
                    // Connect to docker cont and run tests
                    try {
                        withCredentials([usernamePassword(credentialsId: 'user_pass_postgres', passwordVariable: 'password', usernameVariable: 'user')]) {
                            dockerImage.inside("--network host") {
                                sh 'npm run test'
                            }
                        }
                    } finally {
                        // Removing the docker image
                        sh "docker rmi $registry:$BUILD_NUMBER"
                    }
                }

            }
        }
        stage('deploy') {
            steps {
                sh 'echo ChangeServer'
            }
        }
    }
    post {
        always {
            script {
                if (currentBuild.currentResult == 'FAILURE') {
                    // Send an email only if the build status has changed from green/unstable to red
                    emailext subject: ' $DEFAULT_SUBJECT',
                        body: '$DEFAULT_CONTENT',
                        recipientProviders: [
                            [$class: 'DevelopersRecipientProvider'],
                            [$class: 'RequesterRecipientProvider']
                        ],
                        replyTo: '$DEFAULT_REPLYTO',
                        to: '$DEFAULT_RECIPIENTS'
                }
            }
        }
    }
}