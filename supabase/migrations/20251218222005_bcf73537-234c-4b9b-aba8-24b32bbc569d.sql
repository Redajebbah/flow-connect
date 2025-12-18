-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'commercial', 'technical', 'supervisor');

-- Create enum for subscription types
CREATE TYPE public.subscription_type AS ENUM ('water', 'electricity', 'both');

-- Create enum for dossier status
CREATE TYPE public.dossier_status AS ENUM (
  'DRAFT',
  'DOSSIER_COMPLETE',
  'TECHNICAL_REVIEW',
  'WORKS_REQUIRED',
  'WORKS_VALIDATED',
  'CONTRACT_SENT',
  'CONTRACT_SIGNED',
  'METER_SCHEDULED',
  'METER_INSTALLED',
  'INSTALLATION_REPORT_RECEIVED',
  'CUSTOMER_VALIDATED',
  'SUBSCRIPTION_ACTIVE',
  'REJECTED',
  'CANCELLED'
);

-- Create enum for document types
CREATE TYPE public.document_type AS ENUM ('national_id', 'contract', 'quotation', 'installation_report', 'other');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'commercial',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  national_id TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  region TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create dossiers table
CREATE TABLE public.dossiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  subscription_type subscription_type NOT NULL,
  status dossier_status NOT NULL DEFAULT 'DRAFT',
  assigned_to UUID REFERENCES auth.users(id),
  works_required BOOLEAN NOT NULL DEFAULT false,
  quotation_amount DECIMAL(10, 2),
  installation_date TIMESTAMP WITH TIME ZONE,
  meter_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id UUID REFERENCES public.dossiers(id) ON DELETE CASCADE NOT NULL,
  type document_type NOT NULL,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create status_history table for audit trail
CREATE TABLE public.status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dossier_id UUID REFERENCES public.dossiers(id) ON DELETE CASCADE NOT NULL,
  status dossier_status NOT NULL,
  previous_status dossier_status,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dossiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_history ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get user's role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User roles policies (only admins can manage)
CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert own role on signup" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Customers policies (all authenticated users can view and manage)
CREATE POLICY "Authenticated users can view customers" ON public.customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert customers" ON public.customers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update customers" ON public.customers
  FOR UPDATE TO authenticated USING (true);

-- Dossiers policies
CREATE POLICY "Authenticated users can view dossiers" ON public.dossiers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create dossiers" ON public.dossiers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update dossiers" ON public.dossiers
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete dossiers" ON public.dossiers
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Documents policies
CREATE POLICY "Authenticated users can view documents" ON public.documents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can upload documents" ON public.documents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Authenticated users can update documents" ON public.documents
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete own documents" ON public.documents
  FOR DELETE TO authenticated USING (auth.uid() = uploaded_by OR public.has_role(auth.uid(), 'admin'));

-- Status history policies
CREATE POLICY "Authenticated users can view status history" ON public.status_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create status history" ON public.status_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Create trigger for auto-creating profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', '')
  );
  
  -- Assign default role (commercial)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'commercial');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dossiers_updated_at
  BEFORE UPDATE ON public.dossiers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate dossier reference
CREATE OR REPLACE FUNCTION public.generate_dossier_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reference := 'DOS-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('dossier_reference_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for dossier references
CREATE SEQUENCE IF NOT EXISTS dossier_reference_seq START 1;

CREATE TRIGGER set_dossier_reference
  BEFORE INSERT ON public.dossiers
  FOR EACH ROW
  WHEN (NEW.reference IS NULL OR NEW.reference = '')
  EXECUTE FUNCTION public.generate_dossier_reference();

-- Create function to log status changes
CREATE OR REPLACE FUNCTION public.log_dossier_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.status_history (dossier_id, status, previous_status, user_id)
    VALUES (NEW.id, NEW.status, OLD.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_dossier_status
  AFTER UPDATE ON public.dossiers
  FOR EACH ROW EXECUTE FUNCTION public.log_dossier_status_change();

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'dossier-documents',
  'dossier-documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
);

-- Storage policies
CREATE POLICY "Authenticated users can view documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'dossier-documents');

CREATE POLICY "Authenticated users can upload documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'dossier-documents');

CREATE POLICY "Authenticated users can update documents" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'dossier-documents');

CREATE POLICY "Admins can delete documents" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'dossier-documents');