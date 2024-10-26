package ru.ifmo.se;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import javax.crypto.SecretKey;
import java.util.Base64;

@SpringBootApplication
public class OperariiApplication {

	public static void main(String[] args) {
		SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
		String base64key = Base64.getEncoder().encodeToString(key.getEncoded());
		System.setProperty("JWT_SECRET_KEY", base64key);
		System.out.println("Generated key: " + base64key);
		SpringApplication.run(OperariiApplication.class, args);
	}

}
