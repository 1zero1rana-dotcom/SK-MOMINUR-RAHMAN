import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Tanvir Ahmed",
    role: "HSC 2025 Batch",
    content: "Redwan Master's ICT course is a game-changer. The way he explains C programming is just amazing. I used to be afraid of coding, but now I love it!",
    avatar: "https://i.pravatar.cc/150?u=tanvir",
    rating: 5,
  },
  {
    name: "Sadia Islam",
    role: "HSC 2024 Batch",
    content: "The interactive quizzes and chapter-wise notes helped me a lot. I got A+ in ICT thanks to this platform. Highly recommended for all HSC students.",
    avatar: "https://i.pravatar.cc/150?u=sadia",
    rating: 5,
  },
  {
    name: "Fahim Shahriar",
    role: "Admission 2025",
    content: "Best platform for ICT in Bangladesh. The quality of content and the support from the community is unmatched. It feels like a real classroom.",
    avatar: "https://i.pravatar.cc/150?u=fahim",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-bold uppercase tracking-widest text-indigo-600">Testimonials</h2>
          <p className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">
            What Our Students Say
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Join thousands of satisfied students who have transformed their learning experience with us.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative rounded-3xl bg-gray-50 p-8 pt-12 shadow-sm ring-1 ring-gray-100"
            >
              <div className="absolute -top-6 left-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
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
