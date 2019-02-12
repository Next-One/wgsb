drop function if exists addCart;
CREATE FUNCTION addCart(uid varchar(255),did int,nums int)
returns int
BEGIN
	DECLARE numb int DEFAULT 0;
	SELECT count(*) INTO numb FROM cart WHERE openid=uid AND dishid=did;
	IF numb=0 THEN
		INSERT INTO cart(openid, dishid,quantity) values(uid,did,nums);
	ELSE
		UPDATE cart SET quantity=quantity+nums WHERE openid=uid AND dishid=did;
	END IF;
	return numb;
END;