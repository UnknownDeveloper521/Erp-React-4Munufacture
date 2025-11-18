-- Additional HR-related tables for payroll, performance, and training
-- WARNING: This schema is for context only and is not meant to be run directly.

-- Payroll runs (high-level per-period payroll summary)
CREATE TABLE public.payroll_runs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  period_label character varying NOT NULL,
  period_start date NOT NULL,
  period_end date NOT NULL,
  run_date date NOT NULL,
  status character varying DEFAULT 'Completed'::character varying,
  total_employees integer DEFAULT 0,
  total_gross numeric DEFAULT 0,
  total_net numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payroll_runs_pkey PRIMARY KEY (id)
);

-- Payroll items (per-employee amounts for a payroll run)
CREATE TABLE public.payroll_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  gross_amount numeric NOT NULL,
  net_amount numeric NOT NULL,
  tax_amount numeric DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payroll_items_pkey PRIMARY KEY (id),
  CONSTRAINT payroll_items_run_id_fkey FOREIGN KEY (run_id) REFERENCES public.payroll_runs(id),
  CONSTRAINT payroll_items_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);

-- Performance reviews
CREATE TABLE public.performance_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  reviewer_id uuid,
  period_start date NOT NULL,
  period_end date NOT NULL,
  rating character varying NOT NULL,
  comments text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT performance_reviews_pkey PRIMARY KEY (id),
  CONSTRAINT performance_reviews_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);

-- Performance goals
CREATE TABLE public.performance_goals (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL,
  title character varying NOT NULL,
  description text,
  due_date date,
  status character varying DEFAULT 'Not Started'::character varying,
  progress integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT performance_goals_pkey PRIMARY KEY (id),
  CONSTRAINT performance_goals_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);

-- Training programs
CREATE TABLE public.training_programs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description text,
  start_date date,
  end_date date,
  location character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT training_programs_pkey PRIMARY KEY (id)
);

-- Training enrollments (employees attending programs)
CREATE TABLE public.training_enrollments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  program_id uuid NOT NULL,
  employee_id uuid NOT NULL,
  status character varying DEFAULT 'Enrolled'::character varying,
  completion_date date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT training_enrollments_pkey PRIMARY KEY (id),
  CONSTRAINT training_enrollments_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.training_programs(id),
  CONSTRAINT training_enrollments_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);

-- Sample data inserts (illustrative only)

-- Example payroll run
INSERT INTO public.payroll_runs (period_label, period_start, period_end, run_date, status, total_employees, total_gross, total_net)
VALUES ('Jan 2024', '2024-01-01', '2024-01-31', '2024-01-31', 'Completed', 3, 15000, 12000);

-- Example performance reviews
INSERT INTO public.performance_reviews (employee_id, reviewer_id, period_start, period_end, rating, comments)
VALUES
  ('00000000-0000-0000-0000-000000000001', NULL, '2023-10-01', '2023-12-31', 'Exceeds Expectations', 'Consistently delivers high quality work.'),
  ('00000000-0000-0000-0000-000000000002', NULL, '2023-10-01', '2023-12-31', 'Meets Expectations', 'Solid performance with room for growth.');

-- Example goals
INSERT INTO public.performance_goals (employee_id, title, description, due_date, status, progress)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Improve customer satisfaction scores', 'Increase CSAT by 10%', '2024-06-30', 'In Progress', 60),
  ('00000000-0000-0000-0000-000000000002', 'Complete advanced HR certification', 'Finish external HR course', '2024-09-30', 'Not Started', 0);

-- Example training programs
INSERT INTO public.training_programs (code, name, description, start_date, end_date, location)
VALUES
  ('ONBOARDING', 'Onboarding Program', 'New hire onboarding program', '2024-02-01', '2024-02-15', 'Head Office'),
  ('LEADERSHIP', 'Leadership Essentials', 'Leadership training for managers', '2024-03-10', '2024-03-20', 'Online');

-- Example training enrollments
INSERT INTO public.training_enrollments (program_id, employee_id, status)
VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Enrolled');
