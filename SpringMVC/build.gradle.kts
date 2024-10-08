plugins {
	java
	id("java-library")
	id("maven-publish")
	id("org.springframework.boot") version "3.3.4"
	id("io.spring.dependency-management") version "1.1.6"
}

group = "ru.ifmo.se"
version = "0.0.1-SNAPSHOT"
description = "IS-Lab1"
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
	implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-data-r2dbc")
	implementation("org.springframework.boot:spring-boot-starter-data-rest")
	implementation("org.springframework.boot:spring-boot-starter-hateoas")
	implementation("org.springframework.boot:spring-boot-starter-security")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-web-services")
	implementation("org.springframework.boot:spring-boot-starter-webflux")
	implementation("jakarta.persistence:jakarta.persistence-api:3.2.0")
	implementation("jakarta.validation:jakarta.validation-api:3.1.0")
	implementation("io.jsonwebtoken:jjwt-api:0.12.6")
	implementation("io.jsonwebtoken:jjwt-impl:0.12.6")
	implementation("io.jsonwebtoken:jjwt-jackson:0.12.6")
	implementation("org.hibernate.orm:hibernate-core:6.6.1.Final")
	compileOnly("org.projectlombok:lombok")
	developmentOnly("org.springframework.boot:spring-boot-devtools")
	runtimeOnly("org.postgresql:postgresql")
	runtimeOnly("org.postgresql:r2dbc-postgresql")
	annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
	annotationProcessor("org.projectlombok:lombok")
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
