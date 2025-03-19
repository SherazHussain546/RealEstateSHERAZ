import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertViewingSchema, type InsertViewing } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/firebase";

interface BookingFormProps {
  propertyId: number;
}

export function BookingForm({ propertyId }: BookingFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<InsertViewing>({
    resolver: zodResolver(insertViewingSchema),
    defaultValues: {
      propertyId,
      userId: user?.uid || "",
      date: new Date(),
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertViewing) => {
      await apiRequest("POST", "/api/viewings", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your viewing has been booked!"
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Viewing Date</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={field.value instanceof Date ? field.value.toISOString().slice(0, 16) : ''}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Booking..." : "Book Viewing"}
        </Button>
      </form>
    </Form>
  );
}