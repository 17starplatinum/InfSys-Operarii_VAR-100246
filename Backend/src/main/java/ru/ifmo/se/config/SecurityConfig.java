package ru.ifmo.se.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JWTAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/", "/static/**", "/index.html").permitAll()


                        .requestMatchers("/api/address/**").authenticated()
                        .requestMatchers("/api/coordinates/**").authenticated()
                        .requestMatchers("/api/locations/**").authenticated()
                        .requestMatchers("/api/organizations/**").authenticated()
                        .requestMatchers("/api/people/**").authenticated()

                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/ws/worker/**").permitAll()
                        .requestMatchers("/ws/admin/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/worker").permitAll()
                        .requestMatchers("/api/worker/**").authenticated()

                        .requestMatchers("/api/v1/special/**").permitAll()
                        .requestMatchers("/api/v1/special/transfer-worker").authenticated()
                        .requestMatchers("/api/v1/special/remove-worker").authenticated()

                        .requestMatchers("/api/v1/auth/verify-token").authenticated()
                        .requestMatchers("/api/admin-requests/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin-requests/request").hasAuthority("ROLE_USER")

                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("http:localhost:3000");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}