-- 1. Удалить один (любой) объект, значение поля person которого эквивалентно заданному.
CREATE OR REPLACE PROCEDURE remove_worker_by_person(_person_id BIGINT)
       LANGUAGE plpgsql
AS $$
BEGIN
    DELETE worker_delete_pending FROM worker WHERE worker_delete_pending.
-- 2. Вернуть количество объектов, значение поля person которых равно заданному.

-- 3. Вернуть количество объектов, значение поля rating которых меньше заданного.

-- 4. Уволить сотрудника с заданным id из организации.

-- 5. Переместить сотрудника из одной организации в другую с сохранением должности и заработной платы.