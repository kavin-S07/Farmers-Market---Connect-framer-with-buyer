# ---------- Stage 1: Build ----------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy only pom.xml first (for caching dependencies)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# ---------- Stage 2: Run ----------
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Create uploads directory (for your file upload feature)
RUN mkdir -p /app/uploads

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Set environment variables (optional defaults)
ENV JAVA_OPTS=""

# Expose port
EXPOSE 8080

# Run app with optimized settings
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]