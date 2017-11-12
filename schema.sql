CREATE TABLE IF NOT EXISTS jobs
(
 job_id INT PRIMARY KEY NOT NULL ,
 start_address TEXT NOT NULL ,
 end_address   TEXT NOT NULL ,
 start_time    DATETIME NOT NULL ,
 end_time      DATETIME NOT NULL ,
 max_price     INT NOT NULL ,
 description   TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS movers
(
 mover_id      INT PRIMARY KEY NOT NULL ,
 first_name    VARCHAR(50) NOT NULL ,
 last_name     VARCHAR(50) NOT NULL ,
 email         TEXT NOT NULL ,
 password      VARCHAR(50) NOT NULL ,
 zip_code      INT(5) NOT NULL ,
 vehicle       TEXT NOT NULL ,
 phone         VARCHAR(50) NOT NULL ,
 payment_types VARCHAR(50) NOT NULL ,
 profile_photo BLOB NOT NULL
);


CREATE TABLE IF NOT EXISTS offers
(
 mover_id   INT NOT NULL ,
 job_id     INT NOT NULL ,
 amount     INT NOT NULL ,
 start_time DATETIME NOT NULL ,
 PRIMARY KEY (mover_id, job_id),
 FOREIGN KEY (mover_id) REFERENCES movers(mover_id),
 FOREIGN KEY (job_id) REFERENCES jobs(job_id)
  ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS job_photos
(
 photo_id INT PRIMARY KEY NOT NULL ,
 photo    BLOB NOT NULL ,
 job_id   INT NOT NULL ,
  FOREIGN KEY (job_id) REFERENCES jobs(job_id)
  ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS mover_reviews
(
 review_id    INT PRIMARY KEY NOT NULL ,
 review_score TINYINT NOT NULL ,
 mover_id     INT NOT NULL ,
FOREIGN KEY (mover_id) REFERENCES movers(mover_id)
  ON DELETE CASCADE
);


