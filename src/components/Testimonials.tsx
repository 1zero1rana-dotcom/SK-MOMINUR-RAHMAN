import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { useSettings } from "../contexts/SettingsContext";

export default function Testimonials() {
  const { settings } = useSettings();
  
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-primary">{settings.testimonialsTitle}</h2>
          <p className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            {settings.testimonialsSubtitle}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            {settings.testimonialsDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {settings.testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-3xl bg-gray-50 p-8 pt-12 shadow-sm ring-1 ring-gray-100"
            >
              <div className="absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
                <Quote className="h-6 w-6" />
              </div>

              <div className="mb-6 flex gap-1 text-yellow-500">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>

              <p className="mb-8 text-lg italic leading-relaxed text-gray-700">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
                />
                <div>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
