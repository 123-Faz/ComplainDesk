// src/pages/Working.tsx
import { motion } from "framer-motion";
import { FileText, Send, Clock, Users, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Step 1: Register & Login",
    description:
      "Create an account or log in to access the Complaint Desk dashboard.",
  },
  {
    icon: Send,
    title: "Step 2: Submit Complaint",
    description:
      "Fill in complaint details and submit it through the simple online form.",
  },
  {
    icon: Clock,
    title: "Step 3: Track Progress",
    description:
      "Monitor the real-time status of your complaint, from submission to resolution.",
  },
  {
    icon: Users,
    title: "Step 4: Review & Collaboration",
    description:
      "Engage with the community and support team for updates and shared solutions.",
  },
  {
    icon: CheckCircle,
    title: "Step 5: Resolution",
    description:
      "Receive a fair, transparent, and documented resolution for your complaint.",
  },
];

const Working: React.FC = () => {
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
          How Complaint Desk Works
        </motion.h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">
          A clear, step-by-step process designed to ensure your complaints are
          handled quickly, fairly, and transparently.
        </p>
      </section>

      {/* Steps Section */}
      <section className="w-full max-w-6xl py-20 px-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {steps.map(({ icon: Icon, title, description }, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="bg-bg2 rounded-2xl shadow p-6 text-center flex flex-col items-center"
          >
            <Icon className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p>{description}</p>
          </motion.div>
        ))}
      </section>

      {/* Why It Matters Section */}
      <section className="w-full py-20 px-20 text-center">
        <div className="py-20 border-2 border-solid rounded-2xl bg-bg2">
          <h2 className="text-5xl font-bold mb-6">Why This Process Matters</h2>
          <p className="max-w-3xl mx-auto text-lg">
            Complaint Desk streamlines the complaint management journey by
            offering transparency at every stage. From registration to final
            resolution, each step is designed to empower individuals and foster
            trust between users and organizations.
          </p>
        </div>
      </section>

      {/* Closing Section */}
      <section className="w-full text-center py-20 px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-4"
        >
          Ready to Resolve Your Issues?
        </motion.h2>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          Join thousands of satisfied users and experience a smoother complaint
          resolution process today.
        </p>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
          Get Started Now
        </button>
      </section>
    </div>
  );
};

export default Working;
