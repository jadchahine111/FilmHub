import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    // Wrapper for centering the form
    <div className="flex items-center justify-center min-h-screen ">
      {/* Form container */}
      <div className="w-full max-w-2xl space-y-8 bg-white p-6 rounded-lg shadow-lg">
        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Contact us</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </div>
        {/* Form inputs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Enter your email" type="email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Enter the subject" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Enter your message" className="min-h-[100px]" />
          </div>
          <Button className="w-full">Send message</Button>
        </div>
      </div>
    </div>
  );
}
