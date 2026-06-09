// src/pages/About.tsx
import { motion } from "framer-motion";
import { Users, Lightbulb, Shield, HeartHandshake } from "lucide-react";

const capabilities = [
  {
    icon: Lightbulb,
    title: "Empower Users",
    description:
      "Enable individuals to raise concerns confidently with a platform built for transparency.",
  },
  {
    icon: Shield,
    title: "Protect Rights",
    description:
      "Ensure every voice is heard and every complaint is securely documented.",
  },
  {
    icon: HeartHandshake,
    title: "Bridge the Gap",
    description:
      "Create a trusted channel between users and organizations for better resolutions.",
  },
  {
    icon: Users,
    title: "Build Community",
    description:
      "Foster collaboration among users to address common issues and grow stronger together.",
  },
];

const About: React.FC = () => {
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
          About Complaint Desk
        </motion.h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Complaint Desk isn’t just a platform — it’s a movement.  
          We empower people, protect rights, and build trust through open, fair, and transparent complaint management.
        </p>
      </section>

      {/* What We Can Do Section */}
      <section className="w-full max-w-6xl py-20 px-6 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        {capabilities.map(({ icon: Icon, title, description }, i) => (
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

      {/* What Complaint Desk Can Do */}
      <section className="w-full py-20 px-10 text-center">
        <div className="py-16 border-2 border-solid rounded-2xl bg-bg2">
          <h2 className="text-4xl font-bold mb-6">What Complaint Desk Can Do</h2>
          <p className="max-w-4xl mx-auto text-lg">
            Complaint Desk provides a safe and reliable space for people to share their grievances,
            track their progress, and work together towards fair solutions.  
            By combining security, speed, and transparency, we ensure that no complaint is ignored
            and every issue gets the attention it deserves.
          </p>
        </div>
      </section>

      {/* Community Call-to-Action */}
      <section className="w-full text-center py-20 px-6">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold mb-4"
        >
          Join Our Community
        </motion.h2>
        <p className="text-lg max-w-2xl mx-auto mb-6">
          At Complaint Desk, community means everything. Together we amplify voices, 
          solve problems faster, and build trust across individuals and organizations.  
          Become part of our growing family and let’s create change, together.
        </p>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
          Join Now
        </button>
      </section>
    </div>
  );
};

export default About;
