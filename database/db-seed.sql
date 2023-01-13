INSERT INTO action_types(action_name)
VALUES ('hug')
ON CONFLICT (action_name) 
DO NOTHING;

INSERT INTO action_types(action_name)
VALUES ('kiss')
ON CONFLICT (action_name) 
DO NOTHING;