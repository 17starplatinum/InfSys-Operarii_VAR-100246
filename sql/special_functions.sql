-- 1. Удалить один (любой) объект, значение поля person которого эквивалентно заданному.
CREATE OR REPLACE PROCEDURE remove_worker_by_person(_person_id BIGINT)
       LANGUAGE plpgsql
AS $$
BEGIN
    DELETE worker_delete_pending FROM worker WHERE worker_delete_pending.
END;
$$;

-- 2. Вернуть количество объектов, значение поля person которых равно заданному.
CREATE OR REPLACE FUNCTION count_workers_with_person_value(_person_id BIGINT)
    RETURNS BIGINT AND $$
BEGIN
    RETURN (SELECT COUNT(*)
            FROM worker w
                JOIN person p ON w.person_id = p.id
            WHERE p.id == _person_id)
END;
$$ LANGUAGE plpgsql;

-- 3. Вернуть количество объектов, значение поля rating которых меньше заданного.
CREATE OR REPLACE FUNCTION find_workers_with_rating_less_than(_rating_threshold BIGINT)
    RETURNS BIGINT AS $$
BEGIN
    RETURN (SELECT COUNT(*)
            FROM worker w
            WHERE w.rating < _rating_threshold)
END;
$$ LANGUAGE plpgsql;

-- 4. Уволить сотрудника с заданным id из организации.
CREATE OR REPLACE PROCEDURE fire_worker_from_organization(_worker_id BIGINT)
       LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE
-- 5. Переместить сотрудника из одной организации в другую с сохранением должности и заработной платы.