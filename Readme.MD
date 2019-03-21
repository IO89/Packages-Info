# Package Info App
    Displays names and descriptions of packages from status.real file.
    List all the packages and navigate trough dependencies and reverse dependencies.
## Stack
    App is build with Typescript, for backend Express and Ramda are used,for frontend React and SemanticUI.
    Deployement pipeline is built with TravisCI which automatically pushes to DockerHub and deploy to AWS Beanstalk. 
         
## Demo
   http://packages-env.esn7dakke4.eu-west-1.elasticbeanstalk.com/
## How to install
    From root folder
    Backend: yarn
    Client: cd src/client && yarn
    Typescript compiler: yarn run tsc
## How to run locally with Docker
    From root folder
    To build containers: docker-compose build
    To run containers: docker-compose up
    To exit containers: docker-compose down