### Lessons

###### 1. Biggest problem with creating microservices is management of data

###### 2. Good way would be async communicaton (have a request, persist some data to a particular service, then emit an event to the event-bus, then have the event-bus emit that event to other services and let those other services handle those events and make changes individually)

###### 3. Each service is independent of other services -> allows better handling of new service creation and handling downtime of certain services

###### 4. Docker is great to create images to make containers for each particular service and if a service needs to scale docker can create another instance of that image to house that microservice -> great for microservice integration

###### 5. Kubernetes is great to handle multiple services / deploy services. Can create clusters containing Nodes which are essentially virtual machines to house pods which are used to hold one or more containers, create deployments which manage 1 or more pods and Cluster IP Services to allow one pod to effectively communicate with another pod. Can set up Load Balancer Service and route traffic to specific pods. Although kubernetes takes a lot of time to get the initial setup

###### 6. if using Skaffold make sure to use a hot reloader for files e.g nodemon, webpack, etc. else when make a change to a file will not be able to see the difference right away even though the change is made to the container inside the pod.
