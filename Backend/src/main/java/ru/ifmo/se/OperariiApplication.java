package ru.ifmo.se;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;

import javax.crypto.SecretKey;
import java.util.Base64;

@SpringBootApplication(exclude = HibernateJpaAutoConfiguration.class)
public class OperariiApplication {

	public static void main(String[] args) {
		SpringApplication.run(OperariiApplication.class, args);
	}

}
