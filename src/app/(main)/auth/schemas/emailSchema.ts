import z from "zod";


// Zod schema
export const emailSchema = z.object({
  email: z.email("Please enter a valid email so we can sale to the highest bidder. Or just use Google - much better."),
});

export type EmailFormValues = z.infer<typeof emailSchema>;