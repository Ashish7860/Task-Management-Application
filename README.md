
##Kubernetes Assignment: Task Management System

This guide details the steps to containerize, deploy, and scale a Task Management System using Kubernetes.


Prerequisites

- Docker installed
- Kubernetes installed (Minikube)
- kubectl command-line tool


##Steps to Build and Deploy the Application


1. Build Docker Image

Build the Docker image from the Dockerfile.

bash
docker build -t ashish07860/task-management-system:1.0 .



2. Push Docker Image to Docker Hub

Push the image to your Docker Hub repository.

bash
docker push ashish07860/task-management-system:1.0



3. Run Docker Container and Start Minikube

Run the Docker container locally and start Minikube.

bash
docker run -d -p 8080:80 ashish07860/task-management-system:1.0

minikube start



4. Create Kubernetes Deployment YAML

5. Create Kubernetes Service YAML

6. Dockerfile take it from the code

7. Deploy the Application

Use kubectl to deploy the application and expose it.

bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml



8. Launch Minikube Tunnel

Open a new terminal and run Minikube tunnel.

bash
minikube tunnel



9. Get Services and Deployment Information

Check the status of services and deployments.

bash
kubectl get services
kubectl get deployment



10. Scale the Application

Scale the application by increasing the number of replicas.

bash
kubectl scale deployment task-management-system-deployment --replicas=5
kubectl get pods



11. Access the Application

Fetch the external IP address to access the application.

bash
kubectl get services



Conclusion

This README guides you through building, deploying, and scaling a Task Management System using Kubernetes.


Technologies Used

- Docker for containerization
- Minikube for local Kubernetes environment
- kubectl for command-line interactions