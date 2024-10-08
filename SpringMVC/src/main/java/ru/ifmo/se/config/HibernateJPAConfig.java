package ru.ifmo.se.config;

import org.hibernate.cfg.PersistenceSettings;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.boot.autoconfigure.orm.jpa.JpaBaseConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.JpaProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.orm.jpa.vendor.AbstractJpaVendorAdapter;
import org.springframework.transaction.jta.JtaTransactionManager;

import java.util.HashMap;
import java.util.Map;
import javax.sql.DataSource;

@Configuration
public class HibernateJPAConfig extends JpaBaseConfiguration {
    protected HibernateJPAConfig(DataSource dataSource, JpaProperties properties, ObjectProvider<JtaTransactionManager> manager) {
        super(dataSource, properties, manager);
    }

    @Override
    protected AbstractJpaVendorAdapter createJpaVendorAdapter() {
        return new HibernateJpaVendorAdapter();
    }

//    @Override
//    protected Map<String, Object> getVendorProperties() {
//        HashMap<String, Object> map = new HashMap<>();
//        map.put(PersistenceSettings.);
//        return map;
//    }
}
