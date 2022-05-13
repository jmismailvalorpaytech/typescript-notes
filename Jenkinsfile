/* groovylint-disable-next-line CompileStatic */
pipeline {
    agent any
    tools { nodejs 'NodeJs' }
    stages {
        stage('Test Npm') {
            agent { label 'Fedora' }
            steps {
                sh '''
                    npm --version
                '''
            }
        }
        stage('Build') {
            /* groovylint-disable-next-line DuplicateStringLiteral */
            agent { label 'Fedora' }
            steps {
                sh '''
                   npm install
                   npm run build
                   cd client/
                   npm install --force
                   npm run build
                '''
            }
        }
        stage('Deploy') {
            steps {
                sh 'sudo rm -rf /var/www/ts-notes-app'
                sh "cd ${WORKSPACE} && ls"
                sh "sudo cp -r ${WORKSPACE}/client/dist/ /var/www/ts-notes-app"
                // sh "sudo cp -r ${WORKSPACE}/ /home/jmismail/" // Copy all
                sh "cd ${WORKSPACE}/ && ls"
                // sh 'sudo cp -r !(client) /home/jmismail/'
                sh "sudo rsync -av --progress --exclude='client' ${WORKSPACE}/ /home/jmismail/ts-notes-app"
            }
        }
    }
}
