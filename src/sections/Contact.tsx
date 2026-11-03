import { useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "react-hot-toast";
import "./Contact.css";

type FormData = {
  name: string;
  phone: string;
  "bot-field": string;
  email: string;
  message: string;
};

export default function Contact() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  // helper: url-encode
  const encode = (data: Record<string, string>) =>
    Object.keys(data)
      .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(data[k] ?? ""))
      .join("&");

  const onSubmit = async (data: FormData) => {
    setSent(false);
    const payload = {
      "form-name": "contact-main", // ОБЯЗАТЕЛЬНО: имя формы для Netlify
      ...data,
    };

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(payload),
      });
      if (!res.ok) throw new Error("Submit failed");

      // (опц.) toast.dismiss(); toast.success("Message sent!");
      reset();
      setSent(true);
    } catch (e) {
      toast.dismiss(); toast.error("Failed to send. Try again later.");
      console.error(e);

    }
  };

  return (
    <section className="contact" id="contact">
      {/* <h2 className="contact__title">Get in touch</h2> */}

      <div className="contactcard">
        <div className="contactcard__info">
          <h2>Start a Conversation</h2>
          <p>Whether you have a question, an idea, or would like to learn more about our services, we would be happy to hear from you.</p>

          <h3>Email</h3>
          <a href="mailto:info@nostracura.ca" className="contactcard__email">
            info@nostracura.ca
          </a>
        </div>

        {/* ВАЖНО: имя формы и атрибуты Netlify */}
        <form
          name="contact-main"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          className="contactcard__form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* honeypot */}
          <p hidden>
            <label>Don’t fill this out: <input {...register("bot-field")} /></label>
          </p>

          {/* скрытое поле form-name для Netlify */}
          <input type="hidden" name="form-name" value="contact-main" />

          <label>
            Name
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Your name"
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </label>

          <label>
            Phone
            <input
              {...register("phone", {

                pattern: {
                  value: /^\+?[\d\s\-()]{7,20}$/,
                  message: "Invalid phone format",
                },
              })}
              placeholder="Your phone number"
            />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </label>

          <label>
            Email Address
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              placeholder="Email address"
              type="email"
              inputMode="email"
              autoComplete="email"
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </label>

          <label>
            What would you like to discuss?
            <textarea
              {...register("message", { required: "Message is required" })}
              placeholder="Tell us about your situation, question, or how we can help."
              rows={4}
            />
            {errors.message && <span className="error">{errors.message.message}</span>}
          </label>

          {/* (опц.) reCAPTCHA — перед кнопкой */}


          <button type="submit" className="btn btn--submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {sent && (
            <p className="success" role="status">Your message has been sent successfully!</p>
          )}
        </form>
      </div>

      <Toaster position="top-right" />
    </section>
  );
}
