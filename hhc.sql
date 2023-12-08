CREATE TABLE account (
    idacc            INTEGER NOT NULL,
    name             VARCHAR(30) NOT NULL,
    surname          VARCHAR(30) NOT NULL,
    address          VARCHAR(30) NOT NULL,
    email            VARCHAR(50) NOT NULL,
    passwordhash     VARCHAR(200) NOT NULL,
    phonenumber      VARCHAR(20) NOT NULL,
    accverified      CHAR(1) NOT NULL,
    ipaddress_idipa  INTEGER NOT NULL,
    municipality_idm INTEGER NOT NULL,
    role_idr         INTEGER NOT NULL
);

CREATE UNIQUE INDEX account__idx ON
    account (
        ipaddress_idipa
    ASC );

CREATE UNIQUE INDEX account__idxv1 ON
    account (
        municipality_idm
    ASC );

CREATE UNIQUE INDEX account__idxv2 ON
    account (
        role_idr
    ASC );

ALTER TABLE account ADD CONSTRAINT account_pk PRIMARY KEY ( idacc );

CREATE TABLE article (
    ida         INTEGER NOT NULL,
    name        VARCHAR(30) NOT NULL,
    price       DOUBLE NOT NULL,
    description VARCHAR(200) NOT NULL,
    quantity    INTEGER NOT NULL,
    wayofuse    VARCHAR(200) NOT NULL,
    picture_idp INTEGER NOT NULL
);

ALTER TABLE article ADD CONSTRAINT article_pk PRIMARY KEY ( ida );

CREATE TABLE city (
    idcity            VARCHAR(30) NOT NULL,
    postalcode        INTEGER NOT NULL,
    country_idcountry VARCHAR(2) NOT NULL
);

CREATE UNIQUE INDEX city__idx ON
    city (
        country_idcountry
    ASC );

ALTER TABLE city ADD CONSTRAINT city_pk PRIMARY KEY ( idcity );

CREATE TABLE country (
    idcountry VARCHAR(2) NOT NULL
);

ALTER TABLE country ADD CONSTRAINT country_pk PRIMARY KEY ( idcountry );

CREATE TABLE ipaddress (
    idipa     INTEGER NOT NULL,
    ipaddress VARCHAR(30) NOT NULL
);

ALTER TABLE ipaddress ADD CONSTRAINT ipaddress_pk PRIMARY KEY ( idipa );

CREATE TABLE municipality (
    idm         INTEGER NOT NULL,
    postalcodem INTEGER NOT NULL,
    namem       VARCHAR(50) NOT NULL,
    city_idcity VARCHAR(30) NOT NULL
);

CREATE UNIQUE INDEX municipality__idx ON
    municipality (
        city_idcity
    ASC );

ALTER TABLE municipality ADD CONSTRAINT municipality_pk PRIMARY KEY ( idm );

CREATE TABLE Orders (
    ido           INTEGER NOT NULL,
    quantity      INTEGER NOT NULL,
    price         INTEGER NOT NULL,
    totalamount   INTEGER NOT NULL,
    account_idacc INTEGER NOT NULL,
    article_ida   INTEGER NOT NULL
);

ALTER TABLE Orders ADD CONSTRAINT order_pk PRIMARY KEY ( ido );

CREATE TABLE picture (
    idp              INTEGER NOT NULL,
    url              VARCHAR(200) NOT NULL,
    picturetype_idpt INTEGER NOT NULL
);

CREATE UNIQUE INDEX picture__idx ON
    picture (
        picturetype_idpt
    ASC );

ALTER TABLE picture ADD CONSTRAINT picture_pk PRIMARY KEY ( idp );

CREATE TABLE picturetype (
    idpt INTEGER NOT NULL,
    name VARCHAR(20) NOT NULL
);

ALTER TABLE picturetype ADD CONSTRAINT picturetype_pk PRIMARY KEY ( idpt );

CREATE TABLE role (
    idr      INTEGER NOT NULL,
    rolename VARCHAR(20) NOT NULL
);

ALTER TABLE role ADD CONSTRAINT role_pk PRIMARY KEY ( idr );

ALTER TABLE account
    ADD CONSTRAINT account_ipaddress_fk FOREIGN KEY ( ipaddress_idipa )
        REFERENCES ipaddress ( idipa );

ALTER TABLE account
    ADD CONSTRAINT account_municipality_fk FOREIGN KEY ( municipality_idm )
        REFERENCES municipality ( idm );

ALTER TABLE account
    ADD CONSTRAINT account_role_fk FOREIGN KEY ( role_idr )
        REFERENCES role ( idr );

ALTER TABLE article
    ADD CONSTRAINT article_picture_fk FOREIGN KEY ( picture_idp )
        REFERENCES picture ( idp );

ALTER TABLE city
    ADD CONSTRAINT city_country_fk FOREIGN KEY ( country_idcountry )
        REFERENCES country ( idcountry );

ALTER TABLE municipality
    ADD CONSTRAINT municipality_city_fk FOREIGN KEY ( city_idcity )
        REFERENCES city ( idcity );

ALTER TABLE Orders
    ADD CONSTRAINT order_account_fk FOREIGN KEY ( account_idacc )
        REFERENCES account ( idacc );

ALTER TABLE Orders
    ADD CONSTRAINT order_article_fk FOREIGN KEY ( article_ida )
        REFERENCES article ( ida );

ALTER TABLE picture
    ADD CONSTRAINT picture_picturetype_fk FOREIGN KEY ( picturetype_idpt )
        REFERENCES picturetype ( idpt );