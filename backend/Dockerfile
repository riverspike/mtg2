# Stage 1 — build
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build

# Cache dependencies before copying source so they aren't re-downloaded on every code change
COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn package -q -DskipTests

# Stage 2 — runtime (JRE only, no JDK or Maven)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /build/target/mtgcards-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
