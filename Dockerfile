# Use Eclipse Temurin Java 17 as base image
FROM eclipse-temurin:17-jdk-alpine

# Set workdir
WORKDIR /app

# Copy Maven pom.xml and download dependencies first (for caching)
COPY pom.xml .
RUN apk add --no-cache maven
RUN mvn dependency:go-offline

# Copy all source code
COPY src ./src

# Package the application
RUN mvn clean package -DskipTests

# Set the jar name
ARG JAR_FILE=target/farm-marketplace-0.0.1-SNAPSHOT.jar

# Copy jar to final image
COPY ${JAR_FILE} app.jar

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java","-jar","/app/app.jar"]
