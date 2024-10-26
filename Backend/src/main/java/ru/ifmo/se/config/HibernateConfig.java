package ru.ifmo.se.config;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.hibernate.boot.registry.StandardServiceRegistryBuilder;
import ru.ifmo.se.entity.*;

public class HibernateConfig {
    private static SessionFactory sessionFactory;

    static {
        try {
            Configuration configuration = new Configuration()
                    .addAnnotatedClass(Worker.class)
                    .addAnnotatedClass(Address.class)
                    .addAnnotatedClass(Coordinates.class)
                    .addAnnotatedClass(Location.class)
                    .addAnnotatedClass(Organization.class)
                    .addAnnotatedClass(Person.class)
                    .addAnnotatedClass(User.class)
                    .setProperty("hibernate.dialect", "org.hibernate.dialect.PostgreSQL10Dialect")
                    .setProperty("hibernate.connection.driver_class", "org.postgresql.Driver")
                    .setProperty("hibernate.connection.url", "jdbc:postgresql://localhost:5432/studs")
                    .setProperty("hibernate.connection.username", "s372799")
                    .setProperty("hibernate.connection.password", "xwVxXqHACMOxPOqS")
                    .setProperty("hibernate.show_sql", "true")
                    .setProperty("hibernate.format_sql", "true")
                    .setProperty("hbm2ddl", "update");
            sessionFactory = configuration.buildSessionFactory(new StandardServiceRegistryBuilder().applySettings(configuration.getProperties()).build());
        } catch (Throwable ex) {
            throw new ExceptionInInitializerError(ex);
        }
    }

    public static Session createSession() {
        return sessionFactory.openSession();
    }
}
