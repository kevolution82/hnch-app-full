# Use an official OpenJDK image
FROM eclipse-temurin:21-jdk

# Set the working directory
WORKDIR /app

# Copy all project files
COPY . .

# Build the application
RUN ./mvnw clean package -DskipTests

# Run the application
CMD ["java", "-jar", "target/app-0.0.1-SNAPSHOT.jar"]