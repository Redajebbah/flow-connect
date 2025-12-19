-- Fix function search_path warnings
CREATE OR REPLACE FUNCTION public.generate_dossier_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reference := 'DOS-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('dossier_reference_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.log_dossier_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.status_history (dossier_id, status, previous_status, user_id)
    VALUES (NEW.id, NEW.status, OLD.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;