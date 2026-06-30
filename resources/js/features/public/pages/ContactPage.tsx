import { Mail, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/forms/FormField';
import { toast } from 'sonner';

export function ContactPage() {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toast.success('Message sent! We\'ll get back to you within 24 hours.');
        (e.target as HTMLFormElement).reset();
    };

    return (
        <>
            <div className="page-hero">
                <div className="page-hero-inner">
                    <h1 className="page-hero-title">Contact us</h1>
                    <p className="page-hero-description max-w-xl">
                        Have a question or want to partner with us? We&apos;d love to hear from you.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-2">
                    <div className="space-y-8">
                        {[
                            { icon: Mail, label: 'Email', value: 'hello@talentbridge.com' },
                            { icon: MessageCircle, label: 'Support', value: 'support@talentbridge.com' },
                            { icon: MapPin, label: 'Headquarters', value: 'San Francisco, CA' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-start gap-4">
                                <div className="icon-box-md bg-primary/10 text-primary dark:bg-gold/12 dark:text-gold">
                                    <item.icon className="h-5 w-5" strokeWidth={1.75} />
                                </div>
                                <div>
                                    <p className="font-medium">{item.label}</p>
                                    <p className="text-muted-foreground">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 rounded-xl border border-border/60 bg-card p-8 shadow-elevation-1"
                    >
                        <FormField label="Name" htmlFor="contact-name" required>
                            <Input id="contact-name" required placeholder="Your name" />
                        </FormField>
                        <FormField label="Email" htmlFor="contact-email" required>
                            <Input id="contact-email" type="email" required placeholder="you@email.com" />
                        </FormField>
                        <FormField label="Subject" htmlFor="contact-subject" required>
                            <Input id="contact-subject" required placeholder="How can we help?" />
                        </FormField>
                        <FormField label="Message" htmlFor="contact-message" required>
                            <Textarea id="contact-message" required rows={5} className="resize-none" placeholder="Your message..." />
                        </FormField>
                        <Button type="submit" className="w-full">
                            Send message
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
