begin;

create table public.patient_registration_rate_limits (
  ip_hash text not null check (ip_hash ~ '^[a-f0-9]{64}$'),
  window_start timestamptz not null,
  request_count smallint not null default 0 check (request_count between 0 and 11),
  primary key (ip_hash, window_start)
);

create index patient_registration_rate_limits_window_start_idx
  on public.patient_registration_rate_limits (window_start);

alter table public.patient_registration_rate_limits enable row level security;
revoke all on table public.patient_registration_rate_limits from public, anon, authenticated, service_role;

create or replace function public.allow_patient_registration(p_ip_hash text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  current_window timestamptz := date_trunc('hour', timezone('UTC', now())) at time zone 'UTC';
  current_count smallint;
begin
  if p_ip_hash is null or p_ip_hash !~ '^[a-f0-9]{64}$' then
    return false;
  end if;

  delete from public.patient_registration_rate_limits
  where window_start < current_window - interval '2 hours';

  insert into public.patient_registration_rate_limits (ip_hash, window_start, request_count)
  values (p_ip_hash, current_window, 1)
  on conflict (ip_hash, window_start)
  do update set request_count = least(public.patient_registration_rate_limits.request_count + 1, 11)
  returning request_count into current_count;

  return current_count <= 10;
end;
$function$;

revoke all on function public.allow_patient_registration(text) from public, anon, authenticated;
grant execute on function public.allow_patient_registration(text) to service_role;

commit;
