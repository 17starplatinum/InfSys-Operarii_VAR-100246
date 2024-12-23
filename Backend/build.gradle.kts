plugins {
	java
	id("java-library")
	id("maven-publish")
	id("org.springframework.boot") version "3.3.4"
	id("io.spring.dependency-management") version "1.1.6"
}

group = "ru.ifmo.se"
description = "IS-Lab2"
version = "0.3"
java.sourceCompatibility = JavaVersion.VERSION_17

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

sourceSets {
	main {
		java {
			srcDir("src/main/java")
		}
	}
}

repositories {
	mavenLocal()
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-validation")
	implementation("org.springframework.boot:spring-boot-starter-websocket")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework:spring-orm:6.1.13")
	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")
	implementation("org.hibernate.orm:hibernate-core:6.6.1.Final")
	implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310")
  	implementation("io.minio:minio:8.5.4")
	implementation("com.google.code.findbugs:jsr305:3.0.2")
	implementation("jakarta.persistence:jakarta.persistence-api:3.2.0")
	implementation("jakarta.validation:jakarta.validation-api:3.1.0")
	implementation("io.jsonwebtoken:jjwt-api:0.11.5")
	implementation("io.jsonwebtoken:jjwt-impl:0.11.5")
	implementation("io.jsonwebtoken:jjwt-jackson:0.11.5")
	implementation("io.github.cdimascio:java-dotenv:5.2.2")
	implementation("org.slf4j:slf4j-api:2.0.9")
	implementation("ch.qos.logback:logback-classic:1.4.11")

	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("org.postgresql:postgresql:42.7.4")
	annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
	annotationProcessor("org.projectlombok:lombok")
	testImplementation("com.h2database:h2")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("io.projectreactor:reactor-test")
	testImplementation("org.springframework.security:spring-security-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}
tasks.withType<JavaCompile> {
	options.encoding = "UTF-8"
}
tasks.withType<Test> {
	useJUnitPlatform()
}

