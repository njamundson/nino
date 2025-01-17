import { supabase } from "@/integrations/supabase/client";

interface CreateCheckoutOptions {
  returnUrl: string;
}

export const createCheckoutSession = async ({ returnUrl }: CreateCheckoutOptions) => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
  if (sessionError || !session) {
    throw new Error("Authentication required");
  }

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { returnUrl },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    console.error('Checkout error:', error);
    if (error.message.includes("Already subscribed")) {
      throw new Error("You are already subscribed to Nino Pro");
    }
    throw new Error(error.message);
  }

  if (!data?.url) {
    throw new Error('No checkout URL received');
  }

  return data.url;
};