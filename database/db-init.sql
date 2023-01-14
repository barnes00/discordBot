CREATE TABLE users (
    user_id BIGINT,
    PRIMARY KEY (user_id)
);

CREATE TABLE action_types (
    action_type_id INT GENERATED ALWAYS AS IDENTITY,  
    action_name VARCHAR(15) UNIQUE NOT NULL,
    PRIMARY KEY(action_type_id)
);

CREATE TABLE action_counters (
    action_counter_id INT GENERATED ALWAYS AS IDENTITY, 
    action_type_id INT NOT NULL,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    count INT NOT NULL,
    PRIMARY KEY(action_counter_id),
    CONSTRAINT fk_action
       FOREIGN KEY(action_type_id)
          REFERENCES action_types(action_type_id)
          ON DELETE CASCADE,
    CONSTRAINT fk_sender
       FOREIGN KEY(sender_id)
          REFERENCES users(user_id)
          ON DELETE CASCADE,
    CONSTRAINT fk_receiver
       FOREIGN KEY(receiver_id)
          REFERENCES users(user_id)
          ON DELETE CASCADE,
    UNIQUE (action_type_id, sender_id, receiver_id)
);

CREATE TABLE reminders (
    reminder_id INT GENERATED ALWAYS AS IDENTITY, 
    remind_on TIMESTAMP NOT NULL, 
    creator_id BIGINT NOT NULL, 
    reminder_message VARCHAR(255) NOT NULL,
    PRIMARY KEY(reminder_id),
    CONSTRAINT fk_creator
       FOREIGN KEY(creator_id)
          REFERENCES users(user_id)
          ON DELETE CASCADE         
);
