-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.attendance (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  employee_id uuid,
  date date NOT NULL,
  check_in time without time zone,
  check_out time without time zone,
  break_duration integer DEFAULT 0,
  total_hours numeric,
  status character varying DEFAULT 'Present'::character varying,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT attendance_pkey PRIMARY KEY (id)
);
CREATE TABLE public.departments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description text,
  parent_department_id uuid,
  department_head_id uuid,
  budget numeric,
  location character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT departments_pkey PRIMARY KEY (id),
  CONSTRAINT departments_parent_department_id_fkey FOREIGN KEY (parent_department_id) REFERENCES public.departments(id),
  CONSTRAINT fk_department_head FOREIGN KEY (department_head_id) REFERENCES public.employees(id)
);
CREATE TABLE public.employee_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT employee_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.employees (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  employee_id character varying NOT NULL UNIQUE,
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  phone character varying,
  date_of_birth date,
  gender character varying,
  department_id uuid NOT NULL,
  position_id uuid NOT NULL,
  employee_type_id uuid NOT NULL,
  employment_status_id uuid NOT NULL,
  work_location_id uuid,
  shift_type_id uuid,
  manager_id uuid,
  hire_date date NOT NULL,
  probation_end_date date,
  confirmation_date date,
  termination_date date,
  salary numeric,
  currency character varying DEFAULT 'USD'::character varying,
  address text,
  city character varying,
  state character varying,
  country character varying,
  postal_code character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT employees_pkey PRIMARY KEY (id),
  CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id),
  CONSTRAINT employees_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(id),
  CONSTRAINT employees_employee_type_id_fkey FOREIGN KEY (employee_type_id) REFERENCES public.employee_types(id),
  CONSTRAINT employees_employment_status_id_fkey FOREIGN KEY (employment_status_id) REFERENCES public.employment_status(id),
  CONSTRAINT employees_work_location_id_fkey FOREIGN KEY (work_location_id) REFERENCES public.work_locations(id),
  CONSTRAINT employees_shift_type_id_fkey FOREIGN KEY (shift_type_id) REFERENCES public.shift_types(id),
  CONSTRAINT employees_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.employees(id)
);
CREATE TABLE public.employment_status (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT employment_status_pkey PRIMARY KEY (id)
);
CREATE TABLE public.leave_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  employee_id uuid,
  leave_type character varying NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  total_days integer NOT NULL,
  reason text,
  status character varying DEFAULT 'Pending'::character varying,
  approved_by uuid,
  approved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT leave_requests_pkey PRIMARY KEY (id)
);
CREATE TABLE public.positions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  title character varying NOT NULL,
  description text,
  department_id uuid,
  level integer DEFAULT 1,
  min_salary numeric,
  max_salary numeric,
  required_experience integer,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT positions_pkey PRIMARY KEY (id),
  CONSTRAINT positions_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id)
);
CREATE TABLE public.shift_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  break_duration integer DEFAULT 60,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shift_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  employee_id uuid,
  first_name character varying,
  last_name character varying,
  avatar_url text,
  role character varying DEFAULT 'employee'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT fk_user_employee FOREIGN KEY (employee_id) REFERENCES public.employees(id)
);
CREATE TABLE public.work_locations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code character varying NOT NULL UNIQUE,
  name character varying NOT NULL,
  address text,
  city character varying,
  state character varying,
  country character varying,
  postal_code character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT work_locations_pkey PRIMARY KEY (id)
);