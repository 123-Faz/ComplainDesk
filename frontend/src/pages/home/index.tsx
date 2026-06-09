// src/pages/Home.tsx
import { motion } from "framer-motion";
import { Star, Users, Headphones, Shield, Clock, Smile } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Your complaints are safely stored and handled with strict security standards.",
  },
  {
    icon: Clock,
    title: "Quick Response",
    description:
      "Track complaints in real-time and get fast resolutions from the support team.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description:
      "Dedicated support team always ready to listen and resolve issues.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Collaborate with other users to identify and solve common issues.",
  },
  {
    icon: Smile,
    title: "User-Friendly",
    description:
      "Simple, intuitive interface designed for everyone to use with ease.",
  },
  {
    icon: Star,
    title: "Trusted Platform",
    description:
      "Thousands of users trust Complaint Desk for fair and transparent handling.",
  },
];

const testimonials = [
  {
    name: "Sarah Khan",
    role: "Student",
    feedback:
      "Complaint Desk helped me get my university issue resolved quickly. Super easy to use!",
  },
  {
    name: "Ahmed Ali",
    role: "IT Specialist",
    feedback:
      "I love how transparent the system is. I can track everything in real time.",
  },
  {
    name: "Maria Fatima",
    role: "Entrepreneur",
    feedback:
      "The community support feature is amazing! It made me feel heard and valued.",
  },
];

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-foreground bg-bg1 mt-10">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r py-20 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-6xl font-extrabold mb-6"
        >
          Welcome to Complaint Desk
        </motion.h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          A modern platform where your voice matters. Submit, track, and resolve
          complaints with transparency and efficiency.
        </p>
        <button className="mt-8 px-6 py-3 bg-blue-600 font-semibold rounded-xl shadow hover:bg-gray-100 transition">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-6xl py-20 px-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-bg2 rounded-2xl shadow p-6 text-center flex flex-col items-center"
          >
            <Icon className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="">{description}</p>
          </motion.div>
        ))}
      </section>

      {/* Community Section */}
      <section className="w-full py-20 px-20  text-center ">
        <div className="py-20  border-2 border-solid rounded-2xl bg-bg2">
          <h2 className="text-5xl font-bold mb-6">Our Role in the Community</h2>
          <p className="max-w-3xl mx-auto text-lg">
            Complaint Desk bridges the gap between individuals and
            organizations. We empower people by giving them a platform to raise
            their voices, collaborate with others, and ensure that issues are
            resolved fairly and transparently.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12 text-blue-700 dark:text-indigo-400">
          What Our Clients Say
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="bg-bg2 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition"
            >
              <p className="italic mb-4 text-gray-600 dark:text-gray-300">
                “{t.feedback}”
              </p>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t.name}
              </h4>
              <span className="text-sm text-blue-600 dark:text-indigo-400 font-medium">
                {t.role}
              </span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
