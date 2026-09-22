
import { Shield, Lock, UserX, MessageSquareWarning } from 'lucide-react';
import { motion } from 'framer-motion';

export const SafetySection = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Profile verification",
      desc: "Every profile goes through photo verification to ensure they are real."
    },
    {
      icon: <Lock className="w-8 h-8 text-secondary" />,
      title: "Privacy controls",
      desc: "You control who sees your profile and what information you share."
    },
    {
      icon: <UserX className="w-8 h-8 text-pink-400" />,
      title: "Block & report",
      desc: "Easily block or report users who violate our community guidelines."
    },
    {
      icon: <MessageSquareWarning className="w-8 h-8 text-purple-400" />,
      title: "Secure conversations",
      desc: "End-to-end encryption for your messages keeps your chats private."
    }
  ];

  return (
    <section id="safety" className="py-24 bg-background border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Connection should feel <span className="text-gradient">safe.</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            We've built Pairly with your privacy and security at its core, so you can focus on making meaningful connections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="glass p-8 rounded-3xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white/10 transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
