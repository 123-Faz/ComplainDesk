// src/pages/Contact.tsx
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 🚀 later connect with backend / API
    console.log("Form Submitted:", formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="flex flex-col items-center text-foreground bg-bg1 mt-10">
      {/* Hero Section */}
      <section className="w-full py-20 px-6 text-center bg-gradient-to-r">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-extrabold mb-4"
        >
          Contact Us
        </motion.h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          We’d love to hear from you! Reach out with questions, complaints, or suggestions.
        </p>
      </section>

      {/* Contact Info + Form */}
      <section className="w-full max-w-6xl py-10 px-6 grid gap-12 md:grid-cols-2">
        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-bg2 rounded-2xl shadow-lg p-8 flex flex-col gap-6"
        >
          <h3 className="text-2xl font-semibold mb-2">Send us a Message</h3>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows={5}
            required
            value={formData.message}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
          >
            <Send className="w-5 h-5" />
            Send Message
          </button>
        </motion.form>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-5xl font-bold mb-4 text-center">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Whether you have a complaint to lodge, feedback to share, or just want to say hello,
            we’re here to listen. Contact us anytime and we’ll respond as soon as possible.
          </p>
          <div className="space-y-16 mt-15">
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <span className="text-2xl">support@complaintdesk.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-blue-600" />
              <span className="text-2xl">+92 123 456 7890</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <span className="text-2xl">123 Complaint Desk Street, Karachi, Pakistan</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;
