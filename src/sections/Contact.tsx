import { useForm } from "react-hook-form";
import "./Contact.css";

type FormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Submitted data:", data);
    reset();
  };

  return (
    <section className="contact" id="contact">
      <h2 className="contact__title">Get in touch</h2>

      <div className="contactcard">
        <div className="contactcard__info">
          <h3>Get in touch</h3>
          <p>
            Let’s talk. Submit your details in this form and we will get back to you ASAP.
          </p>

          <h3>Contact</h3>
          <a href="mailto:info@nostracura.ca" className="contactcard__email">
            info@nostracura.ca
          </a>
        </div>

        <form className="contactcard__form" onSubmit={handleSubmit(onSubmit)}>
          <label>
            Name
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Name"
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </label>

          <label>
            Phone
            <input
              {...register("phone", {
                required: "Phone number required",
                pattern: {
                  value: /^\+?[\d\s\-()]{7,20}$/,
                  message: "Invalid phone format",
                },
              })}
              placeholder="+ 1 (000) - 000 - 0000"
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
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </label>

          <label>
            How can we help?
            <textarea
              {...register("message", { required: "Message is required" })}
              placeholder="Write your text here"
              rows={4}
            />
            {errors.message && <span className="error">{errors.message.message}</span>}
          </label>

          <button type="submit" className="btn btn--submit">
            Submit
          </button>

          {isSubmitSuccessful && (
            <p className="success">✅ Your message has been sent successfully!</p>
          )}
        </form>
      </div>
    </section>
  );
}