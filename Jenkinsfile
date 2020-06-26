pipeline {
    agent any
    environment {
        // password = ya esta dado como credecial al momento de ejecutar el stage test
        host='localhost'
        // user= ya esta dado como credecial al momento de ejecutar el stage test
        database = 'reserva'
        port = 5432
    }

    stages {
        stage('Clone repo') {
            steps {
                git 'https://github.com/jkauze/backend'
            }
        }
        stage('Install Deps') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test Result') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'user_pass_postgres', passwordVariable: 'password', usernameVariable: 'user')]) {
                    sh 'npm run test'
                }
            }
        }
        stage('deploy') {
            steps {
                sh 'echo deploy!!!'
            }
        }
    }
    post {
        always {
            script {
                if (currentBuild.currentResult == 'FAILURE') { // Other values: SUCCESS, UNSTABLE
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