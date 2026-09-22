
import { motion } from 'framer-motion';
import { Users, Star, Heart } from 'lucide-react';

export const SocialProof = () => {
  const items = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      value: "50K+",
      label: "Members"
    },
    {
      icon: <Heart className="w-6 h-6 text-secondary" />,
      value: "120K+",
      label: "Matches"
    },
    {
      icon: <Star className="w-6 h-6 text-pink-400" />,
      value: "4.9/5",
      label: "Experience"
    }
  ];

  return (
    <section className="py-12 border-b border-white/5 bg-background relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-white/60 font-medium tracking-wide">
            Join thousands of people looking for meaningful connections.
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-32">
          {items.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="flex items-center gap-4 group"
            >
              <div className="p-3 rounded-2xl glass group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h4 className="text-2xl font-bold">{item.value}</h4>
                <p className="text-sm text-white/50">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
